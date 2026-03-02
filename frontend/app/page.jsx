"use client";

import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { ArrowRight, LogIn, Github, Linkedin, Instagram } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(6deg)} }
  @keyframes floatC  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(-5deg)} }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.7)} }
  @keyframes gradShift {
    0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
  }
  @keyframes slideArrow { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
  @keyframes blob1 {
    0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
    50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
  }
  @keyframes blob2 {
    0%,100%{border-radius:40% 60% 60% 40%/40% 50% 60% 50%}
    50%{border-radius:60% 40% 40% 60%/60% 40% 50% 40%}
  }
  @keyframes rotateSlow { to{transform:rotate(360deg)} }
  @keyframes dash {
    to { stroke-dashoffset: 0; }
  }

  .lp-fade1 { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .1s both; }
  .lp-fade2 { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .22s both; }
  .lp-fade3 { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .34s both; }
  .lp-fade4 { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) .46s both; }

  .float-a { animation: float  5s ease-in-out infinite; }
  .float-b { animation: floatB 7s ease-in-out infinite; }
  .float-c { animation: floatC 6s ease-in-out infinite; }
  .float-d { animation: float  4.5s ease-in-out 1s infinite; }

  .grad-text {
    background: linear-gradient(135deg,#22c55e 0%,#16a34a 50%,#4ade80 100%);
    background-size:200% 200%;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation: gradShift 4s ease infinite;
  }

  .get-btn {
    display:inline-flex; align-items:center; gap:9px;
    background:linear-gradient(135deg,#22c55e,#16a34a);
    color:#fff; border:none; border-radius:14px;
    font-family:'DM Sans',sans-serif; font-size:16px; font-weight:700;
    padding:14px 32px; cursor:pointer;
    box-shadow:0 6px 24px rgba(34,197,94,.4);
    transition:transform .15s,box-shadow .2s;
  }
  .get-btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(34,197,94,.5); }
  .get-btn:hover .btn-arrow { animation:slideArrow 1s ease-in-out infinite; }
  .get-btn:active { transform:scale(.97); }

  .login-btn {
    display:inline-flex; align-items:center; gap:7px;
    background:#fff; color:#16a34a;
    border:1.5px solid #86efac; border-radius:10px;
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
    padding:8px 18px; cursor:pointer;
    transition:background .2s,box-shadow .2s,transform .15s;
    box-shadow:0 2px 8px rgba(34,197,94,.12);
  }
  .login-btn:hover { background:#f0fdf4; transform:translateY(-1px); box-shadow:0 4px 14px rgba(34,197,94,.2); }

  .social-btn {
    width:38px; height:38px; border-radius:50%;
    background:rgba(255,255,255,.85); border:1px solid #e2e8f0;
    display:flex; align-items:center; justify-content:center;
    color:#64748b; transition:background .2s,color .2s,transform .15s,box-shadow .2s;
    backdrop-filter:blur(4px);
  }
  .social-btn:hover {
    background:#22c55e; color:#fff;
    transform:translateY(-2px); box-shadow:0 4px 12px rgba(34,197,94,.35);
  }

  .stat-chip {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,.85); border:1px solid #dcfce7;
    border-radius:12px; padding:9px 14px;
    font-family:'DM Sans',sans-serif; font-size:13px;
    backdrop-filter:blur(6px);
    box-shadow:0 2px 8px rgba(0,0,0,.06);
  }
`;

// ── Medical SVG Background ───────────────────────────────────────────────────
function MedicalBackground() {
  return (
    <svg
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }}
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base gradient */}
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f0fdf4"/>
          <stop offset="45%"  stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#ecfdf5"/>
        </linearGradient>
        <linearGradient id="crossGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity=".18"/>
          <stop offset="100%" stopColor="#16a34a" stopOpacity=".08"/>
        </linearGradient>
        <linearGradient id="pillGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#86efac" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity=".12"/>
        </linearGradient>
        <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity=".12"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#86efac" stopOpacity=".15"/>
          <stop offset="100%" stopColor="#86efac" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#bgGrad)"/>

      {/* Glow blobs */}
      <ellipse cx="200"  cy="200" rx="280" ry="220" fill="url(#glowB)"/>
      <ellipse cx="1280" cy="700" rx="260" ry="200" fill="url(#glowA)"/>
      <ellipse cx="1100" cy="160" rx="200" ry="180" fill="url(#glowB)" opacity=".6"/>

      {/* ── Large decorative medical cross — top right ────────── */}
      <g opacity=".18" transform="translate(1180,60)">
        <rect x="30" y="0"  width="40" height="100" rx="8" fill="#22c55e"/>
        <rect x="0"  y="30" width="100" height="40" rx="8" fill="#22c55e"/>
      </g>

      {/* ── Pill shapes scattered ─────────────────────────────── */}
      {/* Top left pill */}
      <rect x="60" y="120" width="110" height="44" rx="22" fill="url(#pillGrad)" stroke="#86efac" strokeWidth="1.5" opacity=".7"/>
      <line x1="115" y1="120" x2="115" y2="164" stroke="#86efac" strokeWidth="1.2" opacity=".5"/>

      {/* Bottom right pill */}
      <rect x="1270" y="720" width="110" height="44" rx="22" fill="url(#pillGrad)" stroke="#86efac" strokeWidth="1.5" opacity=".6"/>
      <line x1="1325" y1="720" x2="1325" y2="764" stroke="#86efac" strokeWidth="1.2" opacity=".4"/>

      {/* Small pills */}
      <rect x="900"  y="820" width="80" height="32" rx="16" fill="#dcfce7" stroke="#86efac" strokeWidth="1" opacity=".5"/>
      <rect x="160"  y="780" width="70" height="28" rx="14" fill="#dcfce7" stroke="#86efac" strokeWidth="1" opacity=".45"/>
      <rect x="1350" y="300" width="60" height="24" rx="12" fill="#dcfce7" stroke="#86efac" strokeWidth="1" opacity=".5"/>

      {/* ── Stethoscope outline — bottom left ─────────────────── */}
      <g transform="translate(50,580)" opacity=".13" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M20 10 C20 10 20 50 50 60 C80 70 100 50 100 30 C100 10 80 0 60 10"/>
        <path d="M60 10 L60 80"/>
        <circle cx="60" cy="90" r="12" fill="#22c55e" stroke="#22c55e" opacity=".6"/>
        <path d="M20 10 C0 10 0 40 20 40"/>
      </g>

      {/* ── DNA / helix dots — right side ─────────────────────── */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <g key={i} opacity=".2">
          <circle cx={1380 + Math.sin(i * .8) * 18} cy={200 + i * 55} r="5" fill="#22c55e"/>
          <circle cx={1380 - Math.sin(i * .8) * 18} cy={200 + i * 55} r="5" fill="#86efac"/>
          <line
            x1={1380 + Math.sin(i * .8) * 18} y1={200 + i * 55}
            x2={1380 - Math.sin(i * .8) * 18} y2={200 + i * 55}
            stroke="#86efac" strokeWidth="1"
          />
        </g>
      ))}

      {/* ── Heartbeat / ECG line — top center ─────────────────── */}
      <polyline
        points="520,80 560,80 575,50 590,110 610,60 630,80 680,80 695,65 710,95 725,80 780,80"
        stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".25"
      />

      {/* ── Molecule dots — top left ───────────────────────────── */}
      <g opacity=".18">
        <circle cx="120" cy="340" r="10" fill="#22c55e"/>
        <circle cx="160" cy="310" r="7"  fill="#86efac"/>
        <circle cx="160" cy="370" r="7"  fill="#86efac"/>
        <circle cx="80"  cy="310" r="6"  fill="#4ade80"/>
        <line x1="120" y1="340" x2="160" y2="310" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="120" y1="340" x2="160" y2="370" stroke="#22c55e" strokeWidth="1.5"/>
        <line x1="120" y1="340" x2="80"  y2="310" stroke="#22c55e" strokeWidth="1.5"/>
      </g>

      {/* ── Small medical crosses ──────────────────────────────── */}
      {[[200,700,14],[1100,400,10],[400,820,12],[1250,120,10],[700,40,11]].map(([x,y,s],i) => (
        <g key={i} opacity=".15">
          <rect x={x+s*.3} y={y}     width={s*.4} height={s} rx={s*.15} fill="#22c55e"/>
          <rect x={x}      y={y+s*.3} width={s} height={s*.4} rx={s*.15} fill="#22c55e"/>
        </g>
      ))}

      {/* ── Microscope outline — bottom right ─────────────────── */}
      <g transform="translate(1310,600)" opacity=".12" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <ellipse cx="40" cy="20" rx="18" ry="20"/>
        <line x1="40" y1="40" x2="40" y2="90"/>
        <line x1="20" y1="90" x2="60" y2="90"/>
        <line x1="30" y1="70" x2="50" y2="70"/>
        <rect x="30" y="8" width="20" height="14" rx="3" fill="#dcfce7" stroke="#86efac" opacity=".5"/>
      </g>

      {/* Subtle grid dots */}
      {Array.from({length:12}).map((_,row) =>
        Array.from({length:20}).map((_,col) => (
          <circle key={`${row}-${col}`}
            cx={col * 80 + 40} cy={row * 80 + 40}
            r="1.5" fill="#22c55e" opacity=".06"
          />
        ))
      )}
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const goToLogin = () => router.push("/login");

  return (
    <>
      <style>{css}</style>

      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">

        {/* SVG Medical Background */}
        <MedicalBackground />

        {/* Floating decorative elements */}
        <span className="float-a" style={{ position:'absolute', top:140, right:'12%', fontSize:40, zIndex:1, pointerEvents:'none', opacity:.6 }}>💊</span>
        <span className="float-b" style={{ position:'absolute', top:260, left:'8%',  fontSize:32, zIndex:1, pointerEvents:'none', opacity:.55 }}>🩺</span>
        <span className="float-c" style={{ position:'absolute', bottom:180, right:'8%', fontSize:28, zIndex:1, pointerEvents:'none', opacity:.5 }}>🔬</span>
        <span className="float-d" style={{ position:'absolute', bottom:220, left:'12%', fontSize:24, zIndex:1, pointerEvents:'none', opacity:.45 }}>🧬</span>

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
          <div className={`text-2xl font-extrabold ${poppins.className}`}>
            <span className="text-green-500">MedHe</span>
            <span className="text-gray-900">alth.ai</span>
          </div>

          <button className="login-btn" onClick={goToLogin}>
            <LogIn size={16} />
            Login
          </button>
        </div>

        {/* ── Hero content ─────────────────────────────────────────── */}
        <div className="relative z-10 max-w-3xl w-full text-center px-6">

          {/* Badge */}
          <div className="lp-fade1 flex justify-center mb-5">
            <div style={{
              display:'inline-flex', alignItems:'center', gap:7,
              background:'rgba(240,253,244,.9)', border:'1px solid #bbf7d0',
              borderRadius:99, padding:'6px 16px',
              fontSize:13, fontWeight:600, color:'#15803d',
              backdropFilter:'blur(6px)',
              fontFamily:"'DM Sans',sans-serif",
            }}>
              <span style={{ width:8, height:8, background:'#22c55e', borderRadius:'50%', display:'inline-block', animation:'pulse-dot 2s infinite' }} />
              AI-Powered Health Platform · Free to Use
            </div>
          </div>

          {/* Headline */}
          <h1 className={`lp-fade2 ${poppins.className}`} style={{
            fontSize:'clamp(36px,7vw,68px)', fontWeight:700,
            lineHeight:1.1, color:'#0f172a', marginBottom:16,
          }}>
            Welcome to{' '}
            <span className="grad-text">MedHe</span>
            <span style={{ color:'#0f172a' }}>alth.ai</span>
          </h1>

          {/* Sub-headline */}
          <p className="lp-fade3" style={{
            fontSize:'clamp(16px,2.5vw,20px)', fontWeight:600,
            color:'#374151', marginBottom:12,
            fontFamily:"'DM Sans',sans-serif",
          }}>
            Your Trusted Partner in Smarter, AI-Powered Healthcare
          </p>

          <p className="lp-fade3" style={{
            fontSize:'clamp(14px,2vw,16px)', color:'#64748b',
            lineHeight:1.75, maxWidth:540, margin:'0 auto 36px',
            fontFamily:"'DM Sans',sans-serif",
          }}>
            Using advanced AI, we help you understand, track, and manage your medicines — with confidence and ease.
          </p>

          {/* CTA */}
          <div className="lp-fade4" style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap', marginBottom:40 }}>
            <button className="get-btn" onClick={goToLogin}>
              Get Started
              <ArrowRight className="btn-arrow" size={18} />
            </button>
          </div>

          {/* Stat chips */}
          <div className="lp-fade4" style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
            {[
              { icon:'📄', label:'10K+ Prescriptions Analysed' },
              { icon:'💊', label:'500+ Medicines' },
              { icon:'🔒', label:'100% Secure' },
            ].map((s,i) => (
              <div key={i} className="stat-chip">
                <span style={{fontSize:16}}>{s.icon}</span>
                <span style={{fontWeight:600, color:'#374151'}}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Social icons — bottom right ───────────────────────── */}
        <div className="absolute bottom-6 right-6 flex gap-3 z-10">
          {[
            { icon:<Github size={16}/>,    href:'#' },
            { icon:<Linkedin size={16}/>,  href:'https://linkedin.com/in/yourprofile' },
            { icon:<Instagram size={16}/>, href:'https://instagram.com/yourhandle' },
          ].map(({icon,href},i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="social-btn">
              {icon}
            </a>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="absolute bottom-6 left-6 text-xs text-gray-400 z-10" style={{ fontFamily:"'DM Sans',sans-serif" }}>
          Not a substitute for professional medical advice.
        </p>
      </div>
    </>
  );
}