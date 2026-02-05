<?php

namespace App\Policies;

use App\Models\MessageReaction;
use App\Models\User;

class MessageReactionPolicy
{
    /**
     * Determine if user can delete a reaction
     */
    public function delete(User $user, MessageReaction $reaction): bool
    {
        // Only the user who added the reaction can delete it
        return $user->id === $reaction->user_id;
    }
}
