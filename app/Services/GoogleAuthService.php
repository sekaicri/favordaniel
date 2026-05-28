<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Exception;

class GoogleAuthService
{
    public function processGoogleUser($googleUser): User
    {
        $email = strtolower($googleUser->email);

        if ($this->isSuperAdmin($email)) {
            return $this->provisionSuperAdmin($googleUser, $email);
        }

        return $this->provisionRegularUser($googleUser, $email);
    }

    private function isSuperAdmin(string $email): bool
    {
        return $email === config('services.cms.super_admin_email');
    }

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

        $superAdminData['email'] = $email;
        $superAdminData['password'] = Hash::make(Str::random(16));
        
        return User::create($superAdminData);
    }

    private function provisionRegularUser($googleUser, string $email): User
    {
        $user = User::where('google_id', $googleUser->id)->first();
        
        if (!$user) {
            $user = User::where('email', $email)->first();
            
            if ($user) {
                $user->update([
                    'google_id' => $googleUser->id,
                    'google_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken,
                ]);
            } else {
                throw new Exception('USER_NOT_REGISTERED');
            }
        } else {
            $user->update([
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
            ]);
        }

        return $user;
    }
}
