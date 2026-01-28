<?php

namespace App\Models;

use DomainException;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'type',
        'created_by',
        'last_message_id',
        'last_message_at',
    ];

    public function participants()
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage()
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    /**
     * DOMAIN INVARIANT
     */
    public function assertParticipant(int $userId): void
    {
        $isParticipant = $this->participants()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->exists();


        if (! $isParticipant) {
            throw new DomainException('User is not an active participant of this conversation.');
        }
    }


    public function touchLastMessage(Message $message): void
    {
        $this->forceFill([
            'last_message_id' => $message->id,
            'last_message_at' => $message->created_at,
        ])->save();
    }
}
