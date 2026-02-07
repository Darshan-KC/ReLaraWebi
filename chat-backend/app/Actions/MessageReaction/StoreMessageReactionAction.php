<?php

namespace App\Actions\MessageReaction;

use App\Models\Message;
use App\Models\MessageReaction;
use App\Models\User;

class StoreMessageReactionAction
{
    public function execute(Message $message, User $user, string $emoji): ?MessageReaction
    {
        $existingReaction = MessageReaction::where('message_id', $message->id)
            ->where('user_id', $user->id)
            ->where('emoji', $emoji)
            ->first();

        if ($existingReaction) {
            $existingReaction->delete();
            return null;
        }

        return MessageReaction::create([
            'message_id' => $message->id,
            'user_id' => $user->id,
            'emoji' => $emoji,
        ]);
    }
}
