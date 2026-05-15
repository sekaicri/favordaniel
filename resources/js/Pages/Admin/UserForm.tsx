import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

interface Role {
    value: string;
    label: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    telefono: string | null;
    estado: boolean;
    ultimo_acceso: string | null;
}

interface UserFormProps {
    user: UserData | null;
    roles: Role[];
}

export default function UserForm({ user, roles }: UserFormProps) {
    const isEditing = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'user',
        telefono: user?.telefono || '',
        estado: user?.estado ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.usuarios.update', user!.id));
        } else {
            post(route('admin.usuarios.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'} />

            <div className="max-w-2xl mx-auto">
                {/* Header responsive */}
                <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditing ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} /></svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#9c104a] m-0 mb-1 tracking-tight">
                                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-base font-medium truncate max-w-[200px] sm:max-w-none">
                                {isEditing ? `Editando a ${user!.name}` : 'Registra un nuevo miembro'}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={route('admin.usuarios')}
                        className="w-full sm:w-auto bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors no-underline"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Volver
                    </Link>
                </div>

                {/* Card del formulario */}
                <div className="bg-white rounded-3xl shadow-[0_10px_25px_-5px_rgba(233,30,99,0.1)] border border-[#fce4ec] overflow-hidden mb-8">
                    {/* Barra superior decorativa */}
                    <div className="h-2 bg-gradient-to-r from-[#e91e63] to-[#c2185b]"></div>

                    <form onSubmit={submit} className="p-6 sm:p-8 flex flex-col gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="Nombre del usuario"
                                className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="correo@celumovilstore.com.co"
                                className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                {isEditing ? 'Nueva contraseña' : 'Contraseña'}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
                                className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                        </div>

                        {/* Rol y Teléfono - Responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                    Rol
                                </label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0 appearance-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e91e63'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 1rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.2em 1.2em'
                                    }}
                                >
                                    {roles.map(r => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                                {errors.role && <p className="text-red-500 text-xs mt-1 font-medium">{errors.role}</p>}
                            </div>

                            <div>
                                <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    value={data.telefono}
                                    onChange={e => setData('telefono', e.target.value)}
                                    placeholder="300 000 0000"
                                    className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0"
                                />
                                {errors.telefono && <p className="text-red-500 text-xs mt-1 font-medium">{errors.telefono}</p>}
                            </div>
                        </div>

                        {/* Estado toggle responsive */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#fdf2f8] p-4 rounded-2xl border border-[#f8bbd0]">
                            <button
                                type="button"
                                onClick={() => setData('estado', !data.estado)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${data.estado ? 'bg-[#e91e63]' : 'bg-slate-300'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${data.estado ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <div className="text-center sm:text-left">
                                <p className="font-bold text-[#880e4f] text-sm m-0">
                                    Estado: {data.estado ? 'Activo' : 'Inactivo'}
                                </p>
                                <p className="text-[10px] text-slate-500 m-0 mt-0.5 font-medium">
                                    {data.estado ? 'El usuario puede acceder al sistema' : 'El usuario tiene el acceso bloqueado'}
                                </p>
                            </div>
                        </div>

                        {/* Botón de enviar */}
                        <button
                            type="submit"
                            disabled={processing}
                            className={`mt-2 text-white p-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 shadow-xl ${
                                processing
                                    ? 'bg-slate-400 shadow-none cursor-not-allowed scale-95'
                                    : 'bg-gradient-to-br from-[#e91e63] to-[#c2185b] shadow-[0_10px_20px_-5px_rgba(233,30,99,0.4)] hover:-translate-y-1 active:scale-95'
                            }`}
                        >
                            {processing
                                ? 'Guardando...'
                                : isEditing ? 'Guardar Cambios' : 'Crear Usuario'
                            }
                        </button>
                    </form>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium py-8 px-2 gap-2 text-center">
                    <span>© 2026 Celumovil Store. Todos los derechos reservados</span>
                    <span>Versión 1.0.0</span>
                </div>
            </div>
        </AdminLayout>
    );
}
