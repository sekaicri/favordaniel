import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

export default function CompletedDetail({ auth, entrega }: any) {
    const parseUrls = (urls: any): string[] => {
        if (!urls) return [];
        if (Array.isArray(urls)) return urls;
        try {
            return JSON.parse(urls);
        } catch {
            return [];
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'No registrado';
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        return `${date.toLocaleDateString('es-ES', options)} - ${date.toLocaleTimeString('es-ES', timeOptions)}`;
    };

    const formatMoney = (amount: number | string | null) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(amount));
    };

    const photos = parseUrls(entrega.url_evidencia);

    return (
        <AppLayout>
            <Head title={`Reporte #${entrega.tracking_id}`} />

            <div className="max-w-md mx-auto pt-6 pb-24 px-5 font-['Montserrat',sans-serif]">
                
                {/* Botonera superior */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.get(route('repartidor.assign'))}
                        className="flex items-center gap-2 text-slate-500 hover:text-[#e91e63] font-bold text-sm transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver
                    </button>
                </div>

                {/* Tarjeta de Ganancia (Destacada) */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-10 translate-x-10 blur-xl"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Ganancia por esta entrega</span>
                        <h2 className="text-[#38bdf8] text-4xl font-black tracking-tight mb-2">
                            {formatMoney(entrega.ganancia)}
                        </h2>
                        
                        {entrega.condicion_tiempo === 'a_tiempo' && (
                            <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mt-1 mb-2">
                                ✓ A Tiempo
                            </div>
                        )}
                        {entrega.condicion_tiempo === 'retraso' && (
                            <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mt-1 mb-2">
                                ⚠ Con Retraso
                            </div>
                        )}
                        {entrega.condicion_tiempo === 'fuera_rango' && (
                            <div className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mt-1 mb-2">
                                ✕ Fuera de horario
                            </div>
                        )}

                        <div className="inline-block bg-[#0f172a] border border-[#334155] px-3 py-1 rounded-full text-[10px] font-bold text-slate-300 uppercase mt-1">
                            Finalizada a las {new Date(entrega.delivered_at).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>

                {/* Contenedor Principal del Reporte */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0 border border-green-100">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-[#1e293b] text-xl font-black tracking-tight leading-none mb-1">Guía #{entrega.tracking_id}</h1>
                                <p className="text-slate-500 font-bold text-xs uppercase">Entregada Exitosamente</p>
                            </div>
                        </div>
                    </div>

                    {/* Datos Generales */}
                    <div className="space-y-4 mb-8">
                        <div>
                            <p className="text-xs font-bold text-slate-500">Cliente / Destinatario:</p>
                            <p className="text-sm font-bold text-slate-800">{entrega.cliente || 'No registrado'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Dirección:</p>
                            <p className="text-sm font-bold text-slate-800">{entrega.direccion || 'No registrado'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Documento que recibió:</p>
                            <p className="text-sm font-bold text-slate-800">{entrega.documento || 'No registrado'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Palabra Clave Validada:</p>
                            <p className="text-sm font-black text-[#a855f7]">{entrega.palabra_clave || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Descripción / Notas */}
                    {entrega.descripcion && (
                        <div className="mb-8 border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded-r-xl">
                            <h3 className="text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-1">Tus Notas</h3>
                            <p className="text-sm font-medium text-yellow-900">{entrega.descripcion}</p>
                        </div>
                    )}

                    {/* Evidencias Visuales (Firma y Fotos) */}
                    <h3 className="text-sm font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Tus Evidencias</h3>
                    
                    <div className="flex flex-col gap-6">
                        {/* Firma */}
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 w-full text-center">Firma Digital</h4>
                            {entrega.firma_entrega ? (
                                <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-3 w-full flex items-center justify-center">
                                    <img src={entrega.firma_entrega} alt="Firma del cliente" className="max-h-24 object-contain" />
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 font-medium italic py-4">Firma no registrada</p>
                            )}
                        </div>

                        {/* Fotos */}
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Registro Fotográfico</h4>
                            {photos.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {photos.map((url, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                            <img src={url} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
                                    <p className="text-xs text-slate-400 font-medium italic">No adjuntaste fotografías</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
