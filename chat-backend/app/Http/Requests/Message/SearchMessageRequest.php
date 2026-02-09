<?php

namespace App\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class SearchMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:255'],
            'sender_id' => ['nullable', 'integer', 'exists:users,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
            'type' => ['nullable', 'in:text,image,file,video,audio'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'q.max' => 'Search query must not exceed 255 characters',
            'sender_id.exists' => 'The selected sender does not exist',
            'to.after_or_equal' => 'The end date must be after or equal to the start date',
            'per_page.max' => 'Results per page cannot exceed 100',
            'limit.max' => 'Suggestions limit cannot exceed 50',
        ];
    }
}
