<?php

namespace App\Http\Controllers\Api;

use App\Actions\Message\SendMessageAction;
use App\DTO\Message\SendMessageDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Message\SendMessageRequest;
use App\Http\Resources\MessageResource;

class MessageController extends Controller
{
    public function store(
        SendMessageRequest $request,
        SendMessageAction $action
    ) {
        $message = $action->execute(
            SendMessageDTO::fromRequest($request)
        );

        return new MessageResource($message);
    }
}
