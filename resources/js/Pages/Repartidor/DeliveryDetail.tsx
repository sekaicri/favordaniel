import React, { FormEvent, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function DeliveryDetail({ auth, entrega, errors: serverErrors, flash }: any) {
    const { data, setData, post, processing, errors: formErrors } = useForm({
        palabra_clave: '',
        documento: '',
    });

    const [intentosRestantes, setIntentosRestantes] = useState(3);
    const [localError, setLocalError] = useState('');

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        if (intentosRestantes <= 0) return;

        post(route('repartidor.delivery.attempt', entrega.id), {
            onError: (errs) => {
                if (errs.palabra_clave) {
                    setIntentosRestantes(prev => prev - 1);
                    setLocalError(`Palabra incorrecta. Te quedan ${intentosRestantes - 1} intentos.`);
                }
            }
        });
    };

    const handleBack = () => {
        router.get(route('repartidor.assign'));
    };

    return (
        <AppLayout>
            <Head title={`Detalle Guía #${entrega.tracking_id}`} />

            <div className="max-w-md mx-auto pt-6 pb-12 px-5 font-['Montserrat',sans-serif]">
                
                {/* Botón Volver */}
                <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-[#c2185b] font-bold text-xs mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    Volver al listado
                </button>

                {/* Header visual */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0 border border-pink-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-[#c2185b] text-2xl font-black tracking-tight leading-none mb-1">Entrega Actual</h1>
                        <h2 className="text-slate-800 text-base font-bold">Guía #{entrega.tracking_id}</h2>
                        <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mt-0.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Bogotá, Colombia
                        </div>
                    </div>
                </div>

                {/* Tarjeta 1: Dirección */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-4 flex items-center gap-4">
                    <div className="flex-shrink-0 text-[#e91e63] flex items-center justify-center">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-[#e91e63] font-bold text-sm mb-1">Dirección:</h3>
                        <p className="font-black text-slate-800 text-base leading-tight pr-2">{entrega.direccion || 'Sin dirección registrada'}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Bogotá, Colombia</p>
                        
                        {entrega.direccion && (
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entrega.direccion + ', Bogotá, Colombia')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-pink-400 hover:text-pink-500 text-xs font-medium mt-2 inline-block transition-colors"
                            >
                                ¿Cómo puedo llegar?
                            </a>
                        )}
                    </div>
                </div>

                {/* Tarjeta 2: Cliente */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 mb-4">
                    <h3 className="text-[#e91e63] font-bold text-sm mb-1">Información del cliente:</h3>
                    <p className="font-black text-slate-800 text-sm">{entrega.cliente || 'Sin nombre registrado'}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{entrega.celular || 'Sin teléfono'}</p>
                    
                    {entrega.celular && (
                        <a 
                            href={`tel:${entrega.celular}`} 
                            className="text-pink-400 hover:text-pink-500 text-xs font-medium mt-2 inline-block transition-colors"
                        >
                            Llamar
                        </a>
                    )}
                </div>

                {/* Tarjeta 3: Entregar Form */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative">
                    {intentosRestantes <= 0 && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10 p-6 text-center">
                            <div>
                                <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <h3 className="font-bold text-slate-800 text-lg">Bloqueado</h3>
                                <p className="text-sm text-slate-500 mt-1">Has superado los 3 intentos. Por favor contacta a soporte.</p>
                            </div>
                        </div>
                    )}

                    <h3 className="text-[#e91e63] font-bold text-base mb-4">Entregar:</h3>
                    
                    <form onSubmit={submit}>
                        {/* Palabra Clave */}
                        <div className="mb-4">
                            <label className="block text-slate-500 font-medium text-sm mb-2">
                                Palabra Clave:
                            </label>
                            <input 
                                type="text" 
                                value={data.palabra_clave}
                                onChange={e => {
                                    setData('palabra_clave', e.target.value);
                                    setLocalError('');
                                }}
                                required 
                                placeholder="Ej: Zapato" 
                                className={`w-full py-3.5 px-4 border-2 rounded-full text-base font-medium outline-none transition-all placeholder:text-slate-300
                                    ${(localError || serverErrors.palabra_clave) ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-[#e91e63] focus:ring-4 focus:ring-pink-50'}
                                `}
                            />
                            <div className="flex justify-between items-start mt-1.5 px-3">
                                <span className={`text-[10px] font-medium ${(localError || serverErrors.palabra_clave) ? 'text-red-500' : 'text-slate-400'}`}>
                                    {localError || serverErrors.palabra_clave || `Sólo tienes ${intentosRestantes} oportunidades`}
                                </span>
                            </div>
                        </div>

                        {/* Número de documento */}
                        <div className="mb-6">
                            <label className="block text-slate-500 font-medium text-sm mb-2">
                                Número de documento:
                            </label>
                            <input 
                                type="text" 
                                value={data.documento}
                                onChange={e => setData('documento', e.target.value)}
                                placeholder="Ej: 1234556778" 
                                className="w-full py-3.5 px-4 border-2 border-slate-200 rounded-full text-base font-medium outline-none transition-all focus:border-[#e91e63] focus:ring-4 focus:ring-pink-50 placeholder:text-slate-300"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={processing || !data.palabra_clave || intentosRestantes <= 0}
                            className="w-full py-3.5 bg-[#e91e63] text-white rounded-full font-bold text-base hover:bg-opacity-90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing && <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            Entregar
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
