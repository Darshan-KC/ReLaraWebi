<?php

namespace App\Actions\MessageReaction;

use App\Models\Message;
use App\Models\MessageReaction;
use App\Models\User;

class CreateOrToggleReaction
{
    /**
     * Create or toggle a reaction on a message
     *
     * @param Message $message
     * @param User $user
     * @param string $emoji
     * @return array ['created' => bool, 'reaction' => MessageReaction|null]
     */
    public function execute(Message $message, User $user, string $emoji): array
    {
        $existingReaction = MessageReaction::where('message_id', $message->id)
            ->where('user_id', $user->id)
            ->where('emoji', $emoji)
            ->first();

        if ($existingReaction) {
            $existingReaction->delete();
            return ['created' => false, 'reaction' => null];
        }

        $reaction = MessageReaction::create([
            'message_id' => $message->id,
            'user_id' => $user->id,
            'emoji' => $emoji,
        ]);

        return ['created' => true, 'reaction' => $reaction];
    }
}
