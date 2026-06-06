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
    public function store(
        SendFriendRequest $request,
        SendFriendRequestAction $action
    ) {

        $dto = SendFriendRequestDTO::fromArray(
            $request->validated()
        );

        $friendship = $action->execute($dto);

        // $friendship = [];

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

        return response()->json([
            'message' => 'Friend request accepted.',
            'data' => FriendshipResource::make(
                $friendship
            ),
        ]);
    }
}
