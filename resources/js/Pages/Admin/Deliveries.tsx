import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, Link, usePage } from '@inertiajs/react';
import GalleryModal from '@/Components/GalleryModal';

interface User {
    id: number;
    name: string;
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

interface AdminDeliveriesProps {
    entregas: PaginatedData<Entrega>;
    filters: {
        search?: string;
        fecha?: string;
    };
}

export default function AdminDeliveries({ entregas, filters = {} }: AdminDeliveriesProps) {
    const { props } = usePage<any>();
    const flash = props.flash || {};

    const [filterState, setFilterState] = useState({
        search: filters.search || '',
        fecha: filters.fecha || ''
    });

    // Gallery State
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.entregas'), filterState as any, { preserveState: true });
    };

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleDateString('es-ES', options).replace(',', ' •');
    };

    return (
        <AdminLayout>
            <Head title="Historial de Entregas" />

            {flash.status && (
                <div className="bg-[#f8bbd0] text-[#880e4f] p-4 rounded-xl mb-6 border border-[#f48fb1] font-semibold text-center shadow-sm">
                    {flash.status}
                </div>
            )}

            <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-slate-100 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#9c104a] m-0 mb-1 tracking-tight">Historial de Entregas</h1>
                            <p className="text-slate-500 text-xs sm:text-base font-medium">Control total de evidencias y repartidores</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <form onSubmit={handleFilterSubmit} className="flex flex-col lg:flex-row gap-4 lg:items-end">
                    <div className="flex-1">
                        <label className="text-xs font-bold text-slate-500 mb-2 block ml-1">Buscar entrega</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Guía o nombre del repartidor" 
                                value={filterState.search}
                                onChange={e => setFilterState({...filterState, search: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-colors shadow-sm lg:shadow-none"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 sm:w-48">
                            <label className="text-xs font-bold text-slate-500 mb-2 block ml-1">Fecha</label>
                            <input 
                                type="date" 
                                value={filterState.fecha}
                                onChange={e => setFilterState({...filterState, fecha: e.target.value})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 appearance-none text-slate-600 shadow-sm lg:shadow-none"
                            />
                        </div>

                        <button type="submit" className="bg-[#e91e63] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#d81b60] transition-colors flex items-center justify-center gap-2 h-[46px] shadow-sm mt-2 sm:mt-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            Filtrar
                        </button>
                    </div>
                </form>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 font-sans tracking-wide uppercase">Repartidor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 font-sans tracking-wide uppercase">ID Guía</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 font-sans tracking-wide uppercase">Descripción</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide uppercase">Evidencia</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide uppercase">Fecha y Hora</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-700 text-center font-sans tracking-wide uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {entregas.data.map((entrega) => {
                                const urls = parseUrls(entrega.url_evidencia);
                                return (
                                    <tr key={entrega.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                                                    {entrega.user.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-sm text-slate-700 font-bold">{entrega.user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-[#880e4f]">{entrega.tracking_id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 max-w-xs truncate m-0">{entrega.descripcion || 'Sin descripción'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <div 
                                                    onClick={() => urls.length > 0 && openGallery(urls, 0)}
                                                    className={`relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 ${urls.length > 0 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                                                >
                                                    {urls.length > 0 ? (
                                                        <>
                                                            <img src={urls[0]} className="w-full h-full object-cover" alt="Evidencia" />
                                                            {urls.length > 1 && (
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">
                                                                    +{urls.length - 1}
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-xs text-slate-500 font-medium">
                                            {formatDate(entrega.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border border-green-100">
                                                    Completado
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mb-8">
                {entregas.data.map((entrega) => {
                    const urls = parseUrls(entrega.url_evidencia);
                    return (
                        <div key={entrega.id} className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                                        {entrega.user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-700 font-black uppercase tracking-tighter">{entrega.user.name}</span>
                                        <span className="text-[10px] text-blue-500 font-bold">{formatDate(entrega.created_at)}</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 text-green-600 p-2 rounded-xl border border-green-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                                <div 
                                    onClick={() => urls.length > 0 && openGallery(urls, 0)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-50 flex items-center justify-center bg-slate-50 text-slate-300 shrink-0 ${urls.length > 0 ? 'cursor-pointer' : ''}`}
                                >
                                    {urls.length > 0 ? (
                                        <>
                                            <img src={urls[0]} className="w-full h-full object-cover" alt="Evidencia" />
                                            {urls.length > 1 && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-black">
                                                    +{urls.length - 1}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Guía</p>
                                    <p className="text-base font-black text-[#880e4f] m-0 mb-2 truncate">{entrega.tracking_id}</p>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                        {entrega.descripcion || 'Sin observaciones registradas.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Pagination */}
            <div className="bg-white rounded-2xl md:rounded-b-2xl md:rounded-t-none px-4 sm:px-6 py-4 border border-slate-100 md:border-t-0 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-0">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                    Mostrando {entregas.data.length} de {entregas.total}
                </span>
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
                    {entregas.links.map((link: any, idx: number) => {
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
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-bold shrink-0 ${link.active ? 'bg-[#e91e63] text-white shadow-md' : 'text-pink-400 hover:bg-pink-50'}`}
                            >
                                {link.label}
                            </button>
                        );
                    })}
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
            
            <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium pb-8 px-2 gap-2 mt-4 sm:mt-0 text-center sm:text-left">
                <span>© 2026 Celumovil Store. Todos los derechos reservados</span>
                <span>Versión 1.0.0</span>
            </div>
        </AdminLayout>
    );
}
