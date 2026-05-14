import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_secret: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registro" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nombre Completo" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo Electrónico" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="admin_secret" value="Clave de Administrador (Opcional)" />

                    <TextInput
                        id="admin_secret"
                        type="password"
                        name="admin_secret"
                        value={data.admin_secret}
                        className="mt-1 block w-full"
                        autoComplete="off"
                        onChange={(e) => setData('admin_secret', e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">Déjalo en blanco si eres repartidor.</p>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center gap-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Completar Registro
                    </PrimaryButton>
                    
                    <div className="text-gray-500 mt-2 text-sm">
                        ¿Ya tienes una cuenta? {' '}
                        <Link
                            href={route('login')}
                            className="text-[#e91e63] underline hover:text-[#c2185b] font-bold transition-colors"
                        >
                            Inicia Sesión aquí
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
