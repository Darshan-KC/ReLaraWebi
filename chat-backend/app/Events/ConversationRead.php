<?php 

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ConversationRead implements ShouldBroadcast
{
    public function __construct(
        public int $conversationId,
        public int $userId,
        public int $lastReadMessageId
    ) {}

    /**
     * Summary of broadcastOn
     * @return PrivateChannel
     */
    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel(
            'conversation.' . $this->conversationId
        );
    }

    /**
     * Summary of broadcastAs
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'conversation.read';
    }
}
