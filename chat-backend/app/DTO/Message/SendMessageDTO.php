<?php

namespace App\DTO\Message;

use Illuminate\Http\Request;

class SendMessageDTO
{
    public function __construct(
        public readonly int $conversationId,
        public readonly int $senderId,
        public readonly string $body,
        public readonly string $type = 'text',
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            conversationId: (int) $request->input('conversation_id'),
            senderId: (int) $request->user()->id,
            body: $request->input('body'),
            type: $request->input('type', 'text'),
        );
    }

    public static function fromArray(array $array): self
    {
        return new self(
            conversationId: $array['conversation_id'],
            senderId: $array['user_id'],
            body: $array['body'],
            type: $array['type'] ?? 'text',
        );
    }
}
