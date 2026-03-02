'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/lib/firebase';
import { Poppins } from 'next/font/google';
import {
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { ArrowRight, Github, Linkedin, Instagram, Eye, EyeOff } from 'lucide-react';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(6deg)} }
  @keyframes floatC  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.7)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes pop     { from{opacity:0;transform:scale(.88) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }

  .card-in   { animation: fadeUp .55s cubic-bezier(.22,1,.36,1) .05s both; }
  .float-a   { animation: float  5s ease-in-out infinite; }
  .float-b   { animation: floatB 7s ease-in-out infinite; }
  .float-c   { animation: floatC 4.5s ease-in-out infinite; }

  .auth-input {
    width:100%; box-sizing:border-box;
    font-family:'DM Sans',sans-serif; font-size:14px; color:#1e293b;
    background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px;
    padding:11px 14px; outline:none;
    transition:border-color .2s,box-shadow .2s,background .2s;
  }
  .auth-input:focus {
    border-color:#22c55e; background:#fff;
    box-shadow:0 0 0 3px rgba(34,197,94,.1);
  }
  .auth-input::placeholder { color:#94a3b8; }

  .auth-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    background:linear-gradient(135deg,#22c55e,#16a34a);
    color:#fff; border:none; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14.5px; font-weight:700;
    padding:12px 20px; cursor:pointer;
    box-shadow:0 4px 14px rgba(34,197,94,.35);
    transition:transform .15s,box-shadow .2s,opacity .2s;
  }
  .auth-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(34,197,94,.45); }
  .auth-btn:active:not(:disabled) { transform:scale(.97); }
  .auth-btn:disabled { opacity:.6; cursor:not-allowed; }

  .google-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
    background:#fff; color:#374151;
    border:1.5px solid #e2e8f0; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
    padding:11px 20px; cursor:pointer;
    transition:border-color .2s,box-shadow .2s,background .2s;
    box-shadow:0 1px 4px rgba(0,0,0,.06);
  }
  .google-btn:hover { border-color:#86efac; background:#f0fdf4; }

  .toggle-link {
    color:#16a34a; font-weight:600; cursor:pointer; background:none; border:none;
    font-family:'DM Sans',sans-serif; font-size:13px;
    text-decoration:underline; text-underline-offset:2px;
    transition:color .15s;
  }
  .toggle-link:hover { color:#15803d; }

  .social-btn {
    width:36px; height:36px; border-radius:50%;
    background:rgba(255,255,255,.8); border:1px solid #e2e8f0;
    display:flex; align-items:center; justify-content:center;
    color:#64748b; transition:background .2s,color .2s,transform .15s;
    backdrop-filter:blur(4px);
  }
  .social-btn:hover { background:#22c55e; color:#fff; transform:translateY(-2px); }

  .success-msg { animation:pop .3s cubic-bezier(.22,1,.36,1) both; }
  .spinner {
    width:16px; height:16px; border:2px solid rgba(255,255,255,.35);
    border-top-color:#fff; border-radius:50%;
    animation:spin .7s linear infinite; flex-shrink:0;
  }
`;

// ── Medical SVG Background ─────────────────────────────────────────────────
function MedicalBackground() {
  return (
    <svg
      style={{ position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none' }}
      viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%"  stopColor="#f0fdf4"/>
          <stop offset="45%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#ecfdf5"/>
        </linearGradient>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#86efac" stopOpacity=".28"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity=".1"/>
        </linearGradient>
        <radialGradient id="ga" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity=".13"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="gb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#86efac" stopOpacity=".16"/>
          <stop offset="100%" stopColor="#86efac" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#bg)"/>
      <ellipse cx="180"  cy="180" rx="280" ry="220" fill="url(#gb)"/>
      <ellipse cx="1320" cy="720" rx="260" ry="200" fill="url(#ga)"/>
      <ellipse cx="1100" cy="160" rx="200" ry="170" fill="url(#gb)" opacity=".6"/>

      {/* Pills */}
      <rect x="60"  y="110" width="100" height="40" rx="20" fill="url(#pg)" stroke="#86efac" strokeWidth="1.5" opacity=".7"/>
      <line x1="110" y1="110" x2="110" y2="150" stroke="#86efac" strokeWidth="1.2" opacity=".5"/>
      <rect x="1280" y="730" width="100" height="38" rx="19" fill="url(#pg)" stroke="#86efac" strokeWidth="1.5" opacity=".6"/>
      <line x1="1330" y1="730" x2="1330" y2="768" stroke="#86efac" strokeWidth="1.2" opacity=".4"/>
      <rect x="900"  y="820" width="78" height="30" rx="15" fill="#dcfce7" stroke="#86efac" strokeWidth="1" opacity=".5"/>
      <rect x="1360" y="290" width="58" height="22" rx="11" fill="#dcfce7" stroke="#86efac" strokeWidth="1" opacity=".5"/>
      <rect x="160"  y="780" width="65" height="26" rx="13" fill="#dcfce7" stroke="#86efac" strokeWidth="1" opacity=".45"/>

      {/* Heartbeat */}
      <polyline points="100,75 140,75 155,45 170,105 190,55 210,75 260,75 275,62 290,92 305,75 360,75"
        stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".22"/>

      {/* DNA helix */}
      {[0,1,2,3,4,5,6,7,8].map(i=>(
        <g key={i} opacity=".17">
          <circle cx={1395+Math.sin(i*.8)*16} cy={180+i*52} r="4.5" fill="#22c55e"/>
          <circle cx={1395-Math.sin(i*.8)*16} cy={180+i*52} r="4.5" fill="#86efac"/>
          <line x1={1395+Math.sin(i*.8)*16} y1={180+i*52} x2={1395-Math.sin(i*.8)*16} y2={180+i*52}
            stroke="#86efac" strokeWidth="1"/>
        </g>
      ))}

      {/* Molecule cluster */}
      <g opacity=".15">
        <circle cx="115" cy="630" r="10" fill="#22c55e"/>
        <circle cx="152" cy="602" r="7"  fill="#86efac"/>
        <circle cx="152" cy="658" r="7"  fill="#86efac"/>
        <circle cx="78"  cy="602" r="6"  fill="#4ade80"/>
        <line x1="115" y1="630" x2="152" y2="602" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="115" y1="630" x2="152" y2="658" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="115" y1="630" x2="78"  y2="602" stroke="#22c55e" strokeWidth="1.5"/>
      </g>

      {/* Medical crosses */}
      {[[1180,55,16],[200,760,13],[1080,400,10],[420,840,11],[1220,110,9]].map(([x,y,s],i)=>(
        <g key={i} opacity=".14">
          <rect x={x+s*.3} y={y}      width={s*.4} height={s} rx={s*.15} fill="#22c55e"/>
          <rect x={x}      y={y+s*.3} width={s}   height={s*.4} rx={s*.15} fill="#22c55e"/>
        </g>
      ))}

      {/* Stethoscope */}
      <g transform="translate(1260,570)" opacity=".1" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M20 10C20 10 20 50 50 60C80 70 100 50 100 30C100 10 80 0 60 10"/>
        <path d="M60 10L60 80"/>
        <circle cx="60" cy="90" r="12" fill="#22c55e" stroke="#22c55e" opacity=".5"/>
        <path d="M20 10C0 10 0 40 20 40"/>
      </g>

      {/* Dot grid */}
      {Array.from({length:10}).map((_,r)=>Array.from({length:18}).map((_,c)=>(
        <circle key={`${r}-${c}`} cx={c*85+42} cy={r*95+48} r="1.5" fill="#22c55e" opacity=".05"/>
      )))}
    </svg>
  );
}

export default function LoginPage() {
  const [email,         setEmail]         = useState('');
  const [password,      setPassword]      = useState('');
  const [showPwd,       setShowPwd]       = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showReset,     setShowReset]     = useState(false);
  const [message,       setMessage]       = useState('');
  const [error,         setError]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { if (u) router.push('/dashboard'); });
    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    setError(''); setLoading(true);
    try { await signInWithPopup(auth, provider); router.push('/dashboard'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    try {
      if (isRegistering) await createUserWithEmailAndPassword(auth, email, password);
      else                await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault(); setError(''); setMessage(''); setLoading(true);
    if (!email) { setError('Please enter your email first.'); setLoading(false); return; }
    try { await sendPasswordResetEmail(auth, email); setMessage('Reset link sent! Check your inbox.'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{css}</style>

      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        style={{ fontFamily:"'DM Sans',sans-serif" }}>

        <MedicalBackground />

        {/* Floating emoji */}
        <span className="float-a" style={{position:'absolute',top:130,right:'10%',fontSize:36,zIndex:1,pointerEvents:'none',opacity:.55}}>💊</span>
        <span className="float-b" style={{position:'absolute',top:240,left:'7%', fontSize:28,zIndex:1,pointerEvents:'none',opacity:.5}}>🩺</span>
        <span className="float-c" style={{position:'absolute',bottom:160,right:'7%',fontSize:24,zIndex:1,pointerEvents:'none',opacity:.45}}>🔬</span>

        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full flex items-center px-6 py-4 z-10">
          <div className={`text-2xl font-extrabold ${poppins.className} cursor-pointer`}
            onClick={() => router.push('/')}>
            <span className="text-green-500">MedHe</span>
            <span className="text-gray-900">alth.ai</span>
          </div>
        </div>

        {/* ── Auth Card ─────────────────────────────────────────── */}
        <div className="card-in relative z-10 w-full mx-4" style={{
          maxWidth: 400,
          background:'rgba(255,255,255,.97)',
          border:'1.5px solid #e2e8f0',
          borderRadius:22,
          padding:'32px 28px',
          boxShadow:'0 12px 48px rgba(0,0,0,.1),0 2px 8px rgba(34,197,94,.08)',
          backdropFilter:'blur(8px)',
        }}>

          {/* Card header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
  {/* Logo + Brand */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      marginBottom: 16,
      cursor: "pointer",
    }}
    onClick={() => router.push("/")}
  >
    {/* Icon Circle */}
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#22c55e,#16a34a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <rect x="9.5" y="2" width="5" height="20" rx="1.5" />
        <rect x="2" y="9.5" width="20" height="5" rx="1.5" />
      </svg>
    </div>

    {/* Brand Text */}
    <div className={`text-2xl font-extrabold ${poppins.className}`}>
      <span className="text-green-500">MedHe</span>
      <span className="text-gray-900">alth.ai</span>
    </div>
  </div>

  {/* Heading */}
  <h1
    className={poppins.className}
    style={{
      fontSize: 20,
      fontWeight: 700,
      color: "#0f172a",
      marginBottom: 5,
    }}
  >
    {showReset
      ? "Reset Password"
      : isRegistering
      ? "Create Account"
      : "Welcome Back"}
  </h1>

  {/* Subtext */}
  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>
    {showReset
      ? "Enter your email and we'll send a reset link"
      : isRegistering
      ? "Sign up to get started with MedHealth.ai"
      : "Sign in to your MedHealth.ai account"}
  </p>
</div>

          {/* ── Email / Password form ────────────────────────── */}
          {!showReset ? (
            <form onSubmit={handleEmailSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#64748b',
                  textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>
                  Email
                </label>
                <input className="auth-input" type="email" value={email}
                  onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" required/>
              </div>

              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                  <label style={{fontSize:11.5,fontWeight:700,color:'#64748b',
                    textTransform:'uppercase',letterSpacing:'.06em'}}>
                    Password
                  </label>
                  {!isRegistering && (
                    <button type="button" className="toggle-link"
                      style={{fontSize:11.5,textDecoration:'none',color:'#94a3b8'}}
                      onClick={()=>{setShowReset(true);setError('');setMessage('');}}>
                      Forgot?
                    </button>
                  )}
                </div>
                <div style={{position:'relative'}}>
                  <input className="auth-input" type={showPwd?'text':'password'}
                    value={password} onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••" required style={{paddingRight:42}}/>
                  <button type="button" onClick={()=>setShowPwd(v=>!v)}
                    style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',
                      background:'none',border:'none',cursor:'pointer',color:'#94a3b8',
                      display:'flex',padding:0,lineHeight:0}}>
                    {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-btn" disabled={loading} style={{marginTop:4}}>
                {loading
                  ? <><span className="spinner"/>Processing…</>
                  : <>{isRegistering?'Create Account':'Sign In'}<ArrowRight size={15}/></>}
              </button>
            </form>
          ) : (
            /* ── Reset form ───────────────────────────────── */
            <form onSubmit={handlePasswordReset} style={{display:'flex',flexDirection:'column',gap:12}}>
              <div>
                <label style={{display:'block',fontSize:11.5,fontWeight:700,color:'#64748b',
                  textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>
                  Email
                </label>
                <input className="auth-input" type="email" value={email}
                  onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" required/>
              </div>
              <button type="submit" className="auth-btn" disabled={loading} style={{marginTop:4}}>
                {loading
                  ? <><span className="spinner"/>Sending…</>
                  : <>Send Reset Link <ArrowRight size={15}/></>}
              </button>
            </form>
          )}

          {/* Status */}
          {error && (
            <div style={{marginTop:12,background:'#fff1f2',border:'1.5px solid #fca5a5',
              borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',gap:8,
              fontSize:13,color:'#be123c',fontFamily:"'DM Sans',sans-serif"}}>
              ⚠️ {error}
            </div>
          )}
          {message && (
            <div className="success-msg" style={{marginTop:12,background:'#f0fdf4',
              border:'1.5px solid #86efac',borderRadius:10,padding:'10px 14px',
              display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#15803d',
              fontFamily:"'DM Sans',sans-serif"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {message}
            </div>
          )}

          {/* Toggle links */}
          <div style={{textAlign:'center',marginTop:16,fontSize:13,color:'#64748b',lineHeight:2}}>
            {!showReset ? (
              <p>
                {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                <button className="toggle-link"
                  onClick={()=>{setIsRegistering(v=>!v);setError('');setMessage('');}}>
                  {isRegistering ? 'Sign In' : 'Register'}
                </button>
              </p>
            ) : (
              <p>
                Remember it?{' '}
                <button className="toggle-link"
                  onClick={()=>{setShowReset(false);setError('');setMessage('');}}>
                  Back to Login
                </button>
              </p>
            )}
          </div>

          {/* Google */}
          {!showReset && (
            <>
              <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0 12px'}}>
                <div style={{flex:1,height:1,background:'#f1f5f9'}}/>
                <span style={{fontSize:12,color:'#94a3b8',fontWeight:500,whiteSpace:'nowrap'}}>or continue with</span>
                <div style={{flex:1,height:1,background:'#f1f5f9'}}/>
              </div>

              <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                <img src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                  alt="Google" style={{width:18,height:18,borderRadius:'50%',background:'#fff',padding:1}}/>
                Continue with Google
              </button>
            </>
          )}
        </div>

        {/* Social icons */}
        <div className="absolute bottom-6 right-6 flex gap-3 z-10">
          {[
            {icon:<Github size={15}/>,    href:'#'},
            {icon:<Linkedin size={15}/>,  href:'https://linkedin.com/in/yourprofile'},
            {icon:<Instagram size={15}/>, href:'https://instagram.com/yourhandle'},
          ].map(({icon,href},i)=>(
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="social-btn">
              {icon}
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="absolute bottom-6 left-6 z-10"
          style={{fontSize:11,color:'#94a3b8',fontFamily:"'DM Sans',sans-serif"}}>
          Not a substitute for professional medical advice.
        </p>
      </div>
    </>
  );
}