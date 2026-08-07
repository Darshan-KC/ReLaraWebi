<?php

use App\Models\ConversationParticipant;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel(
    'conversation.{conversationId}',
    function ($user, $conversationId) {

        $isParticipant = ConversationParticipant::query()
            ->where('conversation_id', $conversationId)
            ->where('user_id', $user->id)
            ->exists();

        logger()->info('CHANNEL_AUTH conversation.' . $conversationId
            . ' user=' . $user->id
            . ' allowed=' . ($isParticipant ? 'yes' : 'no'));

        return $isParticipant;
    }
);