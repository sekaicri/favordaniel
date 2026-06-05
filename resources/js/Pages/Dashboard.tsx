import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, usePage, useForm } from '@inertiajs/react';

export default function Dashboard({ metrics }: any) {
    const user = usePage().props.auth.user;
    
    const assignForm = useForm({
        tracking_id: '',
    });

    const submitAssign = (e: React.FormEvent) => {
        e.preventDefault();
        assignForm.post(route('repartidor.assign.post'), {
            onSuccess: () => {
                assignForm.reset();
            }
        });
    };

    
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
                        <span className="text-4xl sm:text-5xl font-bold">
                            {firstName.substring(0, 1).toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-secondary-light/10 text-primary font-semibold text-xs uppercase tracking-wider mb-4 border border-primary/10">
                            Rol: {roleName}
                        </span>
                        <h1 className="text-3xl sm:text-[3rem] font-bold text-slate-800 tracking-tight leading-tight mb-3">
                            ¡Hola, <span className="text-primary">{firstName}</span>!
                        </h1>
                        <p className="text-slate-500 text-base sm:text-lg font-medium max-w-2xl">
                            Bienvenido a tu panel de control central de CMS-UP. Desde aquí podrás acceder a todos los módulos y herramientas que tienes habilitados para tu rol.
                        </p>
                    </div>
                </div>
            </div>

            {user?.role === 'repartidor' ? (
                <>
                    {/* Formulario de Asignación Rápida */}
                    <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-[0_20px_50px_rgba(233,30,99,0.1)] border border-pink-50 relative overflow-hidden mb-8">
                        <form onSubmit={submitAssign} className="relative z-10">
                            <label className="block text-slate-500 font-medium text-sm mb-3 ml-2">
                                Número de Guía:
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={assignForm.data.tracking_id}
                                    onChange={e => assignForm.setData('tracking_id', e.target.value)}
                                    required 
                                    placeholder="Ej: 34534545986745" 
                                    className="w-full py-4 pl-6 pr-14 border-2 border-slate-100 rounded-full text-base font-medium bg-slate-50 outline-none transition-all focus:border-[#e91e63] focus:bg-white focus:shadow-inner placeholder:text-slate-300"
                                />
                                <button 
                                    type="submit"
                                    disabled={assignForm.processing || !assignForm.data.tracking_id}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-pink-50 text-[#e91e63] flex items-center justify-center hover:bg-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {assignForm.processing ? (
                                        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                    )}
                                </button>
                            </div>
                            {assignForm.errors.tracking_id && <div className="text-red-500 text-xs font-semibold mt-3 ml-4">{assignForm.errors.tracking_id}</div>}
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Entregas del mes */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-50 rounded-full blur-2xl group-hover:bg-pink-100 transition-colors duration-500"></div>
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#e91e63] flex items-center justify-center mb-4 relative z-10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest relative z-10">Entregas este mes</h3>
                        <p className="text-4xl font-bold text-slate-800 mt-2 mb-1 relative z-10">{metrics?.entregas_mes || 0}</p>
                        <p className="text-xs font-semibold text-green-500 relative z-10">+ Órdenes finalizadas</p>
                    </div>

                    {/* Card Novedades */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors duration-500"></div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4 relative z-10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest relative z-10">Novedades</h3>
                        <p className="text-4xl font-bold text-slate-800 mt-2 mb-1 relative z-10">{metrics?.novedades || 0}</p>
                        <p className="text-xs font-semibold text-slate-400 relative z-10">Incidentes reportados</p>
                    </div>

                    {/* Card Ganancias */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100 transition-colors duration-500"></div>
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-4 relative z-10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest relative z-10">Ganancias</h3>
                        <p className="text-4xl font-bold text-slate-800 mt-2 mb-1 relative z-10">$ {metrics?.ganancias_estimadas || '0.00'}</p>
                        <p className="text-xs font-semibold text-slate-400 relative z-10">Estimado a facturar</p>
                    </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Informativa 1 */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-secondary-light/10 flex items-center justify-center text-primary mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Novedades</h3>
                        <p className="text-slate-500 text-sm font-medium">Próximamente estaremos agregando nuevas métricas y reportes para facilitar tu gestión diaria en el sistema.</p>
                    </div>

                    {/* Card Informativa 2 */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-secondary-light/10 flex items-center justify-center text-primary mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Seguridad</h3>
                        <p className="text-slate-500 text-sm font-medium">Tu sesión actual está protegida. Recuerda no compartir tus credenciales de acceso con nadie.</p>
                    </div>

                    {/* Card Informativa 3 */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-2xl bg-secondary-light/10 flex items-center justify-center text-primary mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Soporte Técnico</h3>
                        <p className="text-slate-500 text-sm font-medium">Si presentas algún inconveniente con el panel, por favor contacta al área de tecnología o a un administrador.</p>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
