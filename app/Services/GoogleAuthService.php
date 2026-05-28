<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Exception;

class GoogleAuthService
{
    /**
     * El correo del Súper Administrador que siempre tendrá acceso total.
     */
    private const SUPER_ADMIN_EMAIL = 'hola@celumovilstore.com.co';

    /**
     * Procesa la autenticación del usuario de Google.
     * Devuelve el modelo User si es exitoso, o lanza una excepción si se deniega.
     *
     * @param mixed $googleUser Objeto Socialite User
     * @return User
     * @throws Exception
     */
    public function processGoogleUser($googleUser): User
    {
        $email = strtolower($googleUser->email);

        if ($this->isSuperAdmin($email)) {
            return $this->provisionSuperAdmin($googleUser, $email);
        }

        return $this->provisionRegularUser($googleUser, $email);
    }

    /**
     * Verifica si el correo pertenece al Súper Administrador.
     */
    private function isSuperAdmin(string $email): bool
    {
        return $email === self::SUPER_ADMIN_EMAIL;
    }

    /**
     * Aprovisiona y asegura los permisos del Súper Administrador.
     */
    private function provisionSuperAdmin($googleUser, string $email): User
    {
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
            return $user;
        }

        // Si no existe, lo crea con una contraseña aleatoria inaccesible
        $superAdminData['email'] = $email;
        $superAdminData['password'] = Hash::make(Str::random(16));
        
        return User::create($superAdminData);
    }

    /**
     * Aprovisiona y actualiza un usuario regular. Lanza error si no existe.
     *
     * @throws Exception
     */
    private function provisionRegularUser($googleUser, string $email): User
    {
        $user = User::where('google_id', $googleUser->id)->first();
        
        if (!$user) {
            // Verificar si el usuario existe por correo (creado manualmente)
            $user = User::where('email', $email)->first();
            
            if ($user) {
                // Sincronizar info de Google por primera vez
                $user->update([
                    'google_id' => $googleUser->id,
                    'google_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                ]);
            } else {
                // Usuario no registrado en la DB, denegar acceso
                throw new Exception('USER_NOT_REGISTERED');
            }
        } else {
            // Actualizar tokens
            $user->update([
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
            ]);
        }

        return $user;
    }
}
