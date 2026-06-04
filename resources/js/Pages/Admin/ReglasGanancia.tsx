import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';

interface Repartidor {
    id: number;
    name: string;
}

interface Regla {
    id: number;
    user_id: number | null;
    hora_inicio: string;
    hora_fin: string;
    monto: string;
    tipo: 'a_tiempo' | 'retraso';
    activa: boolean;
    user: Repartidor | null;
}

export default function ReglasGanancia({ reglas, repartidores }: { reglas: Regla[], repartidores: Repartidor[] }) {
    const { props } = usePage<any>();
    const flash = props.flash || {};

    const { data, setData, post, processing, reset, errors } = useForm({
        user_id: '',
        hora_inicio: '',
        hora_fin: '',
        monto: '',
        tipo: 'a_tiempo',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (editingId) {
            router.put(route('admin.reglas.update', editingId), data as any, {
                preserveScroll: true,
                onSuccess: () => {
                    cancelEdit();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false)
            });
        } else {
            post(route('admin.reglas.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setIsSubmitting(false);
                },
                onError: () => setIsSubmitting(false)
            });
        }
    };

    const handleEdit = (regla: Regla) => {
        setEditingId(regla.id);
        setData({
            user_id: regla.user_id ? regla.user_id.toString() : '',
            hora_inicio: formatTime(regla.hora_inicio),
            hora_fin: formatTime(regla.hora_fin),
            monto: regla.monto.toString(),
            tipo: regla.tipo,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta regla?')) {
            router.delete(route('admin.reglas.destroy', id), { preserveScroll: true });
        }
    };

    const formatMoney = (amount: number | string) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(amount));
    };

    const formatTime = (time: string) => {
        // time viene como "18:00:00"
        return time.substring(0, 5);
    };

    return (
        <AppLayout>
            <Head title="Reglas de Ganancia" />

            <div className="bg-[#fff0f5] min-h-screen -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 p-6 sm:p-8 font-['Montserrat',sans-serif]">
                
                {flash.status && (
                    <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 font-semibold text-center shadow-sm">
                        {flash.status}
                    </div>
                )}

                <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Motor de Ganancias</h1>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">Automatiza cuánto se le paga a los repartidores según la hora de entrega</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Formulario de Creación */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 sticky top-8">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">{editingId ? 'Editar Regla' : 'Crear Nueva Regla'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Repartidor (Opcional)</label>
                                    <select 
                                        value={data.user_id}
                                        onChange={e => setData('user_id', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                                    >
                                        <option value="">Aplica para TODOS (Regla Global)</option>
                                        {repartidores.map(rep => (
                                            <option key={rep.id} value={rep.id}>{rep.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Hora Inicio</label>
                                        <input 
                                            type="time" 
                                            value={data.hora_inicio}
                                            onChange={e => setData('hora_inicio', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                                        />
                                        {errors.hora_inicio && <p className="text-red-500 text-xs mt-1">{errors.hora_inicio}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Hora Fin</label>
                                        <input 
                                            type="time" 
                                            value={data.hora_fin}
                                            onChange={e => setData('hora_fin', e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                                        />
                                        {errors.hora_fin && <p className="text-red-500 text-xs mt-1">{errors.hora_fin}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Monto a pagar ($)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-bold">$</span>
                                        </div>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={data.monto}
                                            onChange={e => setData('monto', e.target.value)}
                                            required
                                            placeholder="Ej: 5000"
                                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-slate-700"
                                        />
                                    </div>
                                    {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Tipo de Tarifa</label>
                                    <select 
                                        value={data.tipo}
                                        onChange={e => setData('tipo', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-bold text-slate-700"
                                    >
                                        <option value="a_tiempo">Entrega A Tiempo (Exitosa)</option>
                                        <option value="retraso">Entrega Con Retraso (Penalidad/Menor Ganancia)</option>
                                    </select>
                                    {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                        {editingId ? 'Actualizar Regla' : 'Guardar Regla'}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button" 
                                            onClick={cancelEdit}
                                            className="px-6 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Lista de Reglas */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 h-[calc(100vh-12rem)] flex flex-col">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Reglas Configuradas</h2>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {reglas.length === 0 ? (
                                    <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                                        <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                        <p className="text-slate-500 font-bold">No hay reglas de ganancias configuradas.</p>
                                        <p className="text-slate-400 text-xs mt-1">Crea tu primera regla a la izquierda.</p>
                                    </div>
                                ) : (
                                    reglas.map(regla => (
                                        <div key={regla.id} className={`border p-5 rounded-2xl flex items-center justify-between transition-all ${regla.activa ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${regla.activa ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <div>
                                                    <div className="flex gap-2 mb-1">
                                                        {regla.user_id ? (
                                                            <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">Específica: {regla.user?.name}</span>
                                                        ) : (
                                                            <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">Global (TODOS)</span>
                                                        )}
                                                        {!regla.activa && (
                                                            <span className="text-[9px] font-black uppercase bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full">Inactiva</span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base font-black text-slate-800 leading-tight flex items-center gap-2">
                                                        De {formatTime(regla.hora_inicio)} a {formatTime(regla.hora_fin)}
                                                        {regla.tipo === 'a_tiempo' ? (
                                                            <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">A Tiempo</span>
                                                        ) : (
                                                            <span className="text-[9px] font-black uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">Retraso</span>
                                                        )}
                                                    </h3>
                                                    <p className="text-sm font-bold text-slate-500 mt-0.5">Monto: <span className="text-primary">{formatMoney(regla.monto)}</span></p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleEdit(regla)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                                                    title="Editar Regla"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(regla.id)}
                                                    className="w-9 h-9 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center rounded-full transition-colors"
                                                    title="Eliminar Regla"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
