<?php

namespace App\Http\Requests\MessageReaction;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageReactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'emoji' => 'required|string|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'emoji.required' => 'An emoji is required',
            'emoji.string' => 'The emoji must be a string',
            'emoji.max' => 'The emoji must not exceed 10 characters',
        ];
    }
}
