<?php

use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
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

// Message Reactions
Route::middleware('auth:sanctum')
    ->post('/messages/{message}/reactions', [MessageReactionController::class, 'store']);

Route::middleware('auth:sanctum')
    ->delete('/messages/{message}/reactions/{reaction}', [MessageReactionController::class, 'destroy']);

Route::middleware('auth:sanctum')
    ->get('/messages/{message}/reactions', [MessageReactionController::class, 'getByMessage']);