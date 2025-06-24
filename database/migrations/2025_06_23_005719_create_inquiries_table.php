<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('user_name');
            $table->string('user_email');
            $table->string('user_contact_number')->nullable();
            $table->string('vehicle_desc')->nullable();
            $table->string('plate_number')->nullable();
            $table->date('set_date');
            $table->time('set_time');
            $table->text('inquiry');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
