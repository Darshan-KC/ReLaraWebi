<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    public $fillable = ['type', 'created_by', 'created_at', 'last_message_id', 'last_message_at'];
}
