<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
// FIX: Change this import
use Illuminate\Validation\Rules\Password; // THIS IS THE CORRECT IMPORT FOR PASSWORD VALIDATION RULES

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
            'contact_number' => 'nullable|string|max:20', // Assuming you want to validate contact_number
        ];

        // Conditionally add password validation rules ONLY if a new password is provided
        // This is crucial for update forms where password is often optional
        if ($this->filled('password')) { // Use filled() to check if it's present AND not empty
            $rules['password'] = [
                'required', // Make it required ONLY if it's filled in the request
                'string',
                'min:8', // You can use this string-based min, or the object-oriented Password::min(8)
                // Both work if you've imported the correct Password class for the latter
                'confirmed',
                Password::min(8) // This now refers to Illuminate\Validation\Rules\Password
                    ->letters()
                    ->symbols()
                    ->uncompromised(), // Highly recommended for security
            ];
            $rules['password_confirmation'] = 'required|same:password'; // If password is required, confirmation is also required
        } else {
            // If password is not provided, ensure the fields are nullable or not present in validation
            // This is handled by not adding them to $rules if not filled
        }

        return $rules;
    }
}
