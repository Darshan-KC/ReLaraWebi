<?php

namespace App\Http\Controllers\Api;

use App\Actions\Conversation\GetUserConversationsAction;
use App\Actions\Conversation\OpenConversationAction;
use App\DTO\Conversation\OpenConversationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Conversation\OpenConversationRequest;
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

    public function open(
        OpenConversationRequest $request,
        OpenConversationAction $action,
    ) {
        $dto = OpenConversationDTO::fromArray(
            $request->validated()
        );

        $conversation = $action->execute(
            $dto
        );

        return response()->json([
            'message' => 'Conversation opened.',
            'data' => ConversationResource::make(
                $conversation
            ),
        ]);
    }
}
