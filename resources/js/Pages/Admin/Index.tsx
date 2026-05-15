import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    telefono: string | null;
    estado: boolean;
    ultimo_acceso: string | null;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    total: number;
}

interface AdminIndexProps {
    usuarios: PaginatedData<User>;
    filters: {
        search?: string;
        role?: string;
        estado?: string;
    };
}

export default function AdminIndex({ usuarios, filters = {} }: AdminIndexProps) {
    const { props } = usePage<any>();
    const flash = props.flash || {};

    const [filterState, setFilterState] = useState({
        search: filters.search || '',
        role: filters.role || '',
        estado: filters.estado || ''
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.usuarios'), filterState as any, { preserveState: true });
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Nunca';
        const date = new Date(dateStr);
        const today = new Date();
        const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        
        const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        
        if (isToday) {
            return `Hoy, ${time}`;
        }
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
        
        if (isYesterday) {
            return `Ayer, ${time}`;
        }
        
        return `${date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${time}`;
    };

    const getRoleBadge = (role: string) => {
        const roles: Record<string, { label: string, classes: string }> = {
            'admin': { label: 'Administrador', classes: 'bg-pink-50 text-pink-600 border-pink-200' },
            'facturador': { label: 'Facturador', classes: 'bg-green-50 text-green-600 border-green-200' },
            'inventarios': { label: 'Inventarios', classes: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
            'repartidor': { label: 'Repartidor', classes: 'bg-cyan-50 text-cyan-500 border-cyan-200' },
            'soporte': { label: 'Soporte', classes: 'bg-orange-50 text-orange-500 border-orange-200' },
            'experiencia': { label: 'Experiencia', classes: 'bg-purple-50 text-purple-500 border-purple-200' },
            'user': { label: 'Usuario', classes: 'bg-slate-50 text-slate-500 border-slate-200' },
        };

        const r = roles[role.toLowerCase()] || roles['user'];
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${r.classes}`}>{r.label}</span>;
    };

    return (
        <AdminLayout>
            <Head title="Gestión de Usuarios" />

            {flash.status && (
                <div className="bg-[#f8bbd0] text-[#880e4f] p-4 rounded-xl mb-6 border border-[#f48fb1] font-semibold text-center shadow-sm">
                    {flash.status}
                </div>
            )}

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#9c104a] m-0 mb-1 tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-slate-500 text-base font-medium">Administra los usuarios del sistema y sus permisos</p>
                    </div>
                </div>
                
                <Link
                    href={route('admin.usuarios.create')}
                    className="bg-white border border-[#e91e63] text-[#e91e63] px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-pink-50 transition-colors no-underline"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    Nuevo Usuario
                </Link>
            </div>

            <div className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-2 block ml-1">Buscar usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Nombre, correo o teléfono" 
                                value={filterState.search}
                                onChange={e => setFilterState({...filterState, search: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-colors"
                            />
                        </div>
                    </div>
                    
                    <div className="w-48">
                        <label className="text-xs font-bold text-slate-500 mb-2 block ml-1">Rol</label>
                        <select 
                            value={filterState.role}
                            onChange={e => setFilterState({...filterState, role: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 appearance-none text-slate-600"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                        >
                            <option value="">Todos los roles</option>
                            <option value="admin">Administrador</option>
                            <option value="facturador">Facturador</option>
                            <option value="inventarios">Inventarios</option>
                            <option value="repartidor">Repartidor</option>
                            <option value="soporte">Soporte</option>
                            <option value="experiencia">Experiencia</option>
                        </select>
                    </div>

                    <div className="w-48">
                        <label className="text-xs font-bold text-slate-500 mb-2 block ml-1">Estado</label>
                        <select 
                            value={filterState.estado}
                            onChange={e => setFilterState({...filterState, estado: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 appearance-none text-slate-600"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em` }}
                        >
                            <option value="">Todos los estados</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>

                    <button type="submit" className="bg-[#e91e63] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#d81b60] transition-colors flex items-center gap-2 h-[46px] shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Aplicar Filtro
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 font-sans tracking-wide">Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide">Correo</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide">Teléfono</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide">Último acceso</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {usuarios.data.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-pink-50 text-[#e91e63] flex items-center justify-center font-bold text-xs shrink-0">
                                                {user.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-slate-500 font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-500">
                                        {user.telefono || 'Sin registrar'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${user.estado ? 'border-green-200 text-green-700 bg-green-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.estado ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                                {user.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-500">
                                        {formatDate(user.ultimo_acceso)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <Link
                                                href={route('admin.usuarios.edit', user.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors text-[#e91e63] text-xs font-semibold no-underline"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Editar
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">
                        Mostrando {usuarios.data.length} de {usuarios.total} usuarios
                    </span>
                    <div className="flex items-center gap-1">
                        {usuarios.links.map((link: any, idx: number) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <button key={idx} disabled={!link.url} onClick={() => link.url ? router.get(link.url, filterState as any) : null} className="w-8 h-8 flex items-center justify-center rounded-full border border-pink-100 text-pink-400 hover:bg-pink-50 disabled:opacity-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <button key={idx} disabled={!link.url} onClick={() => link.url ? router.get(link.url, filterState as any) : null} className="w-8 h-8 flex items-center justify-center rounded-full border border-pink-100 text-pink-400 hover:bg-pink-50 disabled:opacity-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                );
                            }
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => link.url ? router.get(link.url, filterState as any) : null}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${link.active ? 'bg-[#e91e63] text-white' : 'text-pink-400 hover:bg-pink-50'}`}
                                >
                                    {link.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-400 font-medium pb-8 px-2">
                <span>© 2026 Celumovil Store. Todos los derechos reservados</span>
                <span>Versión 1.0.0</span>
            </div>
        </AdminLayout>
    );
}
