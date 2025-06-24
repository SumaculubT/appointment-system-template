<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class InquiryResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user_name' => $this->user_name,
            'user_email' => $this->user_email,
            'user_contact_number' => $this->user_contact_number,
            'vehicle_desc' => $this->vehicle_desc,
            'plate_number' => $this->plate_number,
            'set_date' => Carbon::parse($this->set_date)->format('Y-m-d'),
            'set_time' => Carbon::parse($this->set_time)->format('H:i'),
            'inquiry' => $this->inquiry,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
