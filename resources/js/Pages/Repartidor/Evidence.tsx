import React, { FormEvent, useRef, useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';

export default function Evidence({ auth, entrega, errors, flash }: any) {
    const [fotosBase64, setFotosBase64] = useState<string[]>([]);
    const [descripcion, setDescripcion] = useState('');
    const [showSignatureModal, setShowSignatureModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Referencias para el input de fotos
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- LÓGICA DE FOTOS ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // Convertir cada archivo a base64
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setFotosBase64(prev => [...prev, ev.target!.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
        
        // Limpiar el input para permitir seleccionar la misma imagen de nuevo si se borra
        e.target.value = '';
    };

    const removeFoto = (index: number) => {
        setFotosBase64(prev => prev.filter((_, i) => i !== index));
    };


    // --- LÓGICA DEL CANVAS DE FIRMA ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    // Inicializar canvas (fondo blanco para que al exportar a JPEG no salga negro)
    useEffect(() => {
        if (showSignatureModal && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000000';
            }
        }
    }, [showSignatureModal]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        setHasDrawn(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX = 0, clientY = 0;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX = 0, clientY = 0;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    // --- ENVÍO FINAL ---
    const handleFinalSubmit = () => {
        if (!hasDrawn || !canvasRef.current) return;
        setIsSubmitting(true);

        // Exportar a JPEG comprimido
        const firmaBase64 = canvasRef.current.toDataURL('image/jpeg', 0.5);

        router.post(route('evidencia.upload'), {
            tracking_id: entrega.tracking_id,
            descripcion: descripcion,
            evidencias_comprimidas: fotosBase64,
            firma_comprimida: firmaBase64
        }, {
            onFinish: () => setIsSubmitting(false),
            onError: () => setShowSignatureModal(false)
        });
    };

    return (
        <AppLayout>
            <Head title={`Evidencias #${entrega.tracking_id}`} />

            <div className="max-w-md mx-auto pt-6 pb-24 px-5 font-['Montserrat',sans-serif]">
                
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

                {/* Tarjeta 2: Evidencia */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-4">
                    <h3 className="text-[#e91e63] font-bold text-base mb-4">Captura evidencia</h3>
                    
                    {/* Inputs Ocultos */}
                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        ref={cameraInputRef} 
                        className="hidden" 
                        onChange={handleFileChange}
                    />

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3.5 bg-[#e91e63] text-white rounded-full font-bold text-base hover:bg-opacity-90 transition-colors"
                        >
                            Elegir Archivos
                        </button>
                        <button 
                            onClick={() => cameraInputRef.current?.click()}
                            className="w-full py-3.5 bg-white text-[#e91e63] border-2 border-[#e91e63] rounded-full font-bold text-base hover:bg-pink-50 transition-colors"
                        >
                            Tomar foto
                        </button>
                    </div>

                    {/* Previsualización de Fotos */}
                    {fotosBase64.length > 0 && (
                        <div className="mt-5 grid grid-cols-3 gap-2">
                            {fotosBase64.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                                    <img src={src} className="w-full h-full object-cover" alt="Evidencia" />
                                    <button 
                                        onClick={() => removeFoto(idx)}
                                        className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 shadow-sm hover:scale-110 active:scale-95 transition-transform"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tarjeta 3: Descripción */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
                    <h3 className="text-[#e91e63] font-bold text-base mb-3">Descripción</h3>
                    <textarea 
                        rows={3}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción/Notas (opcional)"
                        className="w-full p-4 border-2 border-slate-200 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#e91e63] focus:ring-4 focus:ring-pink-50 placeholder:text-slate-300 resize-none"
                    />
                </div>

                <button 
                    onClick={() => setShowSignatureModal(true)}
                    className="w-full py-4 bg-[#e91e63] text-white rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors shadow-md flex items-center justify-center gap-2 mb-8"
                >
                    Firmar y Finalizar
                </button>
            </div>

            {/* MODAL DE FIRMA */}
            {showSignatureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-slate-800 text-lg leading-tight">Firma del Cliente</h3>
                                <p className="text-xs text-slate-500 font-medium">Usa tu dedo para firmar</p>
                            </div>
                            <button onClick={() => setShowSignatureModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        {/* Area del Canvas */}
                        <div className="bg-slate-50 p-4">
                            <canvas
                                ref={canvasRef}
                                width={300}
                                height={200}
                                className="w-full h-48 bg-white border-2 border-dashed border-slate-300 rounded-2xl cursor-crosshair touch-none"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                        </div>

                        <div className="p-5 flex gap-3">
                            <button 
                                onClick={clearSignature}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                            >
                                Limpiar
                            </button>
                            <button 
                                onClick={handleFinalSubmit}
                                disabled={!hasDrawn || isSubmitting}
                                className="flex-1 py-3 bg-[#e91e63] text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                            >
                                {isSubmitting && <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
