import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, Link } from '@inertiajs/react';

interface Repartidor {
    id: number;
    name: string;
    email: string;
    telefono: string | null;
    estado: boolean;
    ultimo_acceso: string | null;
    total_asignadas: number;
    entregadas: number;
    por_entregar: number;
    pendientes: number;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    total: number;
}

interface RepartidoresIndexProps {
    repartidores: PaginatedData<Repartidor>;
    filters: {
        search?: string;
    };
}

export default function RepartidoresIndex({ repartidores, filters = {} }: RepartidoresIndexProps) {
    const [filterState, setFilterState] = useState({
        search: filters.search || '',
    });

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.repartidores'), filterState as any, { preserveState: true });
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

    return (
        <AppLayout>
            <Head title="Gestión de Repartidores" />

            {/* Header section */}
            <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e91e63]/10 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0">
                            {/* Icono de grupo de usuarios / repartidores */}
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-[2.5rem] font-semibold text-[#e91e63] tracking-tight leading-tight mb-1" style={{ fontFamily:"'Montserrat',sans-serif" }}>Gestión de Repartidores</h1>
                            <p className="text-slate-500 text-lg font-medium">Visualiza los repartidores, sus entregas y desempeño</p>
                        </div>
                    </div>
                    
                    {/* Botón de Reglas Tarifarias */}
                    <div className="flex shrink-0 mt-4 sm:mt-0 w-full sm:w-auto">
                        <Link 
                            href={route('admin.reglas')}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#e91e63] to-pink-400 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Reglas Tarifarias
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search filter */}
            <div className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1">
                        <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">Buscar repartidor</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Nombre, correo o teléfono" 
                                value={filterState.search}
                                onChange={e => setFilterState({ search: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-colors shadow-sm lg:shadow-none"
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="bg-[#e91e63] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#d81b60] transition-colors flex items-center justify-center gap-2 h-[46px] shadow-sm mt-2 sm:mt-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filtrar
                    </button>
                </form>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 font-sans tracking-wide uppercase">Repartidor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 text-center font-sans tracking-wide uppercase">Asignadas</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 text-center font-sans tracking-wide uppercase">Entregadas</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 text-center font-sans tracking-wide uppercase">Pendientes</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 text-center font-sans tracking-wide uppercase">Avance</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 text-center font-sans tracking-wide uppercase">Último acceso</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-700 text-center font-sans tracking-wide uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {repartidores.data.map((driver) => {
                                const total = driver.total_asignadas;
                                const done = driver.entregadas;
                                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                return (
                                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#e91e63]/10 text-[#e91e63] flex items-center justify-center font-semibold text-xs shrink-0">
                                                    {driver.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-slate-700">{driver.name}</span>
                                                    <span className="text-xs text-slate-400">{driver.telefono || 'Sin teléfono'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                                            {total}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-green-600">
                                            {done}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-orange-500">
                                            {driver.pendientes + driver.por_entregar}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-[#e91e63] h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="text-xs font-semibold text-slate-500">{pct}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-slate-500">
                                            {formatDate(driver.ultimo_acceso)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={route('admin.repartidores.show', driver.id)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors text-[#e91e63] text-xs font-semibold no-underline"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                Ver Detalle
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                            {repartidores.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-medium text-sm">
                                        No se encontraron repartidores registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mb-8">
                {repartidores.data.map((driver) => {
                    const total = driver.total_asignadas;
                    const done = driver.entregadas;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                        <div key={driver.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#e91e63]/10 text-[#e91e63] flex items-center justify-center font-semibold text-sm shrink-0">
                                        {driver.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700 font-semibold">{driver.name}</span>
                                        <span className="text-xs text-slate-400">{driver.email}</span>
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.repartidores.show', driver.id)}
                                    className="w-10 h-10 bg-pink-50 text-[#e91e63] flex items-center justify-center rounded-xl hover:bg-pink-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Entregas</p>
                                    <p className="text-xs font-semibold text-slate-700">{done} / {total}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Avance</p>
                                    <p className="text-xs font-semibold text-[#e91e63]">{pct}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Teléfono</p>
                                    <p className="text-xs text-slate-600 font-medium">{driver.telefono || 'Sin registrar'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Visto el</p>
                                    <p className="text-xs text-slate-600 font-medium">{formatDate(driver.ultimo_acceso)}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Pagination */}
            {repartidores.total > 0 && (
                <div className="bg-white rounded-2xl px-4 sm:px-6 py-4 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                        Mostrando {repartidores.data.length} de {repartidores.total}
                    </span>
                    <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                        {repartidores.links.map((link: any, idx: number) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <button key={idx} disabled={!link.url} onClick={() => link.url ? router.get(link.url, filterState as any) : null} className="w-8 h-8 flex items-center justify-center rounded-full border border-pink-100 text-pink-400 hover:bg-pink-50 disabled:opacity-50 shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <button key={idx} disabled={!link.url} onClick={() => link.url ? router.get(link.url, filterState as any) : null} className="w-8 h-8 flex items-center justify-center rounded-full border border-pink-100 text-pink-400 hover:bg-pink-50 disabled:opacity-50 shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                );
                            }
                            return (
                                <button 
                                    key={idx}
                                    onClick={() => link.url ? router.get(link.url, filterState as any) : null}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-semibold shrink-0 ${link.active ? 'bg-[#e91e63] text-white shadow-md' : 'text-[#e91e63] hover:bg-pink-50 border border-pink-100'}`}
                                >
                                    {link.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            

        </AppLayout>
    );
}
