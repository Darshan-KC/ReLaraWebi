<?php
namespace App\Actions\Friendship;

use App\DTO\Friendship\SendFriendRequestDTO;

class SendFriendRequestAction
    {
        public function execute(
            SendFriendRequestDTO $dto
        ) {
            // Logic to send a friend request
            // This might involve creating a new Friendship record in the database
            // and sending a notification to the recipient

            // For example:
            // $friendship = Friendship::create([
            //     'sender_id' => $dto->sender_id,
            //     'recipient_id' => $dto->recipient_id,
            //     'status' => 'pending',
            // ]);

            // return $friendship;
        }
    }