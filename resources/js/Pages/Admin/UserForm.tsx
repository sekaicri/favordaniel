import React, { useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
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
    permisos: string[] | null;
}

interface UserFormProps {
    user: UserData | null;
    roles: Role[];
}

const MODULOS = [
    { id: 'dashboard', title: 'Dashboard', desc: 'Visualización del panel principal', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></> },
    { id: 'entregas', title: 'Entregas', desc: 'Gestión de entregas y envíos', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></> },
    { id: 'repartidores', title: 'Repartidores', desc: 'Gestión de repartidores', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></> },
    { id: 'inventario', title: 'Inventario', desc: 'Gestión de inventarios', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></> },
    { id: 'facturacion', title: 'Facturación', desc: 'Gestión de facturas', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></> },
    { id: 'reportes', title: 'Reportes', desc: 'Acceso a reportes y estadísticas', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></> },
    { id: 'configuracion', title: 'Configuración', desc: 'Configuración del sistema', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
    { id: 'usuarios', title: 'Usuarios', desc: 'Gestión de usuarios', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></> },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
    director: ['dashboard', 'entregas', 'repartidores', 'inventario', 'facturacion', 'reportes', 'configuracion', 'usuarios'],
    admin: ['dashboard', 'entregas', 'repartidores', 'inventario', 'facturacion', 'reportes'],
    facturador: ['dashboard', 'entregas', 'facturacion'],
    inventario: ['dashboard', 'inventario', 'reportes'],
    repartidor: [],
    soporte: ['configuracion', 'usuarios'],
    experiencia: ['dashboard', 'entregas', 'facturacion'],
};

export default function UserForm({ user, roles }: UserFormProps) {
    const isEditing = !!user;

    const initialNombres = user ? user.name.split(' ')[0] : '';
    const initialApellidos = user ? user.name.split(' ').slice(1).join(' ') : '';

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: user?.name || '',
        nombres: initialNombres,
        apellidos: initialApellidos,
        email: user?.email || '',
        password: '',
        role: user?.role || '',
        telefono: user?.telefono || '',
        estado: user?.estado ?? true,
        permisos: user?.permisos || [],
    });

    useEffect(() => {
        setData('name', `${data.nombres} ${data.apellidos}`.trim());
    }, [data.nombres, data.apellidos]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.usuarios.update', user!.id));
        } else {
            post(route('admin.usuarios.store'));
        }
    };

    const togglePermiso = (id: string) => {
        const hasPermiso = data.permisos.includes(id);
        if (hasPermiso) {
            setData('permisos', data.permisos.filter(p => p !== id));
        } else {
            setData('permisos', [...data.permisos, id]);
        }
    };

    const isCorporativo = data.email.toLowerCase().endsWith('@celumovilstore.com.co');

    return (
        <AppLayout>
            <Head title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'} />

            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100">
                    
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-20 h-20 rounded-[20px] bg-secondary-light/10 flex items-center justify-center text-primary shrink-0">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-[2.5rem] font-bold text-primary tracking-tight leading-tight mb-1">
                                {isEditing ? 'Editar Usuario' : 'Crear Usuario'}
                            </h1>
                            <p className="text-slate-500 text-lg font-medium">
                                {isEditing ? `Editando la información de ${user!.name}` : 'Completa la información para registrar un nuevo usuario en el sistema'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-10">
                        {/* Datos Personales */}
                        <div>
                            <h3 className="text-primary font-bold text-base mb-6 tracking-wide">
                                Datos personales:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {/* Nombres */}
                                <div>
                                    <label className="block text-slate-500 font-medium text-sm mb-2">Nombres</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={data.nombres}
                                            onChange={e => setData('nombres', e.target.value)}
                                            placeholder="Ej, Juan Camilo"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-[20px] border border-slate-200 text-[15px] focus:border-primary focus:ring-0 text-slate-700 placeholder-slate-400 transition-colors bg-white"
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium px-2">{errors.name}</p>}
                                </div>

                                {/* Apellidos */}
                                <div>
                                    <label className="block text-slate-500 font-medium text-sm mb-2">Apellidos</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={data.apellidos}
                                            onChange={e => setData('apellidos', e.target.value)}
                                            placeholder="Ej, Ricaurte Ordoñez"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-[20px] border border-slate-200 text-[15px] focus:border-primary focus:ring-0 text-slate-700 placeholder-slate-400 transition-colors bg-white"
                                        />
                                    </div>
                                </div>

                                {/* Correo */}
                                <div>
                                    <label className="block text-slate-500 font-medium text-sm mb-2">Correo</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </span>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="Ej. Social@celumovilstore.com.co"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-[20px] border border-slate-200 text-[15px] focus:border-primary focus:ring-0 text-slate-700 placeholder-slate-400 transition-colors bg-white"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium px-2">{errors.email}</p>}
                                </div>

                                {/* Telefono */}
                                <div>
                                    <label className="block text-slate-500 font-medium text-sm mb-2">Telefono</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={e => setData('telefono', e.target.value)}
                                            placeholder="Ej, 320 123 4567"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-[20px] border border-slate-200 text-[15px] focus:border-primary focus:ring-0 text-slate-700 placeholder-slate-400 transition-colors bg-white"
                                        />
                                    </div>
                                    {errors.telefono && <p className="text-red-500 text-xs mt-1.5 font-medium px-2">{errors.telefono}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Información de Usuario */}
                        <div>
                            <h3 className="text-primary font-bold text-base mb-6 tracking-wide uppercase">
                                información de usuario:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                {/* Rol */}
                                <div>
                                    <label className="block text-slate-500 font-medium text-sm mb-2">Rol</label>
                                    <select
                                        value={data.role}
                                        onChange={e => {
                                            const newRole = e.target.value;
                                            const newPermisos = ROLE_PERMISSIONS[newRole] || [];
                                            // Usamos un objeto completo para actualizar multiples campos en useForm
                                            setData(data => ({
                                                ...data,
                                                role: newRole,
                                                permisos: newPermisos
                                            }));
                                        }}
                                        className="w-full px-4 py-3.5 rounded-[20px] border border-slate-200 text-[15px] focus:border-primary focus:ring-0 text-slate-700 transition-colors bg-white appearance-none"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                            backgroundPosition: 'right 1rem center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '1.2em 1.2em'
                                        }}
                                    >
                                        <option value="" disabled>Seleccionar</option>
                                        {roles.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="text-red-500 text-xs mt-1.5 font-medium px-2">{errors.role}</p>}
                                </div>

                                {/* Contraseña Condicional */}
                                {(!isCorporativo && data.email !== '') && (
                                    <div>
                                        <label className="block text-slate-500 font-medium text-sm mb-2">
                                            {isEditing ? 'Nueva Contraseña' : 'Contraseña de Acceso'}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                            </span>
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Ej. ClaveSegura123'}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-[20px] border border-slate-200 text-[15px] focus:border-primary focus:ring-0 text-slate-700 placeholder-slate-400 transition-colors bg-white"
                                            />
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium px-2">{errors.password}</p>}
                                    </div>
                                )}

                                {/* Mensaje Corporativo */}
                                {(isCorporativo && data.email !== '') && (
                                    <div className="col-span-1">
                                        <div className="flex items-center gap-2 p-3.5 rounded-[20px] bg-blue-50/50 border border-blue-100 text-blue-600 text-sm h-[52px]">
                                            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                                            <span className="leading-tight">Ingresa con Google. No requiere clave.</span>
                                        </div>
                                    </div>
                                )}

                                {/* Estado */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-slate-500 font-medium text-sm mb-2">Estado:</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-700 text-sm">Activo</span>
                                            <button
                                                type="button"
                                                onClick={() => setData('estado', !data.estado)}
                                                className={`relative inline-flex h-8 w-[60px] items-center rounded-full transition-colors duration-200 focus:outline-none shrink-0 ${data.estado ? 'bg-primary' : 'bg-slate-200'}`}
                                            >
                                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${data.estado ? 'translate-x-[32px]' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium m-0">
                                            {data.estado ? 'El usuario tendrá acceso al sistema' : 'Los usuarios inactivos no podrán acceder al sistema'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Permisos del Usuario */}
                        <div className="mt-4">
                            <h3 className="text-primary font-bold text-[1.1rem] tracking-tight mb-1">
                                Permisos del usuario
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Selecciona los módulos a los que el usuario tendrá acceso.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {MODULOS.map((m) => {
                                    const isSelected = data.permisos.includes(m.id);
                                    return (
                                        <div 
                                            key={m.id}
                                            onClick={() => togglePermiso(m.id)}
                                            className={`cursor-pointer rounded-2xl p-5 flex gap-4 items-start transition-all duration-200 border ${
                                                isSelected 
                                                    ? 'border-primary bg-secondary-light/10 shadow-md ring-1 ring-primary' 
                                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                            }`}
                                        >
                                            <div className={`shrink-0 ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {m.icon}
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold text-[15px] leading-none mb-1.5 ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                                                    {m.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 leading-tight">
                                                    {m.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-2">
                            <Link
                                href={route('admin.usuarios')}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-primary text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary-light/10 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                Cancelar
                            </Link>

                            <div className="flex w-full sm:w-auto items-center gap-4 mt-4 sm:mt-0">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData(data => ({
                                            ...data,
                                            nombres: '',
                                            apellidos: '',
                                            name: '',
                                            email: '',
                                            password: '',
                                            telefono: '',
                                            permisos: [],
                                            estado: true,
                                            role: ''
                                        }));
                                        clearErrors();
                                    }}
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-primary text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary-light/10 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Limpiar campos
                                </button>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full sm:w-auto px-10 py-3.5 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        processing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary-dark shadow-[0_4px_14px_0_rgba(231,36,124,0.39)]'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    {processing ? 'Guardando...' : (isEditing ? 'Guardar' : 'Crear Usuario')}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
