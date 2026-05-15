import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import GalleryModal from '@/Components/GalleryModal';

interface Entrega {
    id: number;
    tracking_id: string;
    descripcion: string;
    url_evidencia: string[] | string | null;
    created_at: string;
}

interface DashboardProps {
    entregas: Entrega[];
    flash: {
        status?: string;
        error?: string;
    };
    filters: {
        fecha?: string;
    };
}

export default function Dashboard({ auth, entregas, flash, filters }: any) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    
    // Gallery State
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        tracking_id: '',
        descripcion: '',
        evidencias_comprimidas: [] as string[]
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsProcessing(true);
        setPreviewImages([]);
        const newCompressedImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const compressedBase64 = await compressImage(file);
            newCompressedImages.push(compressedBase64);
        }

        setData('evidencias_comprimidas', newCompressedImages);
        setPreviewImages(newCompressedImages);
        setIsProcessing(false);
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_WIDTH = 1200;
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('evidencia.upload'), {
            onSuccess: () => {
                reset();
                setPreviewImages([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
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

    // Helper to format date similar to Carbon
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('es-ES', options).replace(',', ' •');
    };

    return (
        <AdminLayout>
            <Head title="Panel de Entregas" />

            <div className="bg-[#fdf2f8] min-h-screen py-8 font-sans">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <header className="text-center mb-8">
                        <h1 className="text-[#880e4f] text-3xl font-extrabold m-0 tracking-tight">Panel de Entregas</h1>
                        <p className="text-[#e91e63] text-sm font-medium mt-1">Gestión de evidencias en tiempo real</p>
                    </header>

                    {flash?.status && (
                        <div className="bg-[#f8bbd0] text-[#880e4f] p-4 rounded-xl mb-6 border border-[#f48fb1] font-semibold text-center shadow-sm">
                            {flash.status}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 border border-red-200 font-semibold text-center shadow-sm">
                            {flash.error}
                        </div>
                    )}
                    
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 border border-red-200 font-semibold text-center shadow-sm">
                            Revisa los campos del formulario.
                        </div>
                    )}

                    {/* Formulario de Subida */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_10px_25px_-5px_rgba(233,30,99,0.1)] border border-[#fce4ec]">
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            
                            <div>
                                <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                    ID de Seguimiento
                                </label>
                                <input 
                                    type="text" 
                                    value={data.tracking_id}
                                    onChange={e => setData('tracking_id', e.target.value)}
                                    required 
                                    placeholder="Ingrese el número de guía" 
                                    className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0"
                                />
                                {errors.tracking_id && <div className="text-red-500 text-xs mt-1">{errors.tracking_id}</div>}
                            </div>

                            <div>
                                <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                    Descripción / Notas
                                </label>
                                <textarea 
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    rows={2} 
                                    placeholder="Detalles adicionales..." 
                                    className="w-full p-4 border-2 border-[#fce4ec] rounded-xl text-base resize-none bg-slate-50 outline-none transition-colors duration-200 focus:border-[#e91e63] focus:ring-0"
                                />
                            </div>

                            <div>
                                <label className="block font-extrabold text-[#880e4f] mb-2 text-xs uppercase tracking-wide">
                                    Capturar Evidencia
                                </label>
                                <div className="relative overflow-hidden">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        accept="image/*" 
                                        capture="environment" 
                                        multiple 
                                        required 
                                        onChange={handleFileChange}
                                        className="w-full p-3 text-sm bg-[#fce4ec] rounded-xl border-2 border-dashed border-[#f48fb1] text-[#e91e63] font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e91e63] file:text-white hover:file:bg-[#d81b60]"
                                    />
                                </div>
                                <p className="text-blue-400 text-xs mt-2 font-medium">✨ La imagen será optimizada automáticamente.</p>
                            </div>

                            {previewImages.length > 0 && (
                                <div className="text-center bg-[#fdf2f8] p-4 rounded-2xl border border-[#f8bbd0]">
                                    <p className="text-xs text-[#d81b60] mb-3 font-bold uppercase tracking-wider">Vista Previa Optimizada</p>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {previewImages.map((src, idx) => (
                                            <img key={idx} src={src} className="w-24 h-24 object-cover rounded-xl shadow-sm border border-[#fce4ec]" alt={`Preview ${idx}`} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isProcessing || processing}
                                className={`mt-2 text-white p-4 rounded-2xl font-extrabold text-lg transition-all duration-300 ${
                                    isProcessing || processing 
                                        ? 'bg-slate-400 shadow-none cursor-not-allowed' 
                                        : 'bg-gradient-to-br from-[#e91e63] to-[#c2185b] shadow-[0_10px_15px_-3px_rgba(233,30,99,0.4)] hover:-translate-y-1'
                                }`}
                            >
                                {isProcessing ? 'PROCESANDO...' : (processing ? 'ENVIANDO...' : 'FINALIZAR Y ENVIAR')}
                            </button>
                        </form>
                    </div>

                    {/* Historial */}
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[#880e4f] m-0 text-xl font-extrabold">Historial Reciente</h2>
                            <form action={route('repartidor.deliveries')} method="GET" className="flex gap-2 items-center">
                                <input 
                                    type="date" 
                                    name="fecha" 
                                    defaultValue={filters?.fecha || ''}
                                    onChange={e => router.get(route('repartidor.deliveries'), { fecha: e.target.value }, { preserveState: true })}
                                    className="p-2 border border-[#f48fb1] rounded-lg text-xs bg-white text-[#880e4f] outline-none focus:ring-1 focus:ring-[#e91e63]"
                                />
                            </form>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            {entregas && entregas.length > 0 ? entregas.map((entrega: Entrega) => {
                                const urls = parseUrls(entrega.url_evidencia);
                                return (
                                    <div key={entrega.id} className="bg-white p-4 rounded-2xl border border-[#fce4ec] flex items-center gap-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-transform hover:scale-[1.01]">
                                        <div 
                                            onClick={() => urls.length > 0 && openGallery(urls, 0)}
                                            className={`relative w-[70px] h-[70px] rounded-xl overflow-hidden border-2 border-[#fdf2f8] flex items-center justify-center bg-[#fce4ec] text-[#c2185b] font-bold text-xs ${urls.length > 0 ? 'cursor-pointer' : ''}`}
                                        >
                                            {urls.length > 0 ? (
                                                <>
                                                    <img src={urls[0]} className="w-full h-full object-cover" alt="Evidencia" />
                                                    {urls.length > 1 && (
                                                        <div className="absolute bottom-0 right-0 bg-black/60 text-white px-1.5 py-0.5 text-[10px] rounded-tl-md">
                                                            +{urls.length - 1}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                'N/A'
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="m-0 font-extrabold text-[#880e4f] text-base">Guía: {entrega.tracking_id}</p>
                                            <p className="mt-1 mb-0 text-xs text-blue-400 font-semibold">{formatDate(entrega.created_at)}</p>
                                        </div>
                                        <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase">
                                            LISTO
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="text-center py-12 px-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 italic m-0 font-medium text-sm">No hay entregas para mostrar.</p>
                                </div>
                            )}
                        </div>
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
        </AdminLayout>
    );
}
