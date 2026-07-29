<?php

namespace App\Actions\Friendship;

use App\Models\Conversation;
use App\Models\Friendship;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AcceptFriendRequestAction
{
    public function execute(
        Friendship $friendship
    ): array {
        $conversation = DB::transaction(function () use ($friendship) {

            $friendship->update([
                'status' => 'accepted',
                'accepted_at' => now()
            ]);

            $conversation = Conversation::create([
                'type' => 'private',
                'created_by' => Auth::id(),
            ]);

            // $conversation->participants()->attach([
            //     $friendship->sender_id,
            //     $friendship->receiver_id,
            // ]);
            $conversation->participants()->createMany([
                [
                    'user_id' => $friendship->sender_id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'is_active' => true,
                ],
                [
                    'user_id' => $friendship->receiver_id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'is_active' => true,
                ],
            ]);

            return $conversation;
        });

        return [
            'friendship' => $friendship,
            'conversation' => $conversation,
        ];
    }
}
