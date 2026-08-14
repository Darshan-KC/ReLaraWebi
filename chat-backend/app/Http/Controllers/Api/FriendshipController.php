<?php

namespace App\Http\Controllers\Api;

use App\Actions\Friendship\AcceptFriendRequestAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Friendship\SendFriendRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\FriendshipResource;
use Illuminate\Http\Request;
use App\DTO\Friendship\SendFriendRequestDTO;
use App\Actions\Friendship\SendFriendRequestAction;
use App\Models\Friendship;

class FriendshipController extends Controller
{
    /**
     * Display a listing of users that are not friends with the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function users(Request $request)
    {
        $user = $request->user();

        $relatedUserIds = Friendship::where(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                    ->orWhere('receiver_id', $user->id);
            })
            ->get()
            ->flatMap(fn ($f) => [$f->sender_id, $f->receiver_id])
            ->filter(fn ($id) => $id !== $user->id)
            ->unique()
            ->values();

        $users = \App\Models\User::where('id', '!=', $user->id)
            ->whereNotIn('id', $relatedUserIds)
            ->get();

        return response()->json([
            'data' => $users,
        ]);
    }

    /**
     * Send a friend request to another user.
     *
     * @param SendFriendRequest $request
     * @param SendFriendRequestAction $action
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(
        SendFriendRequest $request,
        SendFriendRequestAction $action
    ) {

        $dto = SendFriendRequestDTO::fromArray(
            $request->validated()
        );

        $friendship = $action->execute($dto);

        $friendship->load(['sender', 'receiver']);

        return response()->json([
            'message' => 'Friend request sent.',
            'data' => FriendshipResource::make(
                $friendship
            ),
        ]);
    }

    /**
     * Accept a friend request.
     *
     * @param Friendship $friendship
     * @param AcceptFriendRequestAction $action
     * @return \Illuminate\Http\JsonResponse
     */
    public function accept(
        Friendship $friendship,
        AcceptFriendRequestAction $action,
    ) {

        $result = $action->execute(
            $friendship
        );

        $result['friendship']->load(['sender', 'receiver']);
        $result['conversation']->load('participants');

        return response()->json([
            'message' => 'Friend request accepted.',
            'data' => FriendshipResource::make(
                $result['friendship']
            ),
            'conversation' => ConversationResource::make(
                $result['conversation']
            ),
        ]);
    }

    /**
     * List all pending friend requests for the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listRequests(Request $request)
    {
        $user = $request->user();

        $friendRequests = Friendship::with(['sender', 'receiver'])
            ->where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->get();

        return response()->json([
            'data' => FriendshipResource::collection($friendRequests),
        ]);
    }

    /**
     * List all friends for the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listFriends(Request $request)
    {
        $user = $request->user();

        $friends = Friendship::with(['sender', 'receiver'])
            ->where(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                    ->orWhere('receiver_id', $user->id);
            })
            ->where('status', 'accepted')
            ->get();

        return response()->json([
            'data' => FriendshipResource::collection($friends),
        ]);
    }

    /**
     * List all sent friend requests for the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listSentRequests(Request $request)
    {
        $user = $request->user();

        $sentRequests = Friendship::with(['sender', 'receiver'])
            ->where('sender_id', $user->id)
            ->where('status', 'pending')
            ->get();

        return response()->json([
            'data' => FriendshipResource::collection($sentRequests),
        ]);
    }

    /**
     * Unfriend a user.
     *
     * @param Friendship $friendship
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Friendship $friendship)
    {
        $user = request()->user();

        abort_unless(
            $friendship->status === 'accepted'
                && in_array($user->id, [
                    $friendship->sender_id,
                    $friendship->receiver_id,
                ]),
            403,
            'Not authorized.'
        );

        $friendship->delete();

        return response()->json([
            'message' => 'Unfriended successfully.',
        ]);
    }
}
