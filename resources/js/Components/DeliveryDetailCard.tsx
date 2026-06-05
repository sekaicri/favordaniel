import React from 'react';

export default function DeliveryDetailCard({ entrega }: { entrega: any }) {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
    };

    const parseEvidencias = (urlStr: any): string[] => {
        if (!urlStr) return [];
        if (Array.isArray(urlStr)) return urlStr;
        try { return JSON.parse(urlStr); } catch { return [urlStr]; }
    };

    const evidencias = parseEvidencias(entrega.url_evidencia);
    const hasFirma = entrega.firma_entrega != null;

    return (
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 print:p-4 shadow-lg border border-pink-50 relative overflow-hidden print:overflow-visible print:shadow-none print:border-slate-200 w-full">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-pink-400 to-[#e91e63] print:hidden"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 print:mb-4 print:gap-2 border-b border-slate-100 pb-8 print:pb-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#e91e63] mb-1 block">Reporte de Auditoría</span>
                    <h1 className="text-3xl font-bold text-slate-800 leading-tight">
                        Entrega <span className="text-[#e91e63]">#{entrega.tracking_id}</span>
                    </h1>
                </div>
                <div className="text-left sm:text-right">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">Estado Actual</span>
                    {entrega.estado === 'entregado' ? (
                        <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] px-4 py-2 rounded-full">
                            <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            <span className="font-bold text-[#166534] uppercase text-sm tracking-wide">ENTREGADA</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-full">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-bold text-yellow-700 uppercase text-sm tracking-wide">{entrega.estado || 'Pendiente'}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 print:gap-4 mb-10 print:mb-4">
                <div className="space-y-6 print:space-y-3 bg-slate-50 p-6 print:p-3 rounded-3xl print:rounded-xl border border-slate-100">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Cliente / Destinatario
                        </h3>
                        <p className="text-base font-semibold text-slate-800">{entrega.cliente || 'No especificado'}</p>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Descripción / Detalles
                        </h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">{entrega.descripcion || 'Sin descripción'}</p>
                    </div>
                </div>
                <div className="space-y-6 print:space-y-3">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Fecha de Asignación</h3>
                            <p className="text-sm font-semibold text-slate-700">{formatDate(entrega.created_at)}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Fecha de Completado</h3>
                            <p className="text-sm font-semibold text-slate-700">{entrega.estado === 'entregado' ? formatDate(entrega.updated_at) : 'Pendiente'}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">Canal de Compra</h3>
                            <p className="text-sm font-semibold text-slate-700 uppercase">{entrega.canal_compra || 'No especificado'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-pink-50 p-6 print:p-3 rounded-3xl print:rounded-xl mb-10 print:mb-4 border border-pink-100 print-avoid-break">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#e91e63] mb-4 print:mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Información Operativa
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 print:gap-4 bg-white p-5 print:p-3 rounded-2xl print:rounded-xl border border-pink-50">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Repartidor Responsable</span>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#fce7f3] text-[#e91e63] flex items-center justify-center font-semibold text-xs border border-pink-100">
                                {entrega.user?.name ? entrega.user.name.substring(0, 2).toUpperCase() : 'ND'}
                            </div>
                            <span className="font-semibold text-slate-800">{entrega.user?.name || 'No asignado'}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Palabra Clave Registrada</span>
                        {entrega.palabra_clave ? (
                            <span className="inline-block bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-lg text-sm border border-purple-200">
                                {entrega.palabra_clave}
                            </span>
                        ) : (
                            <span className="text-sm font-medium text-slate-400">Sin palabra clave</span>
                        )}
                    </div>
                </div>

                <div className="mt-6 print:hidden bg-white p-5 rounded-2xl border border-pink-50 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tarifa Calculada (Ganancia)</span>
                        <span className="text-xl font-bold text-[#e91e63] bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100 inline-block">
                            {formatMoney(entrega.ganancia || 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Condición de Tiempo</span>
                        {(entrega.condicion_tiempo || entrega.condicion_actual) === 'a_tiempo' && (
                            <span className="text-xs uppercase font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-xl border border-green-200 inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                A Tiempo
                            </span>
                        )}
                        {(entrega.condicion_tiempo || entrega.condicion_actual) === 'retraso' && (
                            <span className="text-xs uppercase font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-200 inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Con Retraso
                            </span>
                        )}
                        {!(entrega.condicion_tiempo || entrega.condicion_actual) && (
                            <span className="text-xs uppercase font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl inline-block">
                                Sin calcular
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {entrega.estado === 'entregado' && (
                <div className="print-avoid-break mb-10 print:mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 print:mb-2 flex items-center gap-2 border-b border-slate-100 pb-3 print:pb-2">
                        <svg className="w-4 h-4 text-[#e91e63]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Evidencias Fotográficas
                    </h2>
                    {evidencias.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 print:grid-cols-4 gap-4 print:gap-2">
                            {evidencias.map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noreferrer" className="block group aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 relative bg-slate-50">
                                    <img src={url} alt={`Evidencia ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-slate-400 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">No se adjuntaron fotos de evidencia.</p>
                    )}
                </div>
            )}

            {entrega.estado === 'entregado' && hasFirma && (
                <div className="print-avoid-break">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 print:mb-2 flex items-center gap-2 border-b border-slate-100 pb-3 print:pb-2">
                        <svg className="w-4 h-4 text-[#e91e63]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Firma de Recepción
                    </h2>
                    <div className="border-2 border-slate-100 rounded-3xl print:rounded-xl p-6 print:p-2 bg-white inline-block shadow-sm print:block print:w-full">
                        <img src={entrega.firma_entrega!} alt="Firma del cliente" className="h-32 sm:h-40 print:h-28 max-w-full object-contain mx-auto print:max-w-full" />
                    </div>
                </div>
            )}
        </div>
    );
}
