import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import React, { PropsWithChildren, useEffect, useState } from 'react';

export default function AppLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Extracción de iniciales
    const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD';
    const hasFullMenu = user?.role !== 'repartidor';
    const hasPermission = (module: string) => Array.isArray(user?.permisos) && user.permisos.includes(module);

    // Guardar usuario en localStorage para las tarjetas de login rápido
    useEffect(() => {
        if (user?.email && user?.name) {
            const saved = localStorage.getItem('recent_celuworkers');
            let users = saved ? JSON.parse(saved) : [];
            const newUser = {
                email: user.email,
                name: user.name,
                status: 'Activo recientemente',
                initials: user.name.substring(0, 2).toUpperCase()
            };
            users = [newUser, ...users.filter((u: any) => u.email !== user.email)].slice(0, 3);
            localStorage.setItem('recent_celuworkers', JSON.stringify(users));
        }
    }, []);

    // Mapeo de roles a nombres legibles
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

    return (
        <div className="min-h-screen bg-[#fdf2f8] font-sans flex flex-col">
            {/* Top Navbar */}
            <nav className="h-16 bg-[#e91e63] flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 sticky top-0 shadow-md">
                <div className="flex items-center gap-4 sm:gap-8 h-full">
                    {/* Botón de Menú Mobile (solo admin) */}
                    {hasFullMenu && (
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-white md:hidden hover:bg-white/10 p-1 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isSidebarOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    )}

                    <Link href={route('dashboard')} className="flex flex-col text-white no-underline">
                        <span className="font-black text-xl sm:text-2xl tracking-tighter leading-none" style={{ fontFamily:"'Montserrat',sans-serif" }}>CMS-UP</span>
                        <span className="text-[8px] sm:text-[9px] italic opacity-80" style={{ fontFamily:"'Poppins',sans-serif" }}>Todo en un solo lugar</span>
                    </Link>

                    {/* Barra de búsqueda — solo admin y ocultar en móvil pequeño */}
                    {hasFullMenu && (
                        <div className="hidden lg:flex relative items-center ml-4">
                            <input 
                                type="text" 
                                placeholder="Buscar en CMS-UP..." 
                                className="bg-white/90 focus:bg-white rounded-l-full rounded-r-none h-9 px-4 text-sm w-48 xl:w-64 border-none focus:ring-0 text-slate-700 outline-none transition-all"
                            />
                            <button className="bg-[#e91e63] border border-white h-9 px-3 rounded-r-full flex items-center justify-center hover:bg-[#d81b60] transition-colors">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    )}

                    {/* Links de navegación — solo admin y ocultar en móvil/tablet */}
                    {hasFullMenu && (
                        <div className="hidden md:flex items-center h-full gap-4 lg:gap-6 text-white text-xs lg:text-sm font-medium ml-4">
                            {hasPermission('usuarios') && (
                                <Link 
                                    href={route('admin.usuarios')} 
                                    className={`h-full flex items-center px-1 text-white no-underline transition-all hover:opacity-80 ${route().current('admin.usuarios*') ? 'border-b-4 border-white font-black' : 'font-medium'}`}
                                >
                                    Usuarios
                                </Link>
                            )}
                            {hasPermission('entregas') && (
                                <Link 
                                    href={route('admin.entregas')} 
                                    className={`h-full flex items-center px-1 text-white no-underline transition-all hover:opacity-80 ${route().current('admin.entregas*') ? 'border-b-4 border-white font-black' : 'font-medium'}`}
                                >
                                    Entregas
                                </Link>
                            )}
                            {hasPermission('inventario') && (
                                <a href="#" className="h-full flex items-center px-1 text-white no-underline opacity-50 cursor-not-allowed font-medium">Inventario</a>
                            )}
                            {hasPermission('reportes') && (
                                <a href="#" className="h-full flex items-center px-1 text-white no-underline opacity-50 cursor-not-allowed font-medium">Reportes</a>
                            )}
                            {hasPermission('facturacion') && (
                                <a href="#" className="h-full flex items-center px-1 text-white no-underline opacity-50 cursor-not-allowed font-medium">Facturación</a>
                            )}
                        </div>
                    )}

                    {/* Repartidor: texto simple — ocultar en móvil pequeño */}
                    {!hasFullMenu && (
                        <div className="hidden sm:flex items-center h-full gap-6 text-white text-sm font-medium ml-4">
                            <span className="h-full flex items-center border-b-2 border-white font-bold px-1">Dashboard</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center text-white relative z-50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md cursor-pointer items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
                                <div className="relative shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#e91e63] flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm">
                                        {initials}
                                    </div>
                                    {/* Punto blanco de notificaciones */}
                                    <span className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full border-2 border-[#e91e63] -translate-x-1/4 -translate-y-1/4 shadow-sm" />
                                </div>
                                
                                <div className="flex flex-col text-left leading-tight hidden sm:flex">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-sm sm:text-base text-white truncate max-w-[120px] sm:max-w-[200px]">{user?.name || 'Usuario'}</span>
                                        <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-pink-100 font-medium">{roleName}</span>
                                </div>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Mi Perfil</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Cerrar Sesión
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar — solo admin, responsive */}
                {hasFullMenu && (
                    <>
                        {/* Overlay para cerrar el menú en móvil */}
                        {isSidebarOpen && (
                            <div 
                                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        )}
                        <aside className={`
                            fixed md:static inset-y-0 left-0 w-[60px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0 z-30 transition-transform duration-300 ease-in-out
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                        `}>
                            {/* Dashboard / Home */}
                            <Link href={route('dashboard')} className={`p-2 rounded-lg transition-colors relative ${route().current('dashboard') ? 'text-[#e91e63] bg-pink-50' : 'text-slate-400 hover:text-[#e91e63]'}`}>
                                {route().current('dashboard') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e91e63] -ml-2 rounded-r-md"></div>}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            </Link>

                            {/* Usuarios */}
                            {hasPermission('usuarios') && (
                                <Link href={route('admin.usuarios')} className={`p-2 rounded-lg transition-colors relative ${route().current('admin.usuarios*') ? 'text-[#e91e63] bg-pink-50' : 'text-slate-400 hover:text-[#e91e63]'}`}>
                                    {route().current('admin.usuarios*') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e91e63] -ml-2 rounded-r-md"></div>}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </Link>
                            )}

                            {/* Entregas */}
                            {hasPermission('entregas') && (
                                <Link href={route('admin.entregas')} className={`p-2 rounded-lg transition-colors relative ${route().current('admin.entregas*') ? 'text-[#e91e63] bg-pink-50' : 'text-slate-400 hover:text-[#e91e63]'}`}>
                                    {route().current('admin.entregas*') && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e91e63] -ml-2 rounded-r-md"></div>}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                </Link>
                            )}
                            
                            {hasPermission('inventario') && (
                                <button className="text-slate-400 hover:text-[#e91e63] transition-colors mt-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </button>
                            )}
                            
                            {hasPermission('configuracion') && (
                                <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            )}
                            
                            {hasPermission('reportes') && (
                                <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                            )}
                        </aside>
                    </>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-0">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
