<?php

namespace App\Http\Controllers\Api;

use App\Actions\Conversation\GetUserConversationsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function index(GetUserConversationsAction $action)
    {
        return ConversationResource::collection(
            $action->execute(Auth::id())
        );
    }

    public function show(Conversation $conversation)
    {
        $conversation->assertParticipant(Auth::id());

        return new ConversationResource($conversation->load([
            'messages.sender:id,name',
            'participants.user:id,name'
        ]));
    }
}
