<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Exception;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\Response
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\Response
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = User::where('google_id', $googleUser->id)->first();
            
            if (!$user) {
                // Check if user exists by email
                $user = User::where('email', $googleUser->email)->first();
                
                if ($user) {
                    // Update existing user with google info
                    $user->update([
                        'google_id' => $googleUser->id,
                        'google_token' => $googleUser->token,
                        'google_refresh_token' => $googleUser->refreshToken,
                    ]);
                } else {
                    // User is not registered, deny access
                    return redirect()->route('access.denied');
                }
            } else {
                // Update tokens
                $user->update([
                    'google_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                ]);
            }
            
            Auth::login($user);
            
            // Redirección escalable basada en el rol del usuario
            $redirectRoute = match($user->role) {
                'admin' => route('admin.usuarios', absolute: false),
                'repartidor' => route('dashboard', absolute: false),
                // Aquí puedes agregar más roles a futuro:
                // 'facturador' => route('facturas.index', absolute: false),
                default => route('dashboard', absolute: false),
            };
            
            return redirect()->intended($redirectRoute);
            
        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Error al autenticar con Google: ' . $e->getMessage());
        }
    }
}
