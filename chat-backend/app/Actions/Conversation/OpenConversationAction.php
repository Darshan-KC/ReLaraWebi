<?php 

namespace App\Actions\Conversation;

use App\DTO\Conversation\OpenConversationDTO;
use App\Models\Conversation;
use App\Models\Friendship;
use Illuminate\Support\Facades\DB;

class OpenConversationAction
{
    public function execute(
        OpenConversationDTO $dto
    ): Conversation {

        $isFriend = Friendship::query()
            ->where('status', 'accepted')
            ->where(function ($query) use ($dto) {
                $query
                    ->where('sender_id', $dto->userId)
                    ->where('receiver_id', $dto->friendId);
            })
            ->orWhere(function ($query) use ($dto) {
                $query
                    ->where('sender_id', $dto->friendId)
                    ->where('receiver_id', $dto->userId);
            })
            ->exists();

        abort_if(
            ! $isFriend,
            403,
            'You are not friends.'
        );

        $conversation = Conversation::query()
            ->whereHas('participants', function ($query) use ($dto) {
                $query->whereIn(
                    'user_id',
                    [
                        $dto->userId,
                        $dto->friendId,
                    ]
                );
            }, '=', 2)
            ->first();

        if ($conversation) {
            return $conversation
                ->load('participants');
        }

        return DB::transaction(function () use ($dto) {

            $conversation = Conversation::create();

            $conversation->participants()
                ->attach([
                    $dto->userId,
                    $dto->friendId,
                ]);

            return $conversation
                ->load('participants');
        });
    }
}