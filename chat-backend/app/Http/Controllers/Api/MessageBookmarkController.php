<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageBookmarkResource;
use App\Models\Message;
use App\Models\MessageBookmark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class MessageBookmarkController extends Controller
{
    /**
     * Get all bookmarked messages for the authenticated user
     *
     * GET /api/bookmarks
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $bookmarks = MessageBookmark::where('user_id', $user->id)
            ->with(['message.sender', 'message.reactions', 'message.pins'])
            ->orderByDesc('created_at')
            ->paginate($request->input('per_page', 15));

        return MessageBookmarkResource::collection($bookmarks);
    }

    /**
     * Get bookmarked messages in a specific conversation
     *
     * GET /api/conversations/{conversation}/bookmarks
     */
    public function conversationBookmarks(Request $request, $conversationId)
    {
        $user = Auth::user();

        $bookmarks = MessageBookmark::where('user_id', $user->id)
            ->whereHas('message', function ($query) use ($conversationId) {
                $query->where('conversation_id', $conversationId);
            })
            ->with(['message.sender', 'message.reactions', 'message.pins'])
            ->orderByDesc('created_at')
            ->paginate($request->input('per_page', 15));

        return MessageBookmarkResource::collection($bookmarks);
    }

    /**
     * Bookmark a message
     *
     * POST /api/messages/{message}/bookmark
     */
    public function store(Request $request, Message $message)
    {
        $user = Auth::user();

        // Check if user is part of the conversation
        Gate::authorize('view', $message->conversation);

        // Check if already bookmarked
        $existing = MessageBookmark::where('message_id', $message->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Message already bookmarked'
            ], 409);
        }

        $bookmark = MessageBookmark::create([
            'message_id' => $message->id,
            'user_id' => $user->id,
            'notes' => $request->input('notes'),
        ]);

        return response()->json(new MessageBookmarkResource($bookmark->load('message.sender')), 201);
    }

    /**
     * Update bookmark notes
     *
     * PUT /api/bookmarks/{bookmark}
     */
    public function update(Request $request, MessageBookmark $bookmark)
    {
        $user = Auth::user();

        // Check authorization
        if ($bookmark->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $bookmark->update([
            'notes' => $request->input('notes'),
        ]);

        return new MessageBookmarkResource($bookmark);
    }

    /**
     * Remove bookmark from a message
     *
     * DELETE /api/messages/{message}/bookmark
     */
    public function destroy(Message $message)
    {
        $user = Auth::user();

        $bookmark = MessageBookmark::where('message_id', $message->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$bookmark) {
            return response()->json(['message' => 'Bookmark not found'], 404);
        }

        $bookmark->delete();

        return response()->noContent();
    }

    /**
     * Check if a message is bookmarked by the user
     *
     * GET /api/messages/{message}/bookmark/check
     */
    public function check(Message $message)
    {
        $user = Auth::user();

        $isBookmarked = MessageBookmark::where('message_id', $message->id)
            ->where('user_id', $user->id)
            ->exists();

        return response()->json([
            'is_bookmarked' => $isBookmarked,
        ]);
    }
}
