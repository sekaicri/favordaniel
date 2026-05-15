import InputError from '@/Components/InputError';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });
    const { props } = usePage<any>();
    const flash = props.flash || {};

    const [recentUsers, setRecentUsers] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('recent_celuworkers');
        if (saved) {
            setRecentUsers(JSON.parse(saved));
        }
    }, []);

    const removeRecent = (email: string) => {
        const filtered = recentUsers.filter(u => u.email !== email);
        setRecentUsers(filtered);
        localStorage.setItem('recent_celuworkers', JSON.stringify(filtered));
    };

    const selectRecent = (user: any) => {
        setData('email', user.email);
        // Focus password field automatically
        document.getElementById('password')?.focus();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                const saved = localStorage.getItem('recent_celuworkers');
                let users = saved ? JSON.parse(saved) : [];
                const newUser = {
                    email: data.email,
                    name: data.email.split('@')[0], // Fallback name based on email
                    status: 'Activo recientemente',
                    initials: data.email.substring(0, 2).toUpperCase()
                };
                users = [newUser, ...users.filter((u: any) => u.email !== data.email)].slice(0, 3);
                localStorage.setItem('recent_celuworkers', JSON.stringify(users));
            },
            onFinish: () => reset('password')
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />
            <style dangerouslySetInnerHTML={{ __html: `
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { background: #fff; }
                body { font-family: 'Poppins', sans-serif; }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
                .saly { animation: float 6s ease-in-out infinite; }
                .inp {
                    display:block; width:100%; border:1.5px solid #e0e0e0; background:#fff;
                    border-radius:14px; padding:14px 18px; font-family:'Poppins',sans-serif;
                    font-size:14px; font-weight:300; color:#333; outline:none; transition:border-color .2s,box-shadow .2s;
                }
                .inp-blue { border-color: #4285f4 !important; }
                .inp:focus { border-color:#4285f4; box-shadow:0 0 0 3px rgba(66,133,244,.12); }
                .inp::placeholder { color:#808080; font-weight:300; }
                .ucard { background:#EFF8FF; border-radius:9px; width:120px; height:140px;
                    padding:12px 8px; display:flex; flex-direction:column; align-items:center;
                    position:relative; cursor:pointer; transition:transform .2s,box-shadow .2s; flex-shrink:0; }
                .ucard:hover { transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.1); }
                /* ── Mobile ── */
                @media(max-width:768px){
                    html, body { overflow:hidden!important; height:100%!important; }
                    .bg-white-band,.rocket-col,.users-section,.left-text { display:none!important; }
                    .bg-pink-band { height:100%!important; }
                    .content-row { flex-direction:column!important; align-items:center!important; height:100vh!important; overflow:hidden!important; }
                    .left-col { flex:0 0 auto!important; width:100%!important; padding:20px 24px 0!important; justify-content:flex-start!important; }
                    .right-col { flex:1!important; width:100%!important; padding:0 16px 20px!important; align-items:stretch!important; display:flex!important; }
                    .login-card { border-radius:28px!important; padding:28px 24px 32px!important; min-height:0!important; flex:1!important; display:flex!important; flex-direction:column!important; justify-content:center!important; }
                    .login-card h2 { font-size:36px!important; margin-bottom:20px!important; }
                    .login-card p:first-child { font-size:16px!important; }
                    .google-btn { height:50px!important; font-size:15px!important; border-radius:12px!important; margin-bottom:28px!important; }
                    .inp { padding:12px 16px!important; font-size:13px!important; }
                }
            ` }} />

            <div style={{ minHeight:'100vh', height:'100vh', position:'relative', overflow:'hidden' }}>
                {/* Backgrounds — full viewport width */}
                <div className="bg-pink-band"  style={{ position:'fixed', top:0, left:0, right:0, height:'52%', background:'#e91e63', zIndex:0 }} />
                <div className="bg-white-band" style={{ position:'fixed', bottom:0, left:0, right:0, height:'48%', background:'#fff', zIndex:0 }} />

                {/* Max-width content shell */}
                <div style={{ maxWidth:1440, margin:'0 auto', minHeight:'100vh', position:'relative', zIndex:1 }}>

                <div className="content-row" style={{ minHeight:'100vh', display:'flex', flexDirection:'row', alignItems:'stretch' }}>

                    {/* ── LEFT ── */}
                    <div className="left-col" style={{ flex:'0 0 25%', display:'flex', flexDirection:'column', justifyContent:'flex-start', padding:'44px 0 44px 68px', position:'relative' }}>

                        {/* Logo */}
                        <div>
                            <span style={{ fontFamily:"'Montserrat',sans-serif", fontWeight:900, fontSize:34, WebkitTextStroke:'1px #fff', color:'transparent', display:'block', marginBottom:32, letterSpacing:'1px' }}>CMS-UP</span>
                            <div className="left-text" style={{ maxWidth:311 }}>
                                <h1 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:34, lineHeight:1.1, color:'#fff', marginBottom:8 }}>Una Vez más</h1>
                                <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:400, fontSize:24, color:'#fff', marginBottom:24 }}>Bienvenidxs</h2>
                                <p style={{ fontFamily:"'Poppins',sans-serif", fontWeight:300, fontSize:13, color:'#fff', lineHeight:1.6 }}>
                                    A Celumovil Store S.A.S la empresa más chimba del mundo, recuerda siempre #Hazlo a tu manera!
                                </p>
                            </div>
                        </div>



                        {/* User cards — anchored just below the pink/white boundary */}
                        {recentUsers.length > 0 && (
                            <div className="users-section" style={{ position:'absolute', top:'56%', left:68, right:0 }}>
                                <p style={{ fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:15, color:'#333', marginBottom:16 }}>Inicia sesión como:</p>
                                <div style={{ display:'flex', flexDirection:'row', gap:16, flexWrap:'nowrap' }}>
                                    {recentUsers.slice(0, 3).map((u) => {
                                        // Truncar nombre: "Cristian Ricaurte Ricaurte" → "Cristian R."
                                        const parts = (u.name || '').trim().split(' ');
                                        const shortName = parts.length > 1 
                                            ? `${parts[0]} ${parts[1].charAt(0)}.`
                                            : parts[0];
                                        return (
                                        <div key={u.email} className="ucard" onClick={() => selectRecent(u)}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeRecent(u.email); }}
                                                style={{ position:'absolute', top:6, right:6, background:'none', border:'none', fontSize:14, color:'#bbb', cursor:'pointer', padding:2, lineHeight:1 }}
                                            >
                                                &times;
                                            </button>
                                            <div style={{ width:50, height:50, borderRadius:'50%', background:'linear-gradient(135deg, #f8bbd0, #f48fb1)', boxShadow:'0 4px 10px rgba(0,0,0,.08)', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:18, color:'#fff' }}>
                                                {u.initials || u.name.substring(0,2).toUpperCase()}
                                            </div>
                                            <p style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:12, color:'#111', textAlign:'center', lineHeight:1.2, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', width:'100%', maxWidth:'100%' }}>{shortName}</p>
                                            <p style={{ fontFamily:"'Roboto',sans-serif", fontWeight:400, fontSize:10, color:'#9e9e9e', textAlign:'center' }}>{u.status}</p>
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── CENTER: Rocket ── */}
                    <div className="rocket-col" style={{ flex:'0 0 27%', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'4%', overflow:'visible', pointerEvents:'none', zIndex:5 }}>
                        <img src="/images/Saly-1.png" alt="Saly en Cohete" className="saly"
                            style={{ width:385, height:385, objectFit:'contain', filter:'drop-shadow(0 20px 40px rgba(0,0,0,.18))' }} />
                    </div>

                    {/* ── RIGHT: Login Card ── */}
                    <div className="right-col" style={{ flex:'0 0 48%', display:'flex', alignItems:'center', justifyContent:'center', padding:'28px 44px 28px 12px' }}>
                        <div className="login-card" style={{ background:'#fff', borderRadius:40, width:'100%', maxWidth:539, minHeight:741, padding:'64px 44px', boxShadow:'0 4px 35px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column' }}>

                            <p style={{ fontFamily:"'Roboto',sans-serif", fontWeight:400, fontSize:21, lineHeight:1.0, color:'#000000', marginBottom:8 }}>Bienvenido Celuworker</p>
                            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:500, fontSize:55, lineHeight:1.0, letterSpacing:0, color:'#000000', marginBottom:32 }}>Inicia sesión</h2>

                            {status && <div style={{ marginBottom:14, fontSize:13, color:'#16a34a', background:'#f0fdf4', padding:'10px 14px', borderRadius:10, border:'1px solid #bbf7d0' }}>{status}</div>}
                            {flash.error && <div style={{ marginBottom:14, fontSize:13, color:'#dc2626', background:'#fef2f2', padding:'10px 14px', borderRadius:10, border:'1px solid #fecaca' }}>{flash.error}</div>}

                            {/* Google */}
                            <a href={route('auth.google')} className="google-btn" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, width:'100%', height:55, background:'#E9F1FF', border:'none', borderRadius:9, fontFamily:"'Poppins',sans-serif", fontWeight:400, fontSize:16, color:'#4285f4', cursor:'pointer', marginBottom:48, transition:'background .2s', textDecoration: 'none' }}
                                onMouseOver={e=>(e.currentTarget.style.background='#dceeff')} onMouseOut={e=>(e.currentTarget.style.background='#eaf2ff')}>
                                <img src="/images/google.png" alt="Google" style={{ width:20, height:20 }} />
                                Inicia con tu correo coorporativo
                            </a>

                            {/* Form — no flex:1 so it stays compact */}
                            <form onSubmit={submit}>
                                <label style={{ fontFamily:"'Poppins',sans-serif", fontWeight:400, fontSize:16, color:'#000000', display:'block', marginBottom:10 }}>Ingresa tu nombre de usuario</label>
                                <input id="email" type="email" name="email" value={data.email} placeholder="Usuario o correo" className="inp inp-blue"
                                    onChange={e => setData('email', e.target.value)} style={{ marginBottom:4 }} />
                                <InputError message={errors.email} />

                                <label style={{ fontFamily:"'Poppins',sans-serif", fontWeight:400, fontSize:16, color:'#000000', display:'block', marginBottom:10, marginTop:24 }}>Ingresa tu contraseña</label>
                                <input id="password" type="password" name="password" value={data.password} placeholder="Escribe tu contraseña" className="inp"
                                    onChange={e => setData('password', e.target.value)} style={{ marginBottom:4 }} />
                                <InputError message={errors.password} />

                                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12, marginBottom:48 }}>
                                    {canResetPassword !== false && (
                                        <Link href={route('password.request')} style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:'#4285f4', textDecoration:'none' }}>
                                            Olvidates tu contraseña?
                                        </Link>
                                    )}
                                </div>

                                <button type="submit" disabled={processing}
                                    style={{ display:'block', width:'100%', height:54, background:'#E72380', color:'#fff', border:'none', borderRadius:35, fontFamily:"'Montserrat',sans-serif", fontWeight:500, fontSize:16, cursor:processing?'not-allowed':'pointer', opacity:processing?.75:1, boxShadow:'0 12px 28px rgba(231,35,128,.32)', letterSpacing:'.3px', transition:'background .2s' }}
                                    onMouseOver={e=>{ if(!processing) e.currentTarget.style.background='#c91c6e'; }}
                                    onMouseOut={e=>{ e.currentTarget.style.background='#E72380'; }}>
                                    Vamos a darle!
                                </button>
                            </form>
                        </div>
                    </div>

                </div>{/* end content-row */}
                </div>{/* end max-width shell */}
            </div>
        </>
    );
}
