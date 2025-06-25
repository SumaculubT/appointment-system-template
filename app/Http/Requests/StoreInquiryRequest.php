<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInquiryRequest extends FormRequest
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
        return [
            'user_id' => 'exists:users,id',
            'user_name' => 'required|string|max:255',
            'user_email' => 'required|email',
            'user_contact_number' => 'nullable|string|max:20',
            'vehicle_desc' => 'nullable|string',
            'plate_number' => 'nullable|string|max:20',
            'set_date' => 'nullable',
            'set_time' => 'nullable',
            'inquiry' => 'required|string',
            'status' => 'required|string|in:pending,approved,rejected',
        ];
    }
}
