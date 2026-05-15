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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('es-ES', options).replace(',', ' •');
    };

    return (
        <AdminLayout>
            <Head title="Panel de Entregas" />

            <div className="max-w-xl mx-auto py-2 sm:py-4">
                
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-sm border border-pink-100 mb-4 text-[#e91e63]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                    <h1 className="text-[#880e4f] text-3xl font-black m-0 tracking-tighter leading-tight">Panel de Entregas</h1>
                    <p className="text-[#e91e63] text-sm font-bold uppercase tracking-widest mt-1 opacity-70">Evidencias en tiempo real</p>
                </header>

                {flash?.status && (
                    <div className="bg-[#f8bbd0] text-[#880e4f] p-4 rounded-2xl mb-6 border border-[#f48fb1] font-bold text-center shadow-sm animate-pulse">
                        {flash.status}
                    </div>
                )}

                {flash?.error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-2xl mb-6 border border-red-200 font-bold text-center shadow-sm">
                        {flash.error}
                    </div>
                )}
                
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 border border-red-100 font-bold text-xs text-center">
                        ⚠️ Revisa los campos antes de enviar
                    </div>
                )}

                {/* Formulario de Subida */}
                <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-[0_20px_50px_rgba(233,30,99,0.1)] border border-pink-50 relative overflow-hidden group">
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-50 rounded-full opacity-50 blur-3xl group-hover:bg-pink-100 transition-colors duration-700"></div>
                    
                    <form onSubmit={submit} className="flex flex-col gap-6 relative z-10">
                        <div>
                            <label className="block font-black text-[#880e4f] mb-2 text-[10px] uppercase tracking-[0.2em] ml-1">
                                Guía de Seguimiento
                            </label>
                            <input 
                                type="text" 
                                value={data.tracking_id}
                                onChange={e => setData('tracking_id', e.target.value)}
                                required 
                                placeholder="Ej: CELU-12345" 
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50 outline-none transition-all duration-300 focus:border-[#e91e63] focus:bg-white focus:shadow-inner"
                            />
                            {errors.tracking_id && <div className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.tracking_id}</div>}
                        </div>

                        <div>
                            <label className="block font-black text-[#880e4f] mb-2 text-[10px] uppercase tracking-[0.2em] ml-1">
                                Descripción / Notas
                            </label>
                            <textarea 
                                value={data.descripcion}
                                onChange={e => setData('descripcion', e.target.value)}
                                rows={2} 
                                placeholder="¿Alguna observación especial?" 
                                className="w-full p-4 border-2 border-slate-100 rounded-2xl text-base resize-none bg-slate-50 outline-none transition-all duration-300 focus:border-[#e91e63] focus:bg-white focus:shadow-inner"
                            />
                        </div>

                        <div>
                            <label className="block font-black text-[#880e4f] mb-2 text-[10px] uppercase tracking-[0.2em] ml-1">
                                Adjuntar Fotos
                            </label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    accept="image/*" 
                                    capture="environment" 
                                    multiple 
                                    required 
                                    onChange={handleFileChange}
                                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-wider file:bg-pink-50 file:text-[#e91e63] hover:file:bg-pink-100 cursor-pointer"
                                />
                            </div>
                            <p className="text-[#3b82f6] text-[10px] mt-3 font-bold flex items-center gap-1 opacity-80">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                Optimización de imagen activada
                            </p>
                        </div>

                        {previewImages.length > 0 && (
                            <div className="bg-pink-50/30 p-4 rounded-3xl border border-dashed border-pink-100">
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {previewImages.map((src, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={src} className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white ring-1 ring-pink-100" alt={`Preview ${idx}`} />
                                            <div className="absolute -top-1 -right-1 bg-[#e91e63] text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">{idx + 1}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isProcessing || processing}
                            className={`mt-2 text-white p-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 shadow-xl ${
                                isProcessing || processing 
                                    ? 'bg-slate-300 cursor-not-allowed shadow-none scale-95' 
                                    : 'bg-gradient-to-r from-[#e91e63] to-[#d81b60] hover:shadow-pink-200 hover:-translate-y-1 active:scale-95'
                            }`}
                        >
                            {isProcessing ? 'Procesando...' : (processing ? 'Enviando...' : 'Finalizar Entrega')}
                        </button>
                    </form>
                </div>

                {/* Historial */}
                <div className="mt-12 mb-8">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-[#880e4f] m-0 text-xl font-black tracking-tight">Historial</h2>
                        <div className="relative">
                            <input 
                                type="date" 
                                name="fecha" 
                                defaultValue={filters?.fecha || ''}
                                onChange={e => router.get(route('repartidor.deliveries'), { fecha: e.target.value }, { preserveState: true })}
                                className="p-2 pl-3 pr-8 border border-pink-100 rounded-xl text-[10px] font-bold bg-white text-[#880e4f] outline-none focus:ring-1 focus:ring-[#e91e63] appearance-none"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-pink-300">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {entregas && entregas.length > 0 ? entregas.map((entrega: any) => {
                            const urls = parseUrls(entrega.url_evidencia);
                            return (
                                <div key={entrega.id} className="bg-white p-4 rounded-3xl border border-pink-50 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group">
                                    <div 
                                        onClick={() => urls.length > 0 && openGallery(urls, 0)}
                                        className={`relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-pink-50 flex items-center justify-center bg-slate-50 text-slate-300 shrink-0 ${urls.length > 0 ? 'cursor-pointer active:scale-90 transition-transform' : ''}`}
                                    >
                                        {urls.length > 0 ? (
                                            <>
                                                <img src={urls[0]} className="w-full h-full object-cover" alt="Evidencia" />
                                                {urls.length > 1 && (
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[10px] font-black">
                                                        +{urls.length - 1}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="m-0 font-black text-[#880e4f] text-sm truncate uppercase tracking-tighter">Guía: {entrega.tracking_id}</p>
                                        <p className="mt-1 mb-0 text-[10px] text-blue-500 font-black opacity-60 flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {formatDate(entrega.created_at)}
                                        </p>
                                    </div>
                                    <div className="bg-[#f0fdf4] text-[#16a34a] px-3 py-2 rounded-xl text-[8px] font-black tracking-[0.1em] shadow-sm border border-green-100 hidden xs:block">
                                        RECIBIDO
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-12 px-6 bg-white/50 rounded-[40px] border-2 border-dashed border-pink-100">
                                <div className="text-pink-200 mb-3 flex justify-center">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                </div>
                                <p className="text-pink-300 font-bold m-0 text-sm">No hay entregas pendientes.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <footer className="text-center py-8 opacity-40">
                    <p className="text-[10px] font-black text-[#880e4f] tracking-[0.2em] uppercase">© 2026 Celumovil Store CMS</p>
                </footer>
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
