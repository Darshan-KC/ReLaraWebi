<?php

namespace App\Actions\Friendship;

use App\Models\Conversation;
use App\Models\Friendship;
use Illuminate\Support\Facades\DB;

class AcceptFriendRequestAction
{
    public function execute(
        Friendship $friendship
    ): array {

        $conversation = DB::transaction(function () use ($friendship) {

            $friendship->update([
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            $conversation = Conversation::create();

            $conversation->participants()->attach([
                $friendship->sender_id,
                $friendship->receiver_id,
            ]);

            return $conversation;
        });

        return [
            'friendship' => $friendship,
            'conversation' => $conversation,
        ];
    }
}