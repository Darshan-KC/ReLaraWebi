<?php

namespace App\Http\Controllers\Api;

use App\Models\Conversation;
use App\Models\TypingIndicator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class TypingIndicatorController extends Controller
{
    /**
     * Set or update typing indicator
     */
    public function store(Request $request, Conversation $conversation)
    {
        // Verify user is participant
        $conversation->assertParticipant($request->user()->id);

        // Update or create typing indicator (expires in 3 seconds)
        TypingIndicator::updateOrCreate(
            [
                'conversation_id' => $conversation->id,
                'user_id' => $request->user()->id,
            ],
            [
                'expires_at' => Carbon::now()->addSeconds(3),
            ]
        );

        return response()->json(['status' => 'typing'], Response::HTTP_CREATED);
    }

    /**
     * Clear typing indicator
     */
    public function destroy(Request $request, Conversation $conversation)
    {
        $conversation->assertParticipant($request->user()->id);

        TypingIndicator::where('conversation_id', $conversation->id)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->noContent();
    }

    /**
     * Get users currently typing in a conversation
     */
    public function getTyping(Request $request, Conversation $conversation)
    {
        $conversation->assertParticipant($request->user()->id);

        $typingUsers = TypingIndicator::where('conversation_id', $conversation->id)
            ->where('expires_at', '>', Carbon::now())
            ->with('user:id,name')
            ->get()
            ->map(fn($indicator) => [
                'user_id' => $indicator->user_id,
                'user_name' => $indicator->user->name,
            ]);

        return response()->json($typingUsers);
    }
}
