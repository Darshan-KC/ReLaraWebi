<?php

namespace App\DTO\MessageReaction;

class MessageReactionDTO
{
    public function __construct(
        public int $messageId,
        public int $userId,
        public string $emoji,
    ) {}

    public static function fromRequest(int $messageId, int $userId, string $emoji): self
    {
        return new self(
            messageId: $messageId,
            userId: $userId,
            emoji: $emoji,
        );
    }
}
