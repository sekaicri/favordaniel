<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

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
    public function handleGoogleCallback(\App\Services\GoogleAuthService $authService)
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            if (!str_ends_with(strtolower($googleUser->email), '@celumovilstore.com.co')) {
                return redirect()->route('login')->with('status', 'El inicio de sesión con Google es exclusivo para correos corporativos.');
            }

            try {
                // Delegar lógica de aprovisionamiento al servicio
                $user = $authService->processGoogleUser($googleUser);
                
                Auth::login($user);
                $user->update(['ultimo_acceso' => Carbon::now()]);

                return redirect()->intended('dashboard');
                
            } catch (Exception $e) {
                if ($e->getMessage() === 'USER_NOT_REGISTERED') {
                    return redirect()->route('access.denied');
                }
                throw $e;
            }
            
        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Error al autenticar con Google: ' . $e->getMessage());
        }
    }
}
