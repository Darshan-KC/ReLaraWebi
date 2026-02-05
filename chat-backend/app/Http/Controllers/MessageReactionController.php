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

    /**
     * Add or toggle a reaction on a message
     */
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

        return response()->json($reaction, Response::HTTP_CREATED);
    }

    /**
     * Delete a specific reaction
     */
    public function destroy(MessageReaction $reaction)
    {
        $this->authorize('delete', $reaction);

        $reaction->delete();

        return response()->noContent();
    }

    /**
     * Get aggregated reactions for a message (emoji + count)
     */
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

    /**
     * Get detailed reaction info with user list for each emoji
     */
    public function getDetailed(Message $message)
    {
        $reactions = $message->reactions()
            ->with('user:id,name')
            ->get()
            ->groupBy('emoji')
            ->map(fn($group) => [
                'emoji' => $group->first()->emoji,
                'count' => $group->count(),
                'users' => $group->map(fn($r) => [
                    'user_id' => $r->user->id,
                    'user_name' => $r->user->name,
                ])->values(),
            ])
            ->values();

        return response()->json($reactions);
    }

    /**
     * Get all users who reacted with a specific emoji
     */
    public function getUsersByEmoji(Message $message, string $emoji)
    {
        $users = $message->reactions()
            ->where('emoji', $emoji)
            ->with('user:id,name')
            ->get()
            ->map(fn($reaction) => [
                'user_id' => $reaction->user->id,
                'user_name' => $reaction->user->name,
                'reacted_at' => $reaction->created_at,
            ]);

        return response()->json($users);
    }

    /**
     * Get reaction statistics for a message
     */
    public function getStats(Message $message)
    {
        $reactions = $message->reactions;
        $totalReactions = $reactions->count();
        
        $stats = [
            'total_reactions' => $totalReactions,
            'unique_emojis' => $reactions->pluck('emoji')->unique()->count(),
            'total_users' => $reactions->pluck('user_id')->unique()->count(),
            'most_used' => $reactions->groupBy('emoji')
                ->map(fn($group) => ['emoji' => $group->first()->emoji, 'count' => $group->count()])
                ->sortByDesc('count')
                ->first() ?? null,
        ];

        return response()->json($stats);
    }

    /**
     * Check if current user has reacted with a specific emoji
     */
    public function hasReacted(Request $request, Message $message, string $emoji)
    {
        $userId = $request->user()?->id;

        if (!$userId) {
            return response()->json(['has_reacted' => false]);
        }

        $hasReacted = MessageReaction::where('message_id', $message->id)
            ->where('user_id', $userId)
            ->where('emoji', $emoji)
            ->exists();

        return response()->json(['has_reacted' => $hasReacted]);
    }
}

