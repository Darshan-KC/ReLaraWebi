<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\MessageEdit;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MessageEditController extends Controller
{
    use AuthorizesRequests;

    /**
     * Update (edit) a message
     */
    public function update(Request $request, Message $message)
    {
        $this->authorize('update', $message);

        $validated = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        // Store edit history
        MessageEdit::create([
            'message_id' => $message->id,
            'original_body' => $message->body,
            'edited_body' => $validated['body'],
            'edited_by' => $request->user()->id,
        ]);

        // Update the message
        $message->update([
            'body' => $validated['body'],
            'edited_at' => now(),
            'edit_count' => $message->edit_count + 1,
        ]);

        return new MessageResource($message);
    }

    /**
     * Delete (soft delete) a message
     */
    public function destroy(Request $request, Message $message)
    {
        $this->authorize('delete', $message);

        $message->delete();

        return response()->noContent();
    }

    /**
     * Get edit history for a message
     */
    public function editHistory(Message $message)
    {
        $edits = $message->edits()
            ->with('editedBy:id,name')
            ->latest('created_at')
            ->get()
            ->map(fn($edit) => [
                'id' => $edit->id,
                'original_body' => $edit->original_body,
                'edited_body' => $edit->edited_body,
                'edited_by' => $edit->editedBy->name,
                'edited_at' => $edit->created_at,
            ]);

        return response()->json($edits);
    }

    /**
     * Restore a soft-deleted message
     */
    public function restore(Request $request, int $messageId)
    {
        $message = Message::withTrashed()->find($messageId);

        if (!$message) {
            return response()->json(['error' => 'Message not found'], Response::HTTP_NOT_FOUND);
        }

        $this->authorize('restore', $message);

        $message->restore();

        return new MessageResource($message);
    }
}
