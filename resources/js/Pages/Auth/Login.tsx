import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center gap-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Iniciar Sesión
                    </PrimaryButton>
                    
                    <div className="flex flex-col items-center gap-2 mt-4 text-sm">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[#880e4f] underline hover:text-[#e91e63] font-semibold transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                        
                        <div className="text-gray-500">
                            ¿No tienes cuenta? {' '}
                            <Link
                                href={route('register')}
                                className="text-[#e91e63] underline hover:text-[#c2185b] font-bold transition-colors"
                            >
                                Regístrate aquí
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
