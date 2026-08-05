<?php

namespace App\Actions\Conversation;

use App\Models\Conversation;

class SearchConversationsAction
{
    public function execute(int $userId, string $query)
    {
        $query = trim($query);

        if ($query === '') {
            return collect();
        }

        return Conversation::query()
            ->whereHas(
                'participants',
                fn($q) => $q->where('user_id', $userId)->where('is_active', true)
            )
            ->whereHas('participants.user', function ($q) use ($userId, $query) {
                $q->where('users.id', '!=', $userId)
                    ->where('name', 'LIKE', "%{$query}%");
            })
            ->with([
                'lastMessage:id,conversation_id,body,sender_id,created_at',
                'participants.user:id,name',
            ])
            ->orderByDesc('last_message_at')
            ->limit(20)
            ->get();
    }
}
