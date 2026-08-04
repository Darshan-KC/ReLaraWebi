<?php

namespace App\Http\Controllers\Api;

use App\Actions\Message\SendMessageAction;
use App\DTO\Message\SendMessageDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Message\SendMessageRequest;
use App\Http\Requests\Message\StoreConversationMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index(Conversation $conversation)
    {
        $conversation->assertParticipant(Auth::id());

        $messages = $conversation->messages()
            ->with(['sender:id,name', 'reactions', 'pins', 'edits'])
            ->orderBy('created_at', 'desc')
            ->get();

        return MessageResource::collection($messages);
    }

    public function store(
        SendMessageRequest $request,
        SendMessageAction $action
    ) {
        $message = $action->execute(
            SendMessageDTO::fromRequest($request)
        );

        return new MessageResource($message);
    }

    public function storeInConversation(
        StoreConversationMessageRequest $request,
        Conversation $conversation,
        SendMessageAction $action,
    ) {
        $conversation->assertParticipant(Auth::id());

        $message = $action->execute(
            SendMessageDTO::fromArray([
                'conversation_id' => $conversation->id,
                'user_id' => Auth::id(),
                'body' => $request->input('message'),
                'type' => $request->input('type', 'text'),
            ])
        );

        return new MessageResource($message);
    }
}
