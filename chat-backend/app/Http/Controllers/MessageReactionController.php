<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\MessageReaction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MessageReactionController extends Controller
{
    use AuthorizesRequests;
    public function store(Request $request, Message $message)
    {
        $validated = $request->validate([
            'emoji' => 'required|string|max:10',
        ]);

        $user = $request->user();
        $userId = $user ? (int) $user->id : null;

        if (!$userId) {
            return response()->json(['error' => 'Unauthenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Check if reaction already exists
        $existingReaction = MessageReaction::where('message_id', (int) $message->id)
            ->where('user_id', $userId)
            ->where('emoji', $validated['emoji'])
            ->first();

        // Toggle: remove if exists, add if doesn't exist
        if ($existingReaction) {
            $existingReaction->delete();
            return response()->noContent();
        }

        // Add new reaction
        $reaction = MessageReaction::create([
            'message_id' => (int) $message->id,
            'user_id' => $userId,
            'emoji' => $validated['emoji'],
        ]);

        return response()->json($reaction, 201);
    }

    public function destroy(MessageReaction $reaction)
    {
        $this->authorize('delete', $reaction);

        $reaction->delete();

        return response()->noContent();
    }

    public function getByMessage(Message $message)
    {
        $reactions = $message->reactions()
            ->select('emoji')
            ->selectRaw('count(*) as count')
            ->groupBy('emoji')
            ->orderByDesc('count')
            ->get();

        return response()->json($reactions);
    }
}
