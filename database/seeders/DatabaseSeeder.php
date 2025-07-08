<?php

namespace Database\Seeders;

use App\Models\Inquiry;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(20)->create();

        User::factory()->create([
            'name' => 'Test',
            'email' => 'test@example.com',
            'password' => '123123!tyrtyr',
            'role' => 'admin',
        ]);
        User::factory()->create([
            'name' => 'Tyr',
            'email' => 'tyr@example.com',
            'password' => Hash::make('123123!tyrtyr'),
            'role' => 'user',
        ]);

        Inquiry::factory(200)->create();
    }
}
