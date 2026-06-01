<?php 

namespace App\Actions\Friendship;

use App\Models\Friendship;

class AcceptFriendRequestAction
{
    public function execute(
        Friendship $friendship
    ): Friendship {

        $friendship->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        return $friendship;
    }
}