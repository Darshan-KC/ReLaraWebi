<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Determine if user can update a message
     */
    public function update(User $user, Message $message): bool
    {
        // Only message sender can edit
        return $user->id === $message->sender_id;
    }

    /**
     * Determine if user can delete a message
     */
    public function delete(User $user, Message $message): bool
    {
        // Only message sender or conversation admins can delete
        return $user->id === $message->sender_id;
    }

    /**
     * Determine if user can restore a message
     */
    public function restore(User $user, Message $message): bool
    {
        // Only message sender can restore
        return $user->id === $message->sender_id;
    }
}
