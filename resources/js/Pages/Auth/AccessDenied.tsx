import { Head, Link } from '@inertiajs/react';

export default function AccessDenied() {
    return (
        <>
            <Head title="Acceso Denegado" />
            <style dangerouslySetInnerHTML={{ __html: `
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { background: #fff; }
                body { font-family: 'Montserrat', sans-serif; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
                @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:0.5} 100%{transform:scale(1.5);opacity:0} }
            `}} />

            <div className="min-h-screen flex w-full">
                {/* Left Side: Animated Illustration */}
                <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-gradient-to-br from-[#ff4081] to-[#c2185b] items-center justify-center">
                    <div className="absolute inset-0 z-0 opacity-20" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                    
                    <div className="relative z-10 text-center text-white px-12" style={{ animation: 'float 6s ease-in-out infinite' }}>
                        <div className="w-64 h-64 mx-auto mb-8 relative">
                            <div className="absolute inset-0 bg-white opacity-10 rounded-full blur-3xl"></div>
                            {/* Simple Warning Icon */}
                            <svg className="w-full h-full text-white drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-black mb-4 tracking-tight" style={{textShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>
                            Acceso Restringido
                        </h1>
                        <p className="text-xl font-medium text-pink-100 opacity-90 max-w-md mx-auto">
                            Exclusivo para Celuworkers
                        </p>
                    </div>
                    
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-2xl opacity-40"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-400 rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
                </div>

                {/* Right Side: Message */}
                <div className="w-full lg:w-[45%] bg-white flex flex-col relative z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
                    <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24">
                        <div className="w-full max-w-md mx-auto text-center">
                            
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#e91e63]">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
                                ¡Ups! Tu usuario no está registrado
                            </h2>
                            
                            <p className="text-slate-500 mb-10 leading-relaxed">
                                Parece que la cuenta de Google con la que intentas ingresar no tiene permisos de acceso al sistema. 
                                <br/><br/>
                                <strong className="text-slate-700">Por favor, contacta a tu administrador</strong> para que te asigne un rol y te permita ingresar.
                            </p>

                            <Link 
                                href={route('login')} 
                                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-gradient-to-r from-[#e91e63] to-[#c2185b] hover:from-[#d81b60] hover:to-[#ad1457] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all transform hover:-translate-y-0.5"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al Login
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="py-8 text-center border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">
                            &copy; 2026 Celumovil Store. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
