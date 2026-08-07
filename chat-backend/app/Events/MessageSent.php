<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public function __construct(
        public Message $message
    ) {}

    // public function broadcastOn(): Channel
    // {
    //     return new Channel(
    //         'conversation.' . $this->message->conversation_id
    //     );
    // }

    public function broadcastOn()
    {
        logger()->info('BROADCAST MessageSent on private-conversation.'
            . $this->message->conversation_id . ' message=' . $this->message->id);

        return new PrivateChannel('conversation.' . $this->message->conversation_id);
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'sender_id' => $this->message->sender_id,
                'type' => $this->message->type,
                'body' => $this->message->body,
                'created_at' => $this->message->created_at,
            ],
        ];
    }
}
