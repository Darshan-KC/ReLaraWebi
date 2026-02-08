<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'emoji' => [
                'required',
                'string',
                'max:10',
                // Regex to match emoji characters and Unicode symbols
                'regex:/^[\x{1F300}-\x{1F9FF}]|[\x{2600}-\x{27BF}]|[\x{1F900}-\x{1F9FF}]|[\x{2300}-\x{23FF}]|[\x{2000}-\x{206F}]+$/u',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'emoji.required' => 'An emoji is required',
            'emoji.string' => 'The emoji must be a string',
            'emoji.max' => 'The emoji must not exceed 10 characters',
            'emoji.regex' => 'Only valid emoji characters are allowed',
        ];
    }
}

