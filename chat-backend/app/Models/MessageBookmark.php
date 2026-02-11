<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageBookmark extends Model
{
    protected $fillable = [
        'message_id',
        'user_id',
        'notes',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
