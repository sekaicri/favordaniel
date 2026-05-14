import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import GalleryModal from '@/Components/GalleryModal';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Entrega {
    id: number;
    tracking_id: string;
    descripcion: string;
    url_evidencia: string[] | string | null;
    created_at: string;
    user: User;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    total: number;
}

interface AdminIndexProps {
    entregas: PaginatedData<Entrega>;
    repartidores: User[];
    filters: {
        user_id?: string;
        fecha?: string;
    };
}

export default function AdminIndex({ auth, entregas, repartidores, filters = {} }: any) {
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const [filterState, setFilterState] = useState({
        user_id: filters.user_id || '',
        fecha: filters.fecha || ''
    });

    const openGallery = (images: string[], index: number) => {
        setGalleryImages(images);
        setGalleryIndex(index);
        setIsGalleryOpen(true);
    };

    const parseUrls = (urls: any): string[] => {
        if (!urls) return [];
        if (Array.isArray(urls)) return urls;
        try {
            return JSON.parse(urls);
        } catch {
            return [];
        }
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.evidencias'), filterState as any, { preserveState: true });
    };

    const clearFilters = () => {
        setFilterState({ user_id: '', fecha: '' });
        router.get(route('admin.evidencias'), {}, { preserveState: true });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Administración</h2>}
        >
            <Head title="Admin - Entregas" />

            <div className="bg-[#fdf2f8] min-h-screen py-8 font-sans">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col gap-6">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#880e4f] m-0">Registro de <span className="text-[#e91e63]">Entregas</span></h1>
                                <p className="text-slate-500 mt-2 text-base">Gestión centralizada y auditoría de evidencias.</p>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-xl flex gap-8 border border-slate-100">
                                <div className="text-center">
                                    <p className="m-0 text-xs font-bold text-slate-500 uppercase tracking-wide">Total Registros</p>
                                    <p className="m-0 text-2xl font-extrabold text-[#e91e63]">{entregas.total}</p>
                                </div>
                                <div className="w-[1px] bg-slate-300"></div>
                                <div className="text-center">
                                    <p className="m-0 text-xs font-bold text-slate-500 uppercase tracking-wide">Repartidores</p>
                                    <p className="m-0 text-2xl font-extrabold text-[#880e4f]">{repartidores.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="pt-6 border-t border-slate-100">
                            <form onSubmit={handleFilterSubmit} className="flex gap-4 items-end flex-wrap">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Filtrar por Repartidor</label>
                                    <select 
                                        value={filterState.user_id}
                                        onChange={e => setFilterState({...filterState, user_id: e.target.value})}
                                        className="p-2.5 border border-slate-300 rounded-lg bg-white min-w-[220px] text-sm focus:border-[#e91e63] focus:ring-[#e91e63] outline-none transition-colors"
                                    >
                                        <option value="">Todos los usuarios</option>
                                        {repartidores.map((r: User) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Fecha Específica</label>
                                    <input 
                                        type="date" 
                                        value={filterState.fecha}
                                        onChange={e => setFilterState({...filterState, fecha: e.target.value})}
                                        className="p-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:border-[#e91e63] focus:ring-[#e91e63] outline-none transition-colors"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" className="bg-[#880e4f] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#6c0b3f] transition-colors">
                                        APLICAR FILTROS
                                    </button>
                                    {(filterState.user_id || filterState.fecha) && (
                                        <button type="button" onClick={clearFilters} className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-lg font-semibold border border-slate-300 text-sm hover:bg-slate-200 transition-colors">
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1000px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-[#fdf2f8] border-b-2 border-slate-200">
                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Repartidor</th>
                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking ID</th>
                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Evidencia</th>
                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha y Hora</th>
                                        <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {entregas.data.length > 0 ? entregas.data.map((entrega: Entrega) => {
                                        const urls = parseUrls(entrega.url_evidencia);
                                        return (
                                            <tr key={entrega.id} className="hover:bg-[#fdf2f8] transition-colors duration-150">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-[#fce4ec] text-[#d81b60] rounded-full flex items-center justify-center font-extrabold text-sm">
                                                            {entrega.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="m-0 font-bold text-[#880e4f] text-sm">{entrega.user.name}</p>
                                                            <p className="m-0 text-xs text-slate-500">{entrega.user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono font-bold text-sm border border-slate-200">
                                                        {entrega.tracking_id}
                                                    </span>
                                                </td>
                                                <td className="p-5 max-w-[300px]">
                                                    <p className="m-0 text-sm text-slate-700 leading-snug">{entrega.descripcion || 'N/A'}</p>
                                                </td>
                                                <td className="p-5">
                                                    {urls.length > 0 ? (
                                                        <div className="flex gap-2 flex-wrap">
                                                            {urls.map((url, idx) => (
                                                                <div 
                                                                    key={idx}
                                                                    onClick={() => openGallery(urls, idx)}
                                                                    className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-[0_0_0_1px_#e2e8f0] cursor-pointer hover:scale-110 transition-transform"
                                                                >
                                                                    <img src={url} className="w-full h-full object-cover" alt="Evidencia" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-xs">Sin foto</span>
                                                    )}
                                                </td>
                                                <td className="p-5">
                                                    <p className="m-0 text-sm font-bold text-[#880e4f]">{formatDate(entrega.created_at)}</p>
                                                    <p className="m-0 text-xs text-slate-500">{formatTime(entrega.created_at)}</p>
                                                </td>
                                                <td className="p-5">
                                                    {urls.length > 0 && (
                                                        <button 
                                                            onClick={() => openGallery(urls, 0)}
                                                            className="bg-slate-100 text-[#880e4f] px-3 py-1.5 rounded-md text-xs font-bold border border-slate-300 hover:bg-slate-200 transition-colors w-full text-center"
                                                        >
                                                            VER TODAS
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={6} className="p-20 text-center text-slate-400 italic font-medium">
                                                No hay registros que coincidan con la búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Footer */}
                        {entregas.links && entregas.links.length > 3 && (
                            <div className="bg-[#fdf2f8] p-4 border-t border-slate-200 flex justify-center gap-1">
                                {entregas.links.map((link: any, idx: number) => (
                                    <button 
                                        key={idx}
                                        onClick={() => link.url ? router.get(link.url, filterState as any, { preserveState: true }) : null}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        disabled={!link.url}
                                        className={`px-3 py-1.5 rounded-md text-sm border ${
                                            link.active 
                                                ? 'bg-[#880e4f] text-white border-[#880e4f] font-bold' 
                                                : link.url 
                                                    ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50' 
                                                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <GalleryModal 
                images={galleryImages}
                startIndex={galleryIndex}
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onNext={() => setGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                onPrev={() => setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
            />
        </AuthenticatedLayout>
    );
}
