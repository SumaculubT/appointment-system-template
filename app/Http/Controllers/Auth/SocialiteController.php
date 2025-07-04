<?php

// app/Http/Controllers/Auth/SocialiteController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite; // Still needed forredirectToGoogle/handleGoogleCallback
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Google\Client as GoogleClient; // Import Google Client Library
use Illuminate\Support\Facades\Log;

class SocialiteController extends Controller
{
    /**
     * This method is for the traditional Socialite redirect flow.
     * It's generally less used when using @react-oauth/google directly on frontend.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * This method is for the traditional Socialite callback flow.
     * It's generally less used when using @react-oauth/google directly on frontend.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $googleUser->id)->first();

            if (!$user) {
                $user = User::where('email', $googleUser->email)->first();

                if ($user) {
                    $user->google_id = $googleUser->id;
                    $user->save();
                } else {
                    $user = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'password' => Hash::make(Str::random(24)),
                        'contact_number' => null,
                        'role' => 'user',
                    ]);
                }
            }

            Auth::login($user);
            $token = $user->createToken('auth_token')->plainTextToken;

            $redirectUrl = env('FRONTEND_URL') . '/login/callback?token=' . $token . '&user=' . urlencode(json_encode($user));
            return redirect($redirectUrl);
        } catch (\Exception $e) {
            $redirectUrl = env('FRONTEND_URL') . '/login?error=' . urlencode('Google login failed: ' . $e->getMessage());
            return redirect($redirectUrl);
        }
    }

    /**
     * NEW METHOD: Handles the Google ID Token sent from React frontend.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleGoogleTokenCallback(Request $request)
    {
        $idToken = $request->input('token'); // The ID token from Google

        if (!$idToken) {
            return response()->json(['message' => 'Google ID Token is missing.'], 400);
        }

        try {
            $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);
            $payload = $client->verifyIdToken($idToken);

            if ($payload) {
                $googleId = $payload['sub']; // Google user's unique ID
                $email = $payload['email'];
                $name = $payload['name'] ?? $payload['given_name'] . ' ' . $payload['family_name']; // Fallback for name

                // Find or create user
                $user = User::where('google_id', $googleId)->first();

                if (!$user) {
                    // Check if a user with this email already exists (might be a regular signup)
                    $user = User::where('email', $email)->first();

                    if ($user) {
                        // User exists with this email but without google_id, link accounts
                        $user->google_id = $googleId;
                        $user->save();
                    } else {
                        // Create a new user
                        $user = User::create([
                            'name' => $name,
                            'email' => $email,
                            'google_id' => $googleId,
                            'password' => Hash::make(Str::random(24)), // Generate a random password for Google users
                            'contact_number' => null, // Or prompt user to fill this later
                            'role' => 'user',
                        ]);
                    }
                }

                // Log in the user and generate a Sanctum token
                Auth::login($user); // Optional: if you want to use session based auth too
                $token = $user->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'user' => $user,
                    'token' => $token,
                    'message' => 'Google login successful!',
                ], 200);
            } else {
                return response()->json(['message' => 'Invalid Google ID Token.'], 401);
            }
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Google Token Verification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Google login failed due to token verification error.'], 500);
        }
    }
}
