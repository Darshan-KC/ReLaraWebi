<?php

namespace App\Http\Controllers\Api;

use App\Actions\Conversation\GetUserConversationsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConversationResource;
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
}
