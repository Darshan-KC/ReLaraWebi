<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockedUser;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class BlockedUserController extends Controller
{
    /**
     * Get list of blocked users for authenticated user
     *
     * GET /api/blocked-users
     */
    public function index(Request $request)
    {
        $userId = Auth::user()->id;

        $blockedUsers = BlockedUser::where('user_id', $userId)
            ->with('blockedUser:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 50));

        return response()->json([
            'data' => $blockedUsers->items(),
            'pagination' => [
                'total' => $blockedUsers->total(),
                'count' => $blockedUsers->count(),
                'per_page' => $blockedUsers->perPage(),
                'current_page' => $blockedUsers->currentPage(),
                'total_pages' => $blockedUsers->lastPage(),
            ]
        ]);
    }

    /**
     * Block a user
     *
     * POST /api/blocked-users
     *
     * @bodyParam blocked_user_id int required The ID of the user to block
     * @bodyParam reason string optional Reason for blocking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'blocked_user_id' => 'required|integer|exists:users,id|different:blocked_user_id',
            'reason' => 'nullable|string|max:255',
        ]);

        $userId = Auth::user()->id;

        // Prevent blocking yourself
        if ($validated['blocked_user_id'] === $userId) {
            return response()->json([
                'message' => 'You cannot block yourself',
            ], 422);
        }

        // Check if user is already blocked
        $existing = BlockedUser::where('user_id', $userId)
            ->where('blocked_user_id', $validated['blocked_user_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'User is already blocked',
            ], 422);
        }

        $blockedUser = BlockedUser::create([
            'user_id' => $userId,
            'blocked_user_id' => $validated['blocked_user_id'],
            'reason' => $validated['reason'] ?? null,
        ]);

        return response()->json([
            'message' => 'User blocked successfully',
            'data' => $blockedUser,
        ], 201);
    }

    /**
     * Unblock a user
     *
     * DELETE /api/blocked-users/{blockedUser}
     */
    public function destroy(BlockedUser $blockedUser)
    {
        $userId = Auth::user()->id;

        // Ensure the user can only unblock users they blocked
        if ($blockedUser->user_id !== $userId) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $blockedUser->delete();

        return response()->json([
            'message' => 'User unblocked successfully',
        ], 200);
    }

    /**
     * Check if a user is blocked
     *
     * GET /api/users/{user}/is-blocked
     */
    public function isBlocked(User $user)
    {
        $userId = Auth::user()->id;

        $isBlocked = BlockedUser::where('user_id', $userId)
            ->where('blocked_user_id', $user->id)
            ->exists();

        return response()->json([
            'is_blocked' => $isBlocked,
        ]);
    }

    /**
     * Check if current user has been blocked by another user
     *
     * GET /api/users/{user}/has-blocked-me
     */
    public function hasBlockedMe(User $user)
    {
        $userId = Auth::user()->id;

        $hasBlockedMe = BlockedUser::where('user_id', $user->id)
            ->where('blocked_user_id', $userId)
            ->exists();

        return response()->json([
            'has_blocked_me' => $hasBlockedMe,
        ]);
    }
}
