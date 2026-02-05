<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\MessagePin;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MessagePinController extends Controller
{
    use AuthorizesRequests;

    /**
     * Pin a message in a conversation
     */
    public function store(Request $request, Message $message)
    {
        // Verify user is participant of conversation
        $message->conversation->assertParticipant($request->user()->id);

        // Check if already pinned
        $existingPin = MessagePin::where('message_id', $message->id)
            ->where('conversation_id', $message->conversation_id)
            ->first();

        if ($existingPin) {
            return response()->json(['error' => 'Message already pinned'], Response::HTTP_CONFLICT);
        }

        // Create pin
        $pin = MessagePin::create([
            'message_id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'pinned_by' => $request->user()->id,
        ]);

        // Update message
        $message->update([
            'is_pinned' => true,
            'pinned_by' => $request->user()->id,
            'pinned_at' => now(),
        ]);

        return response()->json([
            'message_id' => $message->id,
            'is_pinned' => true,
            'pinned_at' => $message->pinned_at,
            'pinned_by' => $request->user()->name,
        ], Response::HTTP_CREATED);
    }

    /**
     * Unpin a message
     */
    public function destroy(Request $request, Message $message)
    {
        // Verify user is participant
        $message->conversation->assertParticipant($request->user()->id);

        // Find and delete pin
        MessagePin::where('message_id', $message->id)
            ->where('conversation_id', $message->conversation_id)
            ->delete();

        // Update message
        $message->update([
            'is_pinned' => false,
            'pinned_by' => null,
            'pinned_at' => null,
        ]);

        return response()->noContent();
    }

    /**
     * Get all pinned messages for a conversation
     */
    public function getPinned(Request $request, int $conversationId)
    {
        $conversation = \App\Models\Conversation::findOrFail($conversationId);
        $conversation->assertParticipant($request->user()->id);

        $pinnedMessages = $conversation->messages()
            ->where('is_pinned', true)
            ->with('sender:id,name', 'reactions')
            ->latest('pinned_at')
            ->get()
            ->map(fn($msg) => [
                'id' => $msg->id,
                'body' => $msg->body,
                'type' => $msg->type,
                'sender' => $msg->sender,
                'pinned_at' => $msg->pinned_at,
                'pinned_by' => \App\Models\User::find($msg->pinned_by)->name ?? 'Unknown',
                'reaction_count' => $msg->reactions->count(),
                'created_at' => $msg->created_at,
            ]);

        return response()->json($pinnedMessages);
    }
}
