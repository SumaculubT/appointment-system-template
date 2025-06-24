<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInquiryRequest extends FormRequest
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
    public function rules()
    {
        return [
            'vehicle_desc' => 'nullable|string',
            'plate_number' => 'nullable|string',
            'set_date' => 'nullable|date',
            'set_time' => 'nullable',
            'user_id' => 'nullable|exists:users,id',
            'user_name' => 'required|string',
            'user_email' => 'required|email',
            'user_contact_number' => 'nullable|string',
            'inquiry' => 'nullable|string',
            'status' => 'nullable|string',
        ];
    }
}
