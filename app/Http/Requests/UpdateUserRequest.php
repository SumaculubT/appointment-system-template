<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:55',
            'email' => 'required|email|unique:users,email,' . $this->id,
            'contact_number' => 'nullable|string|max:20',
            'role' => 'sometimes|in:admin,employee,user',
        ];

        if ($this->filled('password')) {
            $rules['password'] = [
                'required',
                'string',
                'min:8',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->symbols()
                    ->uncompromised(),
            ];
            $rules['password_confirmation'] = 'required|same:password';
        } else {
        }

        return $rules;
    }
}
