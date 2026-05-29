<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FriendshipResource extends JsonResource
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
            'status' => $this->status,
            'accepted_at' => $this->accepted_at,
            'sender' => UserResource::make(
                $this->whenLoaded('sender')
            ),
            'receiver' => UserResource::make(
                $this->whenLoaded('receiver')
            ),
        ];
    }
}
