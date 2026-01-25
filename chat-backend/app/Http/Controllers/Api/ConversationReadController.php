<?php

namespace App\Http\Controllers\Api;

use App\Actions\Conversation\MarkConversationReadAction;
use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;

class ConversationReadController extends Controller
{
    public function store(
        Conversation $conversation,
        MarkConversationReadAction $action
    ) {
        $action->execute(
            conversation: $conversation,
            userId: Auth::id()
        );


        return response()->noContent();
    }
}
