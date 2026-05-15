import { Link, usePage } from '@inertiajs/react';
import React, { PropsWithChildren } from 'react';
import Dropdown from '@/Components/Dropdown';

export default function AdminLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;
    
    // Extracción de iniciales
    const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD';
    const isAdmin = user?.role === 'admin';

    // Mapeo de roles a nombres legibles
    const roleLabels: Record<string, string> = {
        'admin': 'Administrador',
        'repartidor': 'Repartidor',
        'facturador': 'Facturador',
        'inventarios': 'Inventarios',
        'soporte': 'Soporte',
        'experiencia': 'Experiencia',
        'user': 'Usuario',
    };
    const roleName = roleLabels[user?.role || 'user'] || 'Usuario';

    return (
        <div className="min-h-screen bg-[#fdf2f8] font-sans flex flex-col">
            {/* Top Navbar */}
            <nav className="h-16 bg-[#e91e63] flex items-center justify-between px-6 z-20 shrink-0">
                <div className="flex items-center gap-8 h-full">
                    <Link href={route('dashboard')} className="flex flex-col text-white no-underline">
                        <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:24, letterSpacing:'1px', lineHeight:1 }}>CMS-UP</span>
                        <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:9, fontStyle:'italic' }}>Todo en un solo lugar</span>
                    </Link>

                    {/* Barra de búsqueda — solo admin */}
                    {isAdmin && (
                        <div className="relative flex items-center ml-4">
                            <input 
                                type="text" 
                                placeholder="Buscar en CMS-UP..." 
                                className="bg-white rounded-l-full rounded-r-none h-9 px-4 text-sm w-64 border-none focus:ring-0 text-slate-700 outline-none"
                            />
                            <button className="bg-[#e91e63] border border-white h-9 px-3 rounded-r-full flex items-center justify-center hover:bg-[#d81b60] transition-colors">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    )}

                    {/* Links de navegación — solo admin */}
                    {isAdmin && (
                        <div className="hidden md:flex items-center h-full gap-6 text-white text-sm font-medium ml-4">
                            <a href="#" className="hover:text-pink-200 transition-colors">Inventarios</a>
                            <a href="#" className="hover:text-pink-200 transition-colors">Garantías</a>
                            <a href="#" className="hover:text-pink-200 transition-colors">Facturación</a>
                            <a href="#" className="h-full flex items-center border-b-2 border-white font-bold">Entregas</a>
                        </div>
                    )}

                    {/* Repartidor: texto simple */}
                    {!isAdmin && (
                        <div className="hidden md:flex items-center h-full gap-6 text-white text-sm font-medium ml-4">
                            <span className="h-full flex items-center border-b-2 border-white font-bold">Panel de Entregas</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 text-white relative z-50">
                    <div className="w-9 h-9 rounded-full bg-white text-[#e91e63] flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {initials}
                    </div>
                    
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md cursor-pointer items-center hidden md:flex hover:opacity-80 transition-opacity">
                                <div className="flex flex-col text-right leading-tight">
                                    <span className="font-semibold text-sm">{user?.name || 'Usuario'}</span>
                                    <span className="text-xs text-pink-200">{roleName}</span>
                                </div>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar — solo admin */}
                {isAdmin && (
                    <aside className="w-[60px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0 z-10">
                        <button className="text-slate-500 hover:text-[#e91e63] transition-colors mb-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2} /></svg>
                        </button>
                        <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </button>
                        <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </button>
                        
                        {/* Active Icon (Users) */}
                        <button className="text-[#e91e63] bg-pink-50 p-2 rounded-lg transition-colors relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#e91e63] -ml-2 rounded-r-md"></div>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                        
                        <button className="text-slate-400 hover:text-[#e91e63] transition-colors mt-auto">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </button>
                        <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <button className="text-slate-400 hover:text-[#e91e63] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative z-0">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
