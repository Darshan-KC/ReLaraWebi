<?php

namespace App\Actions\Friendship;

use App\DTO\Friendship\SendFriendRequestDTO;
use App\Models\Friendship;

class SendFriendRequestAction
{
    public function execute(
        SendFriendRequestDTO $dto
    ): Friendship {

        $existing = Friendship::query()
            ->where(function ($query) use ($dto) {

                $query
                    ->where('sender_id', $dto->senderId)
                    ->where('receiver_id', $dto->receiverId);
            })
            ->orWhere(function ($query) use ($dto) {

                $query
                    ->where('sender_id', $dto->receiverId)
                    ->where('receiver_id', $dto->senderId);
            })
            ->first();

        if ($existing) {
            throw new \Exception(
                'Friend request already exists.'
            );
        }

        return Friendship::create([
            'sender_id' => $dto->senderId,
            'receiver_id' => $dto->receiverId,
            'status' => 'pending',
        ]);
    }
}
