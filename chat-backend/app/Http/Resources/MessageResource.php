<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'sender_id' => $this->sender_id,
            'type' => $this->type,
            'body' => $this->body,
            'edit_count' => $this->edit_count ?? 0,
            'edited_at' => $this->edited_at,
            'is_pinned' => (bool) $this->is_pinned,
            'created_at' => $this->created_at,
        ];
    }
}
