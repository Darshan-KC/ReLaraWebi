<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Friendship\SendFriendRequest;
use App\Http\Resources\FriendshipResource;
use Illuminate\Http\Request;
use App\DTO\Friendship\SendFriendRequestDTO;

class FriendshipController extends Controller
{
    public function store(
        SendFriendRequest $request,
    ) {

        $dto = SendFriendRequestDTO::fromArray(
            $request->validated()
        );

        // $friendship = $action->execute($dto);

        $friendship = [];

        return response()->json([
            'message' => 'Friend request sent.',
            'data' => FriendshipResource::make(
                $friendship
            ),
        ]);
    }
}
