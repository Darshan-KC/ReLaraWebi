<?php

namespace App\Http\Controllers\Api;

use App\Actions\Friendship\AcceptFriendRequestAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Friendship\SendFriendRequest;
use App\Http\Resources\FriendshipResource;
use Illuminate\Http\Request;
use App\DTO\Friendship\SendFriendRequestDTO;
use App\Actions\Friendship\SendFriendRequestAction;
use App\Models\Friendship;

class FriendshipController extends Controller
{
    public function users(Request $request)
    {
        $user = $request->user();

        $users = \App\Models\User::where('id', '!=', $user->id)->get();

        return response()->json([
            'data' => $users,
        ]);
    }
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

    public function accept(
        Friendship $friendship,
        AcceptFriendRequestAction $action,
    ) {

        $friendship = $action->execute(
            $friendship
        );

        $friendship->load(['sender', 'receiver']);

        return response()->json([
            'message' => 'Friend request accepted.',
            'data' => FriendshipResource::make(
                $friendship
            ),
        ]);
    }

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
}
