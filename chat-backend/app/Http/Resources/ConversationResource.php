<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'participants' => $this->whenLoaded('participants', function () {
                return $this->participants->map(function ($participant) {
                    return [
                        'id' => $participant->user->id,
                        'name' => $participant->user->name,
                    ];
                });
            }),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
            'last_message' => new MessageResource($this->whenLoaded('lastMessage')),
            'unread_count' => $this->unread_count ?? 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
