<?php

namespace App\DTO\Message;

class SendMessageDTO
{
    public function __construct(
        public readonly int $conversationId,
        public readonly int $senderId,
        public readonly string $body,
        public readonly string $type = 'text',
    ) {}

    public static function fromRequest($request): self
    {
        return new self(
            conversationId: $request->conversation_id,
            senderId: $request->user()->id,
            body: $request->body,
            type: $request->type ?? 'text',
        );
    }
}
