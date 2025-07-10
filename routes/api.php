<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\SocialiteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('/users', UserController::class);
    Route::apiResource('/inquiry', InquiryController::class);
    Route::apiResource('/products', ProductController::class);
    Route::apiResource('/services', ServiceController::class);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::prefix('auth')->group(function () {
    // These routes handle the traditional Socialite redirect flow (less common for SPAs with @react-oauth/google)
    Route::middleware('web')->group(function () {
        Route::get('/google/redirect', [SocialiteController::class, 'redirectToGoogle'])->name('auth.google.redirect');
        Route::get('/google/callback', [SocialiteController::class, 'handleGoogleCallback'])->name('auth.google.callback');
    });

    // NEW ROUTE: Handles the Google ID Token sent directly from React
    Route::post('/google/callback/token', [SocialiteController::class, 'handleGoogleTokenCallback']);
});
