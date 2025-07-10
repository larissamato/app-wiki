<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KbArticleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'min:25', 'unique:kb_articles'],
            'content' => ['required', 'min:25'],
            'is_private' => ['required', 'boolean'],
            'categories.*' => [
                'string',
                Rule::exists('kb_categories', 'slug')
            ]
        ];
    }
}
