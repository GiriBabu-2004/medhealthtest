'use client';

import { useEffect, useState } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-12px) rotate(4deg); }
  }
  @keyframes floatB {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-16px) rotate(-5deg); }
  }
  @keyframes floatC {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-9px); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(1.6); }
  }
  @keyframes scroll-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes gradShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes slideArrow {
    0%,100% { transform: translateX(0); }
    50%      { transform: translateX(5px); }
  }
  @keyframes blob1 {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes blob2 {
    0%,100% { border-radius: 40% 60% 60% 40% / 40% 50% 60% 50%; }
    50%      { border-radius: 60% 40% 40% 60% / 60% 40% 50% 40%; }
  }
  @keyframes countUp {
    from { opacity:0; transform:scale(.7) translateY(8px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }

  .hero-fade-1 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .05s both; }
  .hero-fade-2 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .18s both; }
  .hero-fade-3 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .30s both; }
  .hero-fade-4 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .42s both; }
  .hero-fade-5 { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) .54s both; }

  .float-a { animation: float  5s ease-in-out infinite; }
  .float-b { animation: floatB 6.5s ease-in-out infinite; }
  .float-c { animation: floatC 4.5s ease-in-out infinite; }

  .grad-text {
    background: linear-gradient(135deg,#22c55e 0%,#16a34a 50%,#4ade80 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradShift 4s ease infinite;
  }

  .try-btn {
    display: inline-flex; align-items: center; gap: 9px;
    background: linear-gradient(135deg,#22c55e,#16a34a);
    color: #fff; border: none; border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 700;
    padding: 14px 32px; cursor: pointer;
    box-shadow: 0 6px 24px rgba(34,197,94,.4);
    transition: transform .15s, box-shadow .2s;
  }
  .try-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(34,197,94,.5);
  }
  .try-btn:hover .btn-arrow { animation: slideArrow 1s ease-in-out infinite; }
  .try-btn:active { transform: scale(.97); }

  .ghost-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #fff; color: #374151;
    border: 1.5px solid #e2e8f0; border-radius: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px; font-weight: 600;
    padding: 13px 28px; cursor: pointer;
    transition: border-color .2s, box-shadow .2s, transform .15s;
  }
  .ghost-btn:hover {
    border-color: #86efac;
    box-shadow: 0 4px 16px rgba(34,197,94,.12);
    transform: translateY(-1px);
  }

  .stat-pill {
    display: flex; align-items: center; gap: 10px;
    background: #fff; border: 1.5px solid #e2e8f0;
    border-radius: 14px; padding: 11px 16px;
    font-family: 'DM Sans', sans-serif;
    transition: border-color .2s, box-shadow .2s;
  }
  .stat-pill:hover { border-color: #bbf7d0; box-shadow: 0 4px 16px rgba(34,197,94,.1); }

  /* Feedback scroll */
  .scroll-track {
    display: flex;
    gap: 18px;
    width: max-content;
    animation: scroll-left 32s linear infinite;
  }
  .scroll-track:hover { animation-play-state: paused; }

  .feedback-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    padding: 18px 20px;
    width: 280px;
    flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
    transition: border-color .2s, box-shadow .2s, transform .2s;
    cursor: default;
  }
  .feedback-card:hover {
    border-color: #86efac;
    box-shadow: 0 6px 24px rgba(34,197,94,.12);
    transform: translateY(-3px);
  }

  /* Fade edges on scroll container */
  .scroll-mask {
    -webkit-mask-image: linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);
    mask-image: linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);
  }
`;

// ── Floating decorative blobs ─────────────────────────────────────────────────
const BlobDecor = () => (
  <>
    <div style={{
      position:'absolute', top:60, right:'8%', width:180, height:180,
      background:'linear-gradient(135deg,rgba(34,197,94,.12),rgba(22,163,74,.06))',
      borderRadius:'60% 40% 30% 70% / 60% 30% 70% 40%',
      animation:'blob1 10s ease-in-out infinite',
      zIndex:0, pointerEvents:'none',
    }} />
    <div style={{
      position:'absolute', bottom:200, left:'5%', width:140, height:140,
      background:'linear-gradient(135deg,rgba(74,222,128,.1),rgba(34,197,94,.06))',
      borderRadius:'40% 60% 60% 40% / 40% 50% 60% 50%',
      animation:'blob2 12s ease-in-out infinite',
      zIndex:0, pointerEvents:'none',
    }} />
    {/* Floating emoji decorations */}
    <span className="float-a" style={{ position:'absolute', top:120, right:'14%', fontSize:36, zIndex:1, pointerEvents:'none', opacity:.7 }}>💊</span>
    <span className="float-b" style={{ position:'absolute', top:200, left:'7%',  fontSize:28, zIndex:1, pointerEvents:'none', opacity:.6 }}>🩺</span>
    <span className="float-c" style={{ position:'absolute', top:320, right:'6%', fontSize:24, zIndex:1, pointerEvents:'none', opacity:.5 }}>🔬</span>
  </>
);

// ── Star rating ───────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div style={{ display:'flex', gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="14" height="14" viewBox="0 0 24 24"
        fill={i <= rating ? '#fbbf24' : 'none'}
        stroke={i <= rating ? '#fbbf24' : '#d1d5db'} strokeWidth="1.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

export default function Hero() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res  = await fetch('/api/feedback');
        const data = await res.json();
        if (data.success) setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{css}</style>

      <section
        id="home"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg,#f0fdf4 0%,#fff 45%,#f8fafc 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          padding: '0 16px',
          position: 'relative', overflow: 'hidden',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <BlobDecor />

        {/* ── Hero content ───────────────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', paddingTop: 100, paddingBottom: 60,
          position: 'relative', zIndex: 2, maxWidth: 800, width: '100%',
        }}>

          {/* Live badge */}
          <div className="hero-fade-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 99, padding: '6px 16px',
            marginBottom: 22, fontSize: 13, fontWeight: 600, color: '#15803d',
          }}>
            <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            AI-Powered Health Platform · Free to Use
          </div>

          {/* Headline */}
          <h1 className={`${poppins.className} hero-fade-2`} style={{
            fontSize: 'clamp(36px,7vw,72px)',
            fontWeight: 700, lineHeight: 1.1,
            color: '#0f172a', marginBottom: 20,
          }}>
            Welcome to{' '}
            <span className="grad-text">MedHe</span>
            <span style={{ color: '#0f172a' }}>alth.ai</span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-fade-3" style={{
            fontSize: 'clamp(15px,2.5vw,18px)',
            color: '#475569', lineHeight: 1.75,
            maxWidth: 580, marginBottom: 36,
          }}>
            Upload your prescription or medicine image and instantly get detailed information. Search for medicines, find alternatives, and manage your health records — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="hero-fade-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
            <button className="try-btn" onClick={() => scrollTo('services')}>
              Try Now
              <svg className="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button className="ghost-btn" onClick={() => scrollTo('about')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="#22c55e"/>
              </svg>
              Learn More
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-fade-5" style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {[
              { icon: '📄', value: '10K+', label: 'Prescriptions Analysed' },
              { icon: '💊', value: '500+', label: 'Medicines Indexed' },
              { icon: '⭐', value: '4.9',  label: 'Average Rating' },
              { icon: '🔒', value: '100%', label: 'Private & Secure' },
            ].map((s, i) => (
              <div key={i} className="stat-pill" style={{ animationDelay: `${.55 + i * .08}s` }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.1 }}>{s.value}</p>
                  <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, lineHeight: 1.2 }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feedback carousel ──────────────────────────────────── */}
        {feedbacks.length > 0 && (
          <div style={{
            width: '100%', maxWidth: 1200,
            marginBottom: 60, position: 'relative', zIndex: 2,
          }}>
            {/* Section header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: '#fefce8', border: '1px solid #fde68a',
                borderRadius: 99, padding: '5px 14px',
                fontSize: 12.5, fontWeight: 600, color: '#92400e',
                marginBottom: 8,
              }}>
                ⭐ Real User Reviews
              </div>
              <h2 className={poppins.className} style={{
                fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700,
                color: '#0f172a', margin: 0,
              }}>
                What Our Users Say
              </h2>
            </div>

            {/* Scrolling track */}
            <div className="scroll-mask" style={{ overflow: 'hidden', padding: '8px 0' }}>
              <div className="scroll-track">
                {[...feedbacks, ...feedbacks].map((f, i) => (
                  <div key={i} className="feedback-card">
                    {/* Stars + rating number */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Stars rating={f.rating} />
                      <span style={{
                        background: '#fef9c3', color: '#854d0e',
                        fontSize: 11.5, fontWeight: 700,
                        padding: '2px 8px', borderRadius: 99,
                      }}>
                        {f.rating}/5
                      </span>
                    </div>

                    {/* Quote */}
                    <p style={{
                      fontSize: 13.5, color: '#374151',
                      lineHeight: 1.65, margin: '0 0 12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      fontStyle: 'italic',
                    }}>
                      "{f.message}"
                    </p>

                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#fff',
                        flexShrink: 0,
                      }}>
                        {(f.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', margin: 0 }}>{f.name}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Verified User</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}