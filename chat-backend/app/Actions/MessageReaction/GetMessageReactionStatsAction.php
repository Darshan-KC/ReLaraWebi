<?php

namespace App\Actions\MessageReaction;

use App\Models\Message;

class GetMessageReactionStatsAction
{
    public function execute(Message $message): array
    {
        $reactions = $message->reactions;
        $totalReactions = $reactions->count();
        
        return [
            'total_reactions' => $totalReactions,
            'unique_emojis' => $reactions->pluck('emoji')->unique()->count(),
            'total_users' => $reactions->pluck('user_id')->unique()->count(),
            'most_used' => $reactions->groupBy('emoji')
                ->map(fn($group) => ['emoji' => $group->first()->emoji, 'count' => $group->count()])
                ->sortByDesc('count')
                ->first() ?? null,
        ];
    }
}
