import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import DeliveryDetailCard from '@/Components/DeliveryDetailCard';

export default function DeliveryDetail({ auth, entrega }: any) {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr: string) => {
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
        <AppLayout>
            <Head title={`Auditoría #${entrega.tracking_id}`} />
            
            <style>
                {`
                    @media print {
                        body, html, #app, main, [data-page] { height: auto !important; min-height: auto !important; overflow: visible !important; position: static !important; background-color: white !important; }
                        nav, aside, header:not(.report-header) { display: none !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        .print-avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
                        @page { margin: 0.5cm; }
                        .max-w-7xl, .mx-auto, .sm\\:px-6, .lg\\:px-8 { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
                    }
                `}
            </style>

            <div className="max-w-4xl mx-auto pt-6 pb-24 px-5 font-['Montserrat',sans-serif] print:pt-0 print:pb-0 print:px-0">
                
                <div className="flex items-center justify-between mb-8 print:hidden">
                    <button 
                        onClick={() => router.get(route('admin.entregas'))}
                        className="flex items-center gap-2 text-slate-500 hover:text-[#e91e63] transition-colors font-semibold text-sm bg-white px-5 py-2.5 rounded-full shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Volver al Panel
                    </button>
                    
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-[#e91e63] text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-md hover:bg-opacity-90 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Imprimir / Guardar PDF
                    </button>
                </div>
                <DeliveryDetailCard entrega={entrega} />

                <div className="mt-8 text-center print:block hidden">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Documento generado el {new Date().toLocaleDateString('es-ES')}</p>
                    <p className="text-[10px] font-semibold text-[#e91e63] mt-1 uppercase">Sistema de Gestión en Tiempo Real</p>
                </div>
            </div>
        </AppLayout>
    );
}