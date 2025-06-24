<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'user_email',
        'user_contact_number',
        'vehicle_desc',
        'plate_number',
        'set_date',
        'set_time',
        'inquiry',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
