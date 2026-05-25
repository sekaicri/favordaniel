import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const user = usePage().props.auth.user;
    
    // Mapeo de roles a nombres legibles para la tarjeta
    const roleLabels: Record<string, string> = {
        'director': 'Director',
        'admin': 'Administrador',
        'repartidor': 'Repartidor',
        'facturador': 'Facturador',
        'inventario': 'Inventario',
        'inventarios': 'Inventario',
        'soporte': 'Soporte',
        'experiencia': 'Experiencia',
        'user': 'Usuario',
    };
    
    const roleName = roleLabels[user?.role || 'user'] || 'Usuario';
    const firstName = user?.name ? user.name.split(' ')[0] : 'Usuario';

    return (
        <AppLayout>
            <Head title="Inicio" />

            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 mb-8 mt-4 overflow-hidden relative">
                {/* Elementos decorativos de fondo */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-secondary-light/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] bg-secondary-light/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                        <span className="text-4xl sm:text-5xl font-black">
                            {firstName.substring(0, 1).toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-secondary-light/10 text-primary font-bold text-xs uppercase tracking-wider mb-4 border border-primary/10">
                            Rol: {roleName}
                        </span>
                        <h1 className="text-3xl sm:text-[3rem] font-black text-slate-800 tracking-tight leading-tight mb-3">
                            ¡Hola, <span className="text-primary">{firstName}</span>!
                        </h1>
                        <p className="text-slate-500 text-base sm:text-lg font-medium max-w-2xl">
                            Bienvenido a tu panel de control central de CMS-UP. Desde aquí podrás acceder a todos los módulos y herramientas que tienes habilitados para tu rol.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card Informativa 1 */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-light/10 flex items-center justify-center text-primary mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Novedades</h3>
                    <p className="text-slate-500 text-sm font-medium">Próximamente estaremos agregando nuevas métricas y reportes para facilitar tu gestión diaria en el sistema.</p>
                </div>

                {/* Card Informativa 2 */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-light/10 flex items-center justify-center text-primary mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Seguridad</h3>
                    <p className="text-slate-500 text-sm font-medium">Tu sesión actual está protegida. Recuerda no compartir tus credenciales de acceso con nadie.</p>
                </div>

                {/* Card Informativa 3 */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-light/10 flex items-center justify-center text-primary mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Soporte Técnico</h3>
                    <p className="text-slate-500 text-sm font-medium">Si presentas algún inconveniente con el panel, por favor contacta al área de tecnología o a un administrador.</p>
                </div>
            </div>
        </AppLayout>
    );
}
