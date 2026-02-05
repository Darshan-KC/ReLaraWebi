<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageEdit extends Model
{
    protected $fillable = ['message_id', 'original_body', 'edited_body', 'edited_by'];

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    public function editedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'edited_by');
    }
}
