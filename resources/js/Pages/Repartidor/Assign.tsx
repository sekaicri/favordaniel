import React, { FormEvent, useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';

export default function Assign({ auth, flash, entregas = [] }: any) {
    const { data, setData, post, processing, errors, reset } = useForm({
        tracking_id: '',
    });

    const [activeTab, setActiveTab] = useState<'por_entregar' | 'entregados'>('por_entregar');

    // Auto-refresh (Polling) cada 5 segundos para actualización en tiempo real de las entregas
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['entregas'], preserveState: true, preserveScroll: true });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('repartidor.assign.post'), {
            onSuccess: () => {
                reset('tracking_id');
            }
        });
    };

    // Filtramos las entregas según la pestaña activa
    const entregasFiltradas = entregas.filter((entrega: any) => {
        if (activeTab === 'por_entregar') {
            return entrega.estado !== 'entregado';
        } else {
            return entrega.estado === 'entregado';
        }
    });

    return (
        <AppLayout>
            <Head title="Asignar Entregas" />

            <div className="max-w-md mx-auto pt-6 pb-12 px-5">
                
                {/* Header visual */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0 border border-pink-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-[#c2185b] text-2xl font-black tracking-tight leading-none">Panel de Entregas</h1>
                        <p className="text-slate-500 text-xs font-medium mt-1">Gestión de evidencias en tiempo real</p>
                    </div>
                </div>

                {/* Subheader */}
                <div className="mb-6">
                    <h2 className="text-[#c2185b] text-lg font-black tracking-tight">Resumen del Repartidor</h2>
                    <p className="text-slate-500 text-xs font-medium mt-0.5">Seguimiento de entregas asignadas</p>
                </div>

                {/* Mensajes Flash */}
                {flash?.status && (
                    <div className="bg-[#f0fdf4] text-[#166534] p-4 rounded-2xl mb-6 border border-green-200 font-bold text-sm text-center shadow-sm flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        {flash.status}
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 border border-red-200 font-bold text-sm text-center shadow-sm">
                        {flash.error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-6 border-b border-slate-200 mb-6 px-1">
                    <button 
                        onClick={() => setActiveTab('por_entregar')}
                        className={`pb-2 text-sm font-black transition-colors relative ${activeTab === 'por_entregar' ? 'text-[#c2185b]' : 'text-slate-400 hover:text-[#c2185b]'}`}
                    >
                        Por entregar
                        {activeTab === 'por_entregar' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#c2185b] rounded-t-full"></div>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('entregados')}
                        className={`pb-2 text-sm font-black transition-colors relative ${activeTab === 'entregados' ? 'text-[#c2185b]' : 'text-slate-400 hover:text-[#c2185b]'}`}
                    >
                        Entregados
                        {activeTab === 'entregados' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#c2185b] rounded-t-full"></div>
                        )}
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Formulario de Asignación (Solo se muestra en la pestaña "Por entregar") */}
                    {activeTab === 'por_entregar' && (
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-2">
                            <form onSubmit={submit}>
                                <label className="block text-slate-500 font-medium text-sm mb-3">
                                    Número de Guía:
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={data.tracking_id}
                                        onChange={e => setData('tracking_id', e.target.value)}
                                        required 
                                        placeholder="Ej: 34534545986745" 
                                        className="w-full py-3.5 pl-4 pr-12 border-2 border-slate-200 rounded-full text-base font-medium outline-none transition-all focus:border-[#e91e63] focus:ring-4 focus:ring-pink-50 placeholder:text-slate-300"
                                    />
                                    {/* Botón enviar pequeño embebido en el input para que parezca de escaneo/envío rápido */}
                                    <button 
                                        type="submit"
                                        disabled={processing || !data.tracking_id}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-pink-50 text-[#e91e63] flex items-center justify-center hover:bg-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                        )}
                                    </button>
                                </div>
                                {errors.tracking_id && <div className="text-red-500 text-xs font-bold mt-2 ml-4">{errors.tracking_id}</div>}
                            </form>
                        </div>
                    )}

                    {/* Lista de Entregas */}
                    {entregasFiltradas.length > 0 ? (
                        entregasFiltradas.map((entrega: any) => (
                            <div 
                                key={entrega.id} 
                                onClick={() => {
                                    if (entrega.estado !== 'entregado') {
                                        router.get(route('repartidor.delivery.detail', entrega.id));
                                    } else {
                                        router.get(route('repartidor.delivery.completed', entrega.id));
                                    }
                                }}
                                className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between transition-all cursor-pointer hover:shadow-md active:scale-[0.98]`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icono de estado */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0 ${entrega.estado === 'entregado' ? 'border-green-100 bg-green-50 text-green-500' : 'border-orange-100 bg-orange-50 text-orange-500'}`}>
                                        {entrega.estado === 'entregado' ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        )}
                                    </div>
                                    
                                    {/* Info de la entrega */}
                                    <div>
                                        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1 ${entrega.estado === 'entregado' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {entrega.estado === 'entregado' ? 'Entregado' : 'Por Entregar'}
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800 m-0">Guía # {entrega.tracking_id}</h3>
                                        <p className="text-xs text-slate-500 font-medium my-0.5">{entrega.cliente || 'Sin nombre de cliente'}</p>
                                        
                                        {/* Puedes agregar lógica para mostrar el texto en rojo si hay retraso */}
                                        {entrega.estado !== 'entregado' && (
                                            <p className="text-[10px] text-red-500 font-medium m-0">Revisar tiempos de entrega</p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="text-[#c2185b]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 px-6 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 mt-2">
                            <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            <p className="text-slate-400 font-bold text-sm">No tienes entregas en esta lista.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
