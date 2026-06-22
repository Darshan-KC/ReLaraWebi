<?php 

namespace App\DTO\Conversation;

class OpenConversationDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $friendId,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: auth()->id(),
            friendId: $data['friend_id'],
        );
    }
}