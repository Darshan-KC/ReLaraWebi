<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlockedUserController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\FriendshipController;
use App\Http\Controllers\Api\MessageBookmarkController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MessageEditController;
use App\Http\Controllers\Api\MessagePinController;
use App\Http\Controllers\Api\MessageSearchController;
use App\Http\Controllers\Api\TypingIndicatorController;
use App\Http\Controllers\MessageReactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::get('/user', fn(Request $request) => $request->user());

    Route::controller(AuthController::class)->group(function () {
        Route::get('/me', 'index');
        Route::put('/user', 'update');
        Route::post('/logout', 'logout');
        Route::delete('/users/{id}', 'destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Broadcasting
    |--------------------------------------------------------------------------
    */

    Route::post('/broadcasting/auth', fn(Request $request) => $request->user());

    /*
    |--------------------------------------------------------------------------
    | Conversations
    |--------------------------------------------------------------------------
    */

    Route::controller(ConversationController::class)->group(function () {
        Route::get('/conversations', 'index');
        Route::get('/conversations/{conversation}', 'show');
        Route::post('/conversations/open', 'open');
    });

    /*
    |--------------------------------------------------------------------------
    | Messages
    |--------------------------------------------------------------------------
    */

    Route::controller(MessageController::class)->group(function () {
        Route::post('/messages', 'store');
    });

    /*
    |--------------------------------------------------------------------------
    | Message Editing
    |--------------------------------------------------------------------------
    */

    Route::controller(MessageEditController::class)->group(function () {
        Route::put('/messages/{message}', 'update');
        Route::delete('/messages/{message}', 'destroy');
        Route::post('/messages/{message}/restore', 'restore');
        Route::get('/messages/{message}/edits', 'editHistory');
    });

    /*
    |--------------------------------------------------------------------------
    | Message Reactions
    |--------------------------------------------------------------------------
    */

    Route::prefix('messages/{message}/reactions')
        ->controller(MessageReactionController::class)
        ->group(function () {

            Route::post('/', 'store');
            Route::delete('/{reaction}', 'destroy');

            Route::get('/stats', 'getStats');
            Route::get('/detailed', 'getDetailed');
            Route::get('/', 'getByMessage');

            Route::get('/{emoji}/has-reacted', 'hasReacted');
            Route::get('/{emoji}/users', 'getUsersByEmoji');
        });

    /*
    |--------------------------------------------------------------------------
    | Message Pins
    |--------------------------------------------------------------------------
    */

    Route::controller(MessagePinController::class)->group(function () {
        Route::post('/messages/{message}/pin', 'store');
        Route::delete('/messages/{message}/pin', 'destroy');
        Route::get('/conversations/{conversation}/pinned', 'getPinned');
    });

    /*
    |--------------------------------------------------------------------------
    | Typing Indicators
    |--------------------------------------------------------------------------
    */

    Route::prefix('conversations/{conversation}')
        ->controller(TypingIndicatorController::class)
        ->group(function () {
            Route::post('/typing', 'store');
            Route::delete('/typing', 'destroy');
            Route::get('/typing', 'getTyping');
        });

    /*
    |--------------------------------------------------------------------------
    | Message Search
    |--------------------------------------------------------------------------
    */

    Route::controller(MessageSearchController::class)->group(function () {
        Route::get('/messages/search', 'searchGlobal');

        Route::prefix('conversations/{conversation}')->group(function () {
            Route::get('/messages/search', 'search');
            Route::get('/messages/suggestions', 'suggestions');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Blocked Users
    |--------------------------------------------------------------------------
    */

    Route::controller(BlockedUserController::class)->group(function () {
        Route::get('/blocked-users', 'index');
        Route::post('/blocked-users', 'store');
        Route::delete('/blocked-users/{blockedUser}', 'destroy');

        Route::get('/users/{user}/is-blocked', 'isBlocked');
        Route::get('/users/{user}/has-blocked-me', 'hasBlockedMe');
    });

    /*
    |--------------------------------------------------------------------------
    | Bookmarks
    |--------------------------------------------------------------------------
    */

    Route::controller(MessageBookmarkController::class)->group(function () {
        Route::get('/bookmarks', 'index');
        Route::put('/bookmarks/{messageBookmark}', 'update');

        Route::get('/conversations/{conversation}/bookmarks', 'conversationBookmarks');

        Route::post('/messages/{message}/bookmark', 'store');
        Route::delete('/messages/{message}/bookmark', 'destroy');
        Route::get('/messages/{message}/bookmark/check', 'check');
    });

    /*
    |--------------------------------------------------------------------------
    | Friendships and Friend Requests
    |--------------------------------------------------------------------------
    */

    Route::controller(FriendshipController::class)->group(function () {
        Route::post('/friendships', 'store');
        Route::post('/friendships/{friendship}/accept', 'accept');
        Route::get('/users', 'users');
        Route::get('/friend-requests', 'listRequests');
        Route::get('/friendships/friends', 'listFriends');
        Route::get('/friendships/send-requests', 'listSentRequests');
    });
});