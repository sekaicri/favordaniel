import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface Entrega {
    id: number;
    tracking_id: string;
    cliente: string | null;
    canal_compra: string | null;
    direccion: string | null;
    celular: string | null;
    estado: string;
    descripcion: string | null;
    created_at: string;
    updated_at: string;
}

interface RepartidorData {
    id: number;
    name: string;
    email: string;
    telefono: string | null;
    estado: boolean;
    ultimo_acceso: string;
}

interface Stats {
    total_asignadas: number;
    entregadas: number;
    por_entregar: number;
    pendientes: number;
    avance_general: number;
}

interface Ganancias {
    estimadas: number;
    valor_por_entrega: number;
    entregadas_validas: number;
}

interface RepartidorShowProps {
    repartidor: RepartidorData;
    stats: Stats;
    entregas: {
        por_entregar: Entrega[];
        entregados: Entrega[];
    };
    ganancias: Ganancias;
}

export default function RepartidorShow({ repartidor, stats, entregas, ganancias }: RepartidorShowProps) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).replace('.', '');
    const formattedTime = today.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();

    // Helper to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Helper to render stats ring SVG
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (stats.avance_general / 100) * circumference;

    return (
        <AppLayout>
            <Head title={`Detalle de ${repartidor.name}`} />

            <div className="max-w-[1200px] mx-auto pb-12">
                {/* Back button */}
                <div className="mb-6">
                    <Link
                        href={route('admin.repartidores')}
                        className="inline-flex items-center gap-2 text-[#e91e63] font-bold text-sm no-underline hover:opacity-80 transition-opacity"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a Repartidores
                    </Link>
                </div>

                {/* Header Profile Info card & Date */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#e91e63]/10 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0">
                            {/* Shopping bag style icon */}
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1" style={{ fontFamily:"'Montserrat',sans-serif" }}>{repartidor.name}</h1>
                            <p className="text-slate-400 text-sm font-medium">Gestión de evidencias en tiempo real</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-[#e91e63] shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fecha y hora</span>
                                <span className="text-sm font-bold text-slate-700">{formattedDate} - {formattedTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary bar */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="flex flex-col pr-6 pb-4 md:pb-0">
                        <span className="text-base font-bold text-[#e91e63] mb-1">Resumen del Repartidor</span>
                        <span className="text-slate-400 text-xs font-medium">Seguimiento de entregas asignadas</span>
                    </div>

                    <div className="flex flex-row flex-wrap md:flex-nowrap flex-1 justify-around pt-4 md:pt-0 gap-4">
                        <div className="text-center px-4">
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Asignadas</span>
                            <span className="text-2xl font-extrabold text-slate-700">{stats.total_asignadas}</span>
                        </div>

                        <div className="text-center px-4">
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Entregadas</span>
                            <span className="text-2xl font-extrabold text-green-600">{stats.entregadas}</span>
                        </div>

                        <div className="text-center px-4">
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Por Entregar</span>
                            <span className="text-2xl font-extrabold text-orange-500">{stats.por_entregar}</span>
                        </div>

                        <div className="text-center px-4">
                            <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pendientes</span>
                            <span className="text-2xl font-extrabold text-indigo-500">{stats.pendientes}</span>
                        </div>

                        {/* Circular Progress Ring */}
                        <div className="flex items-center gap-3 px-4">
                            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r={radius}
                                        className="text-slate-100"
                                        strokeWidth="4"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r={radius}
                                        className="text-[#e91e63]"
                                        strokeWidth="4"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                </svg>
                                <span className="absolute text-xs font-bold text-slate-700">{stats.avance_general}%</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Avance<br />general</span>
                        </div>
                    </div>
                </div>

                {/* Ganancias space */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily:"'Montserrat',sans-serif" }}>Espacio de Ganancias</h3>
                                <p className="text-xs font-medium text-slate-400">Cálculo de cobro adeudado al repartidor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                            <div className="text-center">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pago Estimado</span>
                                <span className="text-xl font-black text-green-600">{formatCurrency(ganancias.estimadas)}</span>
                            </div>
                            <div className="text-center border-l border-slate-200 pl-8">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tarifa por Entrega</span>
                                <span className="text-sm font-bold text-slate-600">{formatCurrency(ganancias.valor_por_entrega)} / ord</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-pink-50/50 border border-pink-100 rounded-xl flex items-center gap-3 text-[11px] text-pink-700 font-medium">
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        </svg>
                        <span>El tarifario oficial se integrará en la próxima fase. Este valor es un estimado calculado sobre las {ganancias.entregadas_validas} entregas completadas con éxito.</span>
                    </div>
                </div>

                {/* Two Columns for Deliveries */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Por entregar */}
                    <div>
                        <h2 className="text-xl font-bold text-[#e91e63] mb-4 flex items-center gap-2" style={{ fontFamily:"'Montserrat',sans-serif" }}>
                            Por entregar
                            <span className="text-xs bg-[#e91e63]/10 text-[#e91e63] px-2 py-0.5 rounded-full font-bold">
                                {entregas.por_entregar.length}
                            </span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            {entregas.por_entregar.map((entrega) => (
                                <div key={entrega.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#e91e63]/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-extrabold uppercase bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">
                                                    Por Entregar
                                                </span>
                                                {entrega.canal_compra && (
                                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {entrega.canal_compra}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">Guía # {entrega.tracking_id}</span>
                                            <span className="text-xs text-slate-400 font-medium">Cliente: {entrega.cliente || 'Desconocido'}</span>
                                            <span className="text-[11px] text-red-500 font-semibold mt-1">Se entregará con retraso</span>
                                        </div>
                                    </div>

                                    <button className="w-8 h-8 rounded-full bg-slate-50 text-[#e91e63] flex items-center justify-center hover:bg-pink-50 transition-colors shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                            {entregas.por_entregar.length === 0 && (
                                <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-200 text-center text-slate-400 font-medium text-sm">
                                    No hay entregas pendientes asignadas a este repartidor.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Entregados */}
                    <div>
                        <h2 className="text-xl font-bold text-[#e91e63] mb-4 flex items-center gap-2" style={{ fontFamily:"'Montserrat',sans-serif" }}>
                            Entregados
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                                {entregas.entregados.length}
                            </span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            {entregas.entregados.map((entrega) => {
                                const updateDate = new Date(entrega.updated_at);
                                const dateFormatted = updateDate.toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }).replace('.', '');
                                const timeFormatted = updateDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                }).toLowerCase();

                                return (
                                    <div key={entrega.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#e91e63]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-extrabold uppercase bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                                        Entregado
                                                    </span>
                                                    {entrega.canal_compra && (
                                                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                            {entrega.canal_compra}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">Guía # {entrega.tracking_id}</span>
                                                <span className="text-xs text-slate-400 font-medium">Entregado: {dateFormatted} - {timeFormatted}</span>
                                                <span className="text-[11px] text-green-600 font-semibold mt-1">Entregado con retraso</span>
                                            </div>
                                        </div>

                                        <button className="w-8 h-8 rounded-full bg-slate-50 text-[#e91e63] flex items-center justify-center hover:bg-pink-50 transition-colors shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}

                            {entregas.entregados.length === 0 && (
                                <div className="bg-slate-50 rounded-3xl p-8 border border-dashed border-slate-200 text-center text-slate-400 font-medium text-sm">
                                    No hay entregas completadas registradas para este repartidor.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
