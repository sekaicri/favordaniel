import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import GalleryModal from '@/Components/GalleryModal';
import DeliveryDetailCard from '@/Components/DeliveryDetailCard';

interface User {
    id: number;
    name: string;
}

interface Entrega {
    id: number;
    tracking_id: string;
    descripcion: string;
    cliente: string | null;
    url_evidencia: string[] | string | null;
    created_at: string;
    updated_at: string;
    estado: string;
    user: User | null;
    user_id: number | null;
    condicion_tiempo?: string;
    palabra_clave?: string | null;
    canal_compra?: string | null;
    condicion_actual?: string;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    total: number;
}

interface AdminDeliveriesProps {
    entregas: PaginatedData<Entrega>;
    repartidores: User[];
    filters: {
        search?: string;
        fecha?: string;
        estado?: string;
        canal_compra?: string;
    };
}

export default function AdminDeliveries({ entregas, repartidores, filters = {} }: AdminDeliveriesProps) {
    const { props } = usePage<any>();
    const flash = props.flash || {};
    const authUser = props.auth.user;

    const [filterState, setFilterState] = useState({
        search: filters.search || '',
        fecha: filters.fecha || '',
        estado: filters.estado || '',
        canal_compra: filters.canal_compra || ''
    });

    const [activeTab, setActiveTab] = useState<'por_entregar' | 'por_asignar' | 'alertas'>('por_entregar');
    const [isSyncing, setIsSyncing] = useState(false);

    // Gallery State
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // Assign Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedEntregaForAssign, setSelectedEntregaForAssign] = useState<Entrega | null>(null);
    const [selectedRepartidorId, setSelectedRepartidorId] = useState<number | ''>('');

    const hasActiveFilters = filters.search || filters.fecha || filters.estado || filters.canal_compra;
    const isSingleFilteredResult = hasActiveFilters && entregas.data.length === 1;

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.entregas'), filterState as any, { preserveState: true });
    };

    const clearFilters = () => {
        setFilterState({ search: '', fecha: '', estado: '', canal_compra: '' });
        router.get(route('admin.entregas'));
    };

    const handleSyncSheets = () => {
        setIsSyncing(true);
        router.post(route('admin.entregas.sync'), {}, {
            preserveState: true,
            onFinish: () => setIsSyncing(false)
        });
    };

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEntregaForAssign || !selectedRepartidorId) return;
        router.post(route('admin.entregas.assign', selectedEntregaForAssign.id), {
            repartidor_id: selectedRepartidorId
        }, {
            preserveState: true,
            onSuccess: () => {
                setIsAssignModalOpen(false);
                setSelectedEntregaForAssign(null);
                setSelectedRepartidorId('');
            }
        });
    };

    const handleUnassign = (entregaId: number) => {
        if(confirm('¿Seguro que deseas desasignar esta entrega?')){
            router.post(route('admin.entregas.unassign', entregaId), {}, {
                preserveState: true
            });
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        return `${date.toLocaleDateString('es-ES', options)} - ${date.toLocaleTimeString('es-ES', timeOptions)}`;
    };

    const porEntregar = useMemo(() => entregas.data.filter(e => e.user_id !== null && e.estado !== 'entregado' && e.estado !== 'bloqueado'), [entregas.data]);
    const porAsignar = useMemo(() => entregas.data.filter(e => e.user_id === null), [entregas.data]);
    const entregados = useMemo(() => entregas.data.filter(e => e.estado === 'entregado'), [entregas.data]);
    const alertas = useMemo(() => entregas.data.filter(e => e.estado === 'bloqueado'), [entregas.data]);

    const leftColumnList = activeTab === 'por_entregar' ? porEntregar : (activeTab === 'por_asignar' ? porAsignar : alertas);

    const getCanalBadge = (canal: string | null) => {
        if (!canal) return null;
        const lower = canal.toLowerCase();
        let bg = 'bg-slate-100 text-slate-600';
        if (lower.includes('meli cms') || lower.includes('meli wc')) bg = 'bg-yellow-100 text-yellow-700';
        else if (lower.includes('bancolombia')) bg = 'bg-slate-800 text-white';
        else if (lower.includes('web')) bg = 'bg-pink-100 text-[#e91e63]';
        else if (lower.includes('falabella')) bg = 'bg-green-100 text-green-700';

        return (
            <span className={`text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full inline-block tracking-wide border border-black/5 ${bg}`}>
                {canal}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Entregas" />

            <div className="bg-[#fff0f5] min-h-screen -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 p-6 sm:p-8 font-['Montserrat',sans-serif]">
                
                {flash.status && (
                    <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 font-semibold text-center shadow-sm">
                        {flash.status}
                    </div>
                )}

                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-50 mb-6 sm:mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-pink-50 text-[#e91e63] flex items-center justify-center shrink-0 border border-pink-100">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-[#e91e63] tracking-tight">{authUser?.name || 'Administrador'}</h1>
                            <p className="text-slate-500 font-medium text-sm sm:text-base">Gestión de evidencias en tiempo real</p>
                        </div>
                        
                        <div className="ml-auto hidden sm:block">
                            <button 
                                onClick={handleSyncSheets}
                                disabled={isSyncing}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm ${isSyncing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                            >
                                <svg className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {isSyncing ? 'Sincronizando...' : 'Sincronizar Sheets'}
                            </button>
                        </div>
                    </div>
                    
                    <hr className="border-pink-50 my-6" />

                    <form onSubmit={handleFilterSubmit} className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-1 w-full relative">
                            <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">Buscar por Guía (opcional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="¿Que guía quieres buscar?" 
                                    value={filterState.search}
                                    onChange={e => setFilterState({...filterState, search: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1 w-full relative">
                            <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">Fecha específica (opcional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <input 
                                    type="date" 
                                    value={filterState.fecha}
                                    onChange={e => setFilterState({...filterState, fecha: e.target.value})}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] transition-colors appearance-none"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-40 relative shrink-0">
                            <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">Canal (opcional)</label>
                            <div className="relative">
                                <select 
                                    value={filterState.canal_compra}
                                    onChange={e => setFilterState({...filterState, canal_compra: e.target.value})}
                                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] transition-colors text-slate-500 appearance-none bg-none"
                                >
                                    <option value="">Todos</option>
                                    <option value="Meli">MercadoLibre</option>
                                    <option value="Web">Página Web</option>
                                    <option value="Falabella">Falabella</option>
                                    <option value="Bancolombia">Tu360</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-40 relative shrink-0">
                            <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">Estado (opcional)</label>
                            <div className="relative">
                                <select 
                                    value={filterState.estado}
                                    onChange={e => setFilterState({...filterState, estado: e.target.value})}
                                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] transition-colors text-slate-500 appearance-none bg-none"
                                >
                                    <option value="">Estado</option>
                                    <option value="entregado">Entregados</option>
                                    <option value="pendiente">Pendientes</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0 lg:ml-2">
                            <button type="submit" className="bg-[#e91e63] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 w-full lg:w-auto shadow-md h-[46px]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                Aplicar Filtro
                            </button>
                            {hasActiveFilters && (
                                <button type="button" onClick={clearFilters} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm h-[46px] w-full lg:w-auto border border-slate-200">
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {isSingleFilteredResult ? (
                    <div className="flex justify-center mt-6">
                        <DeliveryDetailCard entrega={entregas.data[0]} />
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-16rem)] min-h-[600px]">
                        
                        {/* Left Column: Pendientes */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 flex flex-col h-[600px] flex-1">
                            {/* Tabs */}
                            <div className="flex gap-6 border-b border-slate-100 mb-6">
                                <button 
                                    onClick={() => setActiveTab('por_entregar')}
                                    className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'por_entregar' ? 'text-[#e91e63]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Por entregar ({porEntregar.length})
                                    {activeTab === 'por_entregar' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e91e63] rounded-t-full"></div>}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('por_asignar')}
                                    className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'por_asignar' ? 'text-[#e91e63]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Por asignar ({porAsignar.length})
                                    {activeTab === 'por_asignar' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e91e63] rounded-t-full"></div>}
                                </button>
                                <button 
                                    onClick={() => setActiveTab('alertas')}
                                    className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'alertas' ? 'text-[#e91e63]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Alertas ({alertas.length})
                                    {activeTab === 'alertas' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e91e63] rounded-t-full"></div>}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                {leftColumnList.length === 0 ? (
                                    <div className="text-center text-slate-400 font-medium py-10">No hay entregas en esta categoría.</div>
                                ) : (
                                    leftColumnList.map(entrega => (
                                        <div 
                                            key={entrega.id} 
                                            onClick={() => router.get(route('admin.entregas.show', entrega.id))}
                                            className="border border-slate-200 shadow-md hover:shadow-lg rounded-2xl p-4 flex items-center justify-between transition-all bg-white relative overflow-hidden group cursor-pointer active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${activeTab === 'alertas' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-orange-50 border-orange-100 text-orange-500'}`}>
                                                    {activeTab === 'alertas' ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full inline-block ${activeTab === 'alertas' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                                                            {activeTab === 'por_entregar' ? 'Por Entregar' : (activeTab === 'alertas' ? 'Alerta' : 'Por Asignar')}
                                                        </span>
                                                        {getCanalBadge(entrega.canal_compra)}
                                                    </div>
                                                    <h3 className="text-sm font-bold text-slate-800 leading-tight">ID Entrega # {entrega.tracking_id}</h3>
                                                    <p className="text-xs text-slate-500 font-medium mt-0.5 mb-1">{entrega.cliente || 'Sin nombre cliente'}</p>
                                                    {entrega.palabra_clave && (
                                                        <span className="text-[9px] uppercase font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full inline-block">
                                                            Clave: {entrega.palabra_clave}
                                                        </span>
                                                    )}
                                                    {entrega.motivo_bloqueo && (
                                                        <span className="text-[9px] uppercase font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full inline-block mt-1 ml-1">
                                                            Motivo: {entrega.motivo_bloqueo}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                                <div className="text-right flex flex-col items-end justify-center min-w-[120px]">
                                                    {entrega.condicion_actual === 'retraso' && (
                                                        <span className="text-[10px] font-bold text-red-500 mb-2">Se entregará con retraso</span>
                                                    )}
                                                    {entrega.condicion_actual === 'a_tiempo' && (
                                                        <span className="text-[10px] font-bold text-green-500 mb-2">Se entregará a tiempo</span>
                                                    )}
                                                    {entrega.user_id ? (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-[10px] font-semibold text-[#e91e63] mb-1">Asignado a:<br/><span className="text-xs text-slate-800">{entrega.user?.name || 'Desconocido'}</span></span>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleUnassign(entrega.id); }}
                                                                className="bg-[#ff0b0b] text-white px-4 py-1.5 rounded-xl hover:bg-red-600 transition-colors mt-1 shadow-sm"
                                                                title="Desasignar"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm12-3l-4 4m0-4l4 4" /></svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-xs font-semibold text-slate-400 mb-1">Sin asignar</span>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setSelectedEntregaForAssign(entrega); setIsAssignModalOpen(true); }}
                                                                className="bg-[#e91e63] text-white hover:bg-opacity-90 px-4 py-1.5 rounded-xl transition-colors shadow-sm mt-1"
                                                                title="Asignar Repartidor"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Column: Entregados */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 flex flex-col h-[600px] flex-1">
                            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
                                <h2 className="text-sm font-semibold text-[#e91e63]">Entregados Recientemente</h2>
                                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">{entregados.length}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                {entregados.length === 0 ? (
                                    <div className="text-center text-slate-400 font-medium py-10">No hay entregas completadas.</div>
                                ) : (
                                    entregados.map(entrega => (
                                        <div 
                                            key={entrega.id} 
                                            onClick={() => router.get(route('admin.entregas.show', entrega.id))}
                                            className="border border-slate-200 shadow-md hover:shadow-lg rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all bg-white relative overflow-hidden group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center text-[#22c55e] shrink-0">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <span className="text-[9px] uppercase font-bold text-[#22c55e] bg-[#f0fdf4] px-2.5 py-0.5 rounded-full inline-block">Entregada</span>
                                                        {getCanalBadge(entrega.canal_compra)}
                                                    </div>
                                                    <h3 className="text-sm font-bold text-[#1e293b] leading-tight m-0">ID # {entrega.tracking_id}</h3>
                                                    <p className="text-xs text-[#64748b] font-medium mt-0.5 m-0">{entrega.cliente || 'Sin nombre'}</p>
                                                </div>
                                            </div>

                                            <div className="text-left flex flex-col justify-center pr-8 relative min-w-[140px]">
                                                <span className="text-sm font-bold text-[#1e293b] mb-0.5">Entregado:</span>
                                                <span className="text-xs text-slate-500 font-medium mb-1">
                                                    {formatDate(entrega.updated_at)}
                                                </span>
                                                {entrega.condicion_tiempo === 'retraso' && (
                                                    <span className="text-xs font-semibold text-red-500">Entregado con retraso</span>
                                                )}
                                                {entrega.condicion_tiempo === 'a_tiempo' && (
                                                    <span className="text-xs font-semibold text-green-500">Entregado a tiempo</span>
                                                )}
                                                
                                                {/* Arrow icon */}
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#e91e63] group-hover:translate-x-1 transition-transform">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <GalleryModal 
                images={galleryImages}
                startIndex={galleryIndex}
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onNext={() => setGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                onPrev={() => setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
            />

            {/* Assign Modal */}
            {isAssignModalOpen && selectedEntregaForAssign && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Asignar Repartidor</h3>
                                <p className="text-xs text-slate-500 font-medium">Selecciona quién entregará el ID #{selectedEntregaForAssign.tracking_id}</p>
                            </div>
                            <button onClick={() => { setIsAssignModalOpen(false); setSelectedEntregaForAssign(null); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAssign} className="p-6">
                            <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">Seleccionar Repartidor</label>
                            <div className="relative mb-6">
                                <select 
                                    required
                                    value={selectedRepartidorId}
                                    onChange={e => setSelectedRepartidorId(Number(e.target.value))}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#e91e63] focus:ring-1 focus:ring-[#e91e63] transition-colors appearance-none bg-none font-medium text-slate-700"
                                >
                                    <option value="" disabled>-- Selecciona un repartidor --</option>
                                    {repartidores.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none mt-1 text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => { setIsAssignModalOpen(false); setSelectedEntregaForAssign(null); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={!selectedRepartidorId} className="flex-1 py-3 bg-[#e91e63] text-white rounded-xl font-semibold text-sm shadow-md hover:bg-opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Confirmar Asignación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}