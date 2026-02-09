<?php

use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\MessageEditController;
use App\Http\Controllers\Api\MessagePinController;
use App\Http\Controllers\Api\MessageSearchController;
use App\Http\Controllers\Api\TypingIndicatorController;
use App\Http\Controllers\MessageReactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')
    ->post('/broadcasting/auth', function (Request $request) {
        return $request->user();
    });

Route::middleware('auth:sanctum')
    ->get('/conversations', [ConversationController::class, 'index']);

Route::middleware('auth:sanctum')
    ->get('/conversations/{conversation}', [ConversationController::class, 'show']);

Route::middleware('auth:sanctum')
    ->post('/messages', [MessageController::class, 'store']);

Route::middleware('auth:sanctum')
    ->put('/messages/{message}', [MessageEditController::class, 'update']);

Route::middleware('auth:sanctum')
    ->delete('/messages/{message}', [MessageEditController::class, 'destroy']);

Route::middleware('auth:sanctum')
    ->post('/messages/{message}/restore', [MessageEditController::class, 'restore']);

Route::middleware('auth:sanctum')
    ->get('/messages/{message}/edits', [MessageEditController::class, 'editHistory']);

// Message Reactions
Route::middleware('auth:sanctum')
    ->post('/messages/{message}/reactions', [MessageReactionController::class, 'store']);

Route::middleware('auth:sanctum')
    ->delete('/messages/{message}/reactions/{reaction}', [MessageReactionController::class, 'destroy']);

// Must come before emoji routes to avoid matching {emoji} parameter
Route::middleware('auth:sanctum')
    ->get('/messages/{message}/reactions/stats', [MessageReactionController::class, 'getStats']);

Route::middleware('auth:sanctum')
    ->get('/messages/{message}/reactions/detailed', [MessageReactionController::class, 'getDetailed']);

Route::middleware('auth:sanctum')
    ->get('/messages/{message}/reactions', [MessageReactionController::class, 'getByMessage']);

Route::middleware('auth:sanctum')
    ->get('/messages/{message}/reactions/{emoji}/has-reacted', [MessageReactionController::class, 'hasReacted']);

Route::middleware('auth:sanctum')
    ->get('/messages/{message}/reactions/{emoji}/users', [MessageReactionController::class, 'getUsersByEmoji']);

// Message Pins
Route::middleware('auth:sanctum')
    ->post('/messages/{message}/pin', [MessagePinController::class, 'store']);

Route::middleware('auth:sanctum')
    ->delete('/messages/{message}/pin', [MessagePinController::class, 'destroy']);

Route::middleware('auth:sanctum')
    ->get('/conversations/{conversationId}/pinned', [MessagePinController::class, 'getPinned']);

// Typing Indicators
Route::middleware('auth:sanctum')
    ->post('/conversations/{conversation}/typing', [TypingIndicatorController::class, 'store']);

Route::middleware('auth:sanctum')
    ->delete('/conversations/{conversation}/typing', [TypingIndicatorController::class, 'destroy']);

Route::middleware('auth:sanctum')
    ->get('/conversations/{conversation}/typing', [TypingIndicatorController::class, 'getTyping']);

// Message Search
Route::middleware('auth:sanctum')
    ->get('/messages/search', [MessageSearchController::class, 'searchGlobal']);

Route::middleware('auth:sanctum')
    ->get('/conversations/{conversation}/messages/search', [MessageSearchController::class, 'search']);

Route::middleware('auth:sanctum')
    ->get('/conversations/{conversation}/messages/suggestions', [MessageSearchController::class, 'suggestions']);