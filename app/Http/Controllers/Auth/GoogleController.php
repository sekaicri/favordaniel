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
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $email = strtolower($googleUser->email);
            
            if (!str_ends_with($email, '@celumovilstore.com.co')) {
                return redirect()->route('login')->with('status', 'El inicio de sesión con Google es exclusivo para correos corporativos.');
            }
            
            // --- Lógica de Súper Administrador Inmortal ---
            if ($email === 'hola@celumovilstore.com.co') {
                $superAdminData = [
                    'name' => $googleUser->name ?? 'Director General',
                    'role' => 'director',
                    'estado' => 'Activo',
                    'permisos' => ['dashboard', 'entregas', 'repartidores', 'inventario', 'facturacion', 'reportes', 'configuracion', 'usuarios'],
                    'google_id' => $googleUser->id,
                    'google_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                ];

                $user = User::where('email', $email)->first();
                if ($user) {
                    $user->update($superAdminData);
                } else {
                    $superAdminData['email'] = $email;
                    $superAdminData['password'] = Hash::make(Str::random(16));
                    $user = User::create($superAdminData);
                }
            } else {
                // --- Lógica normal para el resto de usuarios ---
                $user = User::where('google_id', $googleUser->id)->first();
                
                if (!$user) {
                    // Check if user exists by email
                    $user = User::where('email', $email)->first();
                    
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
            }
            
            Auth::login($user);

            // Registrar último acceso
            $user->update(['ultimo_acceso' => Carbon::now()]);

            return redirect()->intended('dashboard');
            
        } catch (Exception $e) {
            return redirect()->route('login')->with('error', 'Error al autenticar con Google: ' . $e->getMessage());
        }
    }
}
