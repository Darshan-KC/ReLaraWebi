<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'type',
        'body',
        'edited_at',
    ];

    protected $casts = [
        'edited_at' => 'datetime',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function reactions()
    {
        return $this->hasMany(MessageReaction::class);
    }

    public function pins()
    {
        return $this->hasMany(MessagePin::class);
    }

    public function edits()
    {
        return $this->hasMany(MessageEdit::class);
    }

    public function isPinned(): bool
    {
        return (bool) $this->is_pinned;
    }

    public function wasEdited(): bool
    {
        return $this->edit_count > 0;
    }
}
