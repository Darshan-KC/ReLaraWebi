<?php

namespace App\Actions\Message;

use App\DTO\Message\SendMessageDTO;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class SendMessageAction
{
    public function execute(SendMessageDTO $data): Message
    {
        return DB::transaction(function () use ($data) {

            // 1. Create message
            $message = Message::create([
                'conversation_id' => $data->conversationId,
                'sender_id' => $data->senderId,
                'type' => $data->type,
                'body' => $data->body,
            ]);

            // 2. Update conversation (denormalized fields)
            Conversation::where('id', $data->conversationId)->update([
                'last_message_id' => $message->id,
                'last_message_at' => $message->created_at,
            ]);

            // 3. Fire domain event (explicit)
            event(new MessageSent($message));

            return $message;
        });
    }
}
