<?php

namespace App\Actions\Conversation;

use App\Events\ConversationRead;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use Illuminate\Support\Facades\DB;

class MarkConversationReadAction
{
    public function execute(
        Conversation $conversation,
        int $userId
    ): void {
        // $participant = ConversationParticipant::where(
        //     'conversation_id',
        //     $conversation->id
        // )->where(
        //     'user_id',
        //     $userId
        // )->firstOrFail();

        // // No messages yet
        // if (! $conversation->last_message_id) {
        //     return;
        // }

        // // Update read state
        // $participant->update([
        //     'last_read_message_id' => $conversation->last_message_id,
        // ]);

        $conversationId = $conversation;

        DB::transaction(function () use ($conversationId, $userId) {
            $conversation = Conversation::lockForUpdate()->findOrFail($conversationId);

            $conversation->assertParticipant($userId);

            $participant = $conversation->participants()
                ->where('user_id', $userId)
                ->firstOrFail();

            $lastMessageId = $conversation->last_message_id;

            if ($lastMessageId && $participant->last_read_message_id < $lastMessageId) {
                $participant->update([
                    'last_read_message_id' => $lastMessageId,
                    'last_read_at' => now(),
                ]);

                // Optional: broadcast read event
                event(new ConversationRead(
                    conversationId: $conversation->id,
                    userId: $userId,
                    lastReadMessageId: $conversation->last_message_id
                ));
            }
        });
    }
}
