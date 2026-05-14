import React, { useEffect } from 'react';

interface GalleryModalProps {
    images: string[];
    startIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function GalleryModal({
    images,
    startIndex,
    isOpen,
    onClose,
    onNext,
    onPrev
}: GalleryModalProps) {
    
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onNext, onPrev, onClose]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen || images.length === 0) return null;

    const currentImage = images[startIndex];

    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 w-full h-full bg-slate-900/40 z-[9999] flex justify-center items-center backdrop-blur-md transition-all duration-300"
        >
            {/* Close Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }} 
                className="absolute top-8 right-8 bg-white/5 border border-white/10 text-white text-3xl w-12 h-12 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-white/15 hover:scale-105"
            >
                &times;
            </button>

            {/* Main Container */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative bg-white/5 border border-white/5 rounded-3xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-sm max-w-[90%] max-h-[85vh] flex items-center justify-center"
            >
                
                {/* Prev Button */}
                {images.length > 1 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onPrev(); }} 
                        className="absolute -left-8 bg-white/5 border border-white/10 text-white text-2xl w-12 h-12 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] z-10 hover:bg-white/15 hover:-translate-x-1"
                    >
                        &#10094;
                    </button>
                )}

                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                    <img 
                        src={currentImage} 
                        className="max-w-full max-h-[75vh] object-contain block bg-black/20" 
                        alt={`Evidencia ${startIndex + 1}`}
                    />
                </div>

                {/* Next Button */}
                {images.length > 1 && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNext(); }} 
                        className="absolute -right-8 bg-white/5 border border-white/10 text-white text-2xl w-12 h-12 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.2)] z-10 hover:bg-white/15 hover:translate-x-1"
                    >
                        &#10095;
                    </button>
                )}
            </div>

            {/* Indicator & Actions */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute bottom-8 flex flex-col items-center gap-3"
            >
                <span className="bg-white/10 border border-white/10 text-slate-50 py-1.5 px-5 rounded-full text-sm font-semibold tracking-wider backdrop-blur-sm">
                    {startIndex + 1} / {images.length}
                </span>
                <a 
                    href={currentImage} 
                    download 
                    className="bg-pink-600/20 border border-pink-600/40 text-white py-2.5 px-8 rounded-xl no-underline text-sm font-bold shadow-[0_4px_15px_rgba(233,30,99,0.2)] backdrop-blur-md transition-all duration-300 hover:bg-pink-600/40 hover:-translate-y-0.5"
                >
                    Descargar Imagen
                </a>
            </div>
        </div>
    );
}
