<?php

namespace App\DTO\Friendship;

use Illuminate\Support\Facades\Auth;

class SendFriendRequestDTO
{
    public function __construct(
        public readonly int $senderId,
        public readonly int $receiverId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            senderId: Auth::id(),
            receiverId: $data['receiver_id'],
        );
    }
}