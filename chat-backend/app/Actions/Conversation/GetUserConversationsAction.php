<?php 

namespace App\Actions\Conversation;

use App\Models\Conversation;
use Illuminate\Support\Facades\DB;

class GetUserConversationsAction
{
    public function execute(int $userId)
    {
        return Conversation::query()
            ->join('conversation_participants as cp', function ($join) use ($userId) {
                $join->on('cp.conversation_id', '=', 'conversations.id')
                     ->where('cp.user_id', $userId);
            })
            ->select([
                'conversations.*',
                DB::raw(
                    'GREATEST(
                        conversations.last_message_id -
                        COALESCE(cp.last_read_message_id, 0),
                        0
                    ) as unread_count'
                )
            ])
            ->orderByDesc('conversations.last_message_at')
            ->get();
    }
}