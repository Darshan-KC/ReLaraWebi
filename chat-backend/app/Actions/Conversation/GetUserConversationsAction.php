<?php

namespace App\Actions\Conversation;

use App\Models\Conversation;
use Illuminate\Support\Facades\DB;

class GetUserConversationsAction
{
    public function execute(int $userId)
    {
        // return Conversation::query()
        //     ->join('conversation_participants as cp', function ($join) use ($userId) {
        //         $join->on('cp.conversation_id', '=', 'conversations.id')
        //              ->where('cp.user_id', $userId);
        //     })
        //     ->select([
        //         'conversations.*',
        //         DB::raw(
        //             'GREATEST(
        //                 conversations.last_message_id -
        //                 COALESCE(cp.last_read_message_id, 0),
        //                 0
        //             ) as unread_count'
        //         )
        //     ])
        //     ->orderByDesc('conversations.last_message_at')
        //     ->get();

        return Conversation::query()
            ->whereHas(
                'participants',
                fn($q) =>
                $q->where('user_id', $userId)->where('is_active', true)
            )
            ->with([
                'lastMessage:id,conversation_id,body,sender_id,created_at',
                'participants.user:id,name',
            ])
            ->withCount([
                'messages as unread_count' => function ($q) use ($userId) {
                    $q->where('id', '>', function ($sub) use ($userId) {
                        $sub->select('last_read_message_id')
                            ->from('conversation_participants')
                            ->whereColumn('conversation_participants.conversation_id', 'messages.conversation_id')
                            ->where('conversation_participants.user_id', $userId);
                    });
                }
            ])
            ->orderByDesc('last_message_at')
            ->paginate(20);
    }
}
