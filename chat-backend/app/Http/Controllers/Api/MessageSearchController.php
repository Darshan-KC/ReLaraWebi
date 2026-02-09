<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\SearchMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class MessageSearchController extends Controller
{
    /**
     * Search messages within a conversation
     *
     * GET /api/conversations/{conversation}/messages/search?q=...&sender_id=...&from=...&to=...
     */
    public function search(SearchMessageRequest $request, Conversation $conversation)
    {
        // Check if user is part of the conversation
        Gate::authorize('view', $conversation);

        $query = Message::where('conversation_id', $conversation->id)
            ->with(['sender', 'reactions', 'pins', 'edits']);

        // Search by content
        if ($request->filled('q')) {
            $searchTerm = $request->input('q');
            $query->where('body', 'LIKE', "%{$searchTerm}%");
        }

        // Filter by sender
        if ($request->filled('sender_id')) {
            $query->where('sender_id', $request->input('sender_id'));
        }

        // Filter by date range (from)
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }

        // Filter by date range (to)
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

        // Filter by message type (text, image, file, etc.)
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Order by most recent first
        $messages = $query
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return MessageResource::collection($messages);
    }

    /**
     * Search across all conversations
     *
     * GET /api/messages/search?q=...&from=...&to=...
     */
    public function searchGlobal(SearchMessageRequest $request)
    {
        $userId = Auth::user()->id;

        // Get conversations where user is a participant
        $conversationIds = ConversationParticipant::where('user_id', $userId)
            ->pluck('conversation_id');

        // Return empty results if user is not in any conversations
        if ($conversationIds->isEmpty()) {
            return MessageResource::collection(collect([]));
        }

        $query = Message::whereIn('conversation_id', $conversationIds)
            ->with(['sender', 'reactions', 'pins', 'edits', 'conversation']);

        // Search by content
        if ($request->filled('q')) {
            $searchTerm = $request->input('q');
            $query->where('body', 'LIKE', "%{$searchTerm}%");
        }

        // Filter by sender
        if ($request->filled('sender_id')) {
            $query->where('sender_id', $request->input('sender_id'));
        }

        // Filter by date range (from)
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }

        // Filter by date range (to)
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

        // Filter by message type
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        $messages = $query
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return MessageResource::collection($messages);
    }

    /**
     * Get search suggestions/autocomplete
     *
     * GET /api/conversations/{conversation}/messages/suggestions?q=...
     */
    public function suggestions(Conversation $conversation, SearchMessageRequest $request)
    {
        Gate::authorize('view', $conversation);

        if (!$request->filled('q')) {
            return response()->json([]);
        }

        $searchTerm = $request->input('q');
        $limit = min($request->input('limit', 10), 50);

        $suggestions = Message::where('conversation_id', $conversation->id)
            ->where('body', 'LIKE', "%{$searchTerm}%")
            ->select('id', 'body', 'created_at', 'sender_id')
            ->with('sender:id,name')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'preview' => mb_substr($message->body, 0, 100),
                    'sender' => optional($message->sender)->name ?? 'Unknown',
                    'created_at' => $message->created_at,
                ];
            });

        return response()->json($suggestions);
    }
}
