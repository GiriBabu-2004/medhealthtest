'use client';

import { useEffect, useRef, useState } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatA {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(3deg); }
  }
  @keyframes floatB {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(-4deg); }
  }
  @keyframes floatC {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.7); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.5; transform:scale(1.4); }
  }
  @keyframes gradShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .about-fade   { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
  .float-a      { animation: floatA 5s ease-in-out infinite; }
  .float-b      { animation: floatB 6.5s ease-in-out infinite; }
  .float-c      { animation: floatC 4.5s ease-in-out infinite; }
  .count-in     { animation: countUp 0.5s cubic-bezier(.22,1,.36,1) both; }

  .feature-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    padding: 28px 24px;
    transition: border-color .25s, box-shadow .25s, transform .2s;
    cursor: default;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }
  .feature-card::before {
    content: '';
    position: absolute; top:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg,#22c55e,#16a34a);
    opacity: 0;
    transition: opacity .25s;
  }
  .feature-card:hover {
    border-color: #bbf7d0;
    box-shadow: 0 8px 32px rgba(34,197,94,.12);
    transform: translateY(-4px);
  }
  .feature-card:hover::before { opacity: 1; }

  .stat-card {
    background: linear-gradient(135deg,#f0fdf4,#fff);
    border: 1.5px solid #dcfce7;
    border-radius: 18px;
    padding: 24px 20px;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    transition: transform .2s, box-shadow .2s;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(34,197,94,.15);
  }

  .team-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    padding: 28px 20px;
    text-align: center;
    font-family: 'DM Sans', sans-serif;
    transition: border-color .25s, box-shadow .25s, transform .2s;
  }
  .team-card:hover {
    border-color: #bbf7d0;
    box-shadow: 0 6px 28px rgba(34,197,94,.1);
    transform: translateY(-4px);
  }

  .pill-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    color: #15803d; border-radius: 99px;
    padding: 5px 14px; font-size: 12.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }

  .grad-text {
    background: linear-gradient(135deg,#22c55e 0%,#16a34a 50%,#15803d 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradShift 4s ease infinite;
  }

  .about-section { font-family: 'DM Sans', sans-serif; }
`;

// ── Features data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: '🔬',
    title: 'AI Prescription Analysis',
    desc: 'Upload any prescription image or PDF and get instant breakdowns of every medicine — dosage, usage, and side effects explained simply.',
    color: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    icon: '💊',
    title: 'Smart Medicine Search',
    desc: 'Search for any drug and discover safer alternatives, generic options, and drug interaction warnings tailored to your health history.',
    color: '#fff7ed',
    border: '#fed7aa',
  },
  {
    icon: '📋',
    title: 'Health Record Tracking',
    desc: 'Log your vitals, symptoms, medications, and history all in one place. Export a professional PDF anytime for your doctor.',
    color: '#eff6ff',
    border: '#bfdbfe',
  },
  {
    icon: '⚡',
    title: 'Instant BMI & Vitals',
    desc: 'Auto-calculate your BMI from height and weight, track blood pressure, heart rate, SpO2 and more — all in one dashboard.',
    color: '#fdf4ff',
    border: '#e9d5ff',
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    desc: 'Your health data is encrypted, stored securely under your account, and never shared. You own your records completely.',
    color: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    icon: '🤖',
    title: 'AI Health Assistant',
    desc: 'Chat with our AI assistant anytime — ask about medicines, symptoms, or how to use MedHealth.ai. Available 24/7.',
    color: '#fefce8',
    border: '#fde68a',
  },
];

const stats = [
  { value: '10K+', label: 'Prescriptions Analyzed', icon: '📄' },
  { value: '500+', label: 'Medicines in Database', icon: '💊' },
  { value: '98%',  label: 'User Satisfaction',     icon: '⭐' },
  { value: '24/7', label: 'AI Assistant Online',   icon: '🤖' },
];

const team = [
  { name: 'Arjun Sharma',   role: 'Founder & AI Lead',     avatar: '👨‍💻', bg: '#f0fdf4' },
  { name: 'Priya Nair',     role: 'Medical Advisor',        avatar: '👩‍⚕️', bg: '#fff7ed' },
  { name: 'Rahul Mehta',    role: 'Full Stack Engineer',    avatar: '🧑‍🔧', bg: '#eff6ff' },
];

// ── Animated stat counter ────────────────────────────────────────────────────
function StatCounter({ value, label, icon, visible }) {
  return (
    <div className={`stat-card ${visible ? 'count-in' : ''}`} style={{ opacity: visible ? 1 : 0 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div className={poppins.className} style={{ fontSize: 32, fontWeight: 700, color: '#16a34a', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 5, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function About() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>

      <section
        id="about"
        className="about-section"
        style={{
          background: 'linear-gradient(160deg,#f0fdf4 0%,#fff 40%,#f8fafc 100%)',
          padding: '96px 16px 80px',
          overflowX: 'hidden',
        }}
      >
        {/* ── Hero block ──────────────────────────────────────────── */}
        <div className="about-fade" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 72px', animationDelay: '0s' }}>

          <div className="pill-badge" style={{ marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            About MedHealth.ai
          </div>

          <h2 className={poppins.className} style={{
            fontSize: 'clamp(32px,6vw,52px)', fontWeight: 700,
            color: '#0f172a', lineHeight: 1.15, marginBottom: 20,
          }}>
            Your Intelligent{' '}
            <span className="grad-text">Health Companion</span>
          </h2>

          <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.75, marginBottom: 28, maxWidth: 600, margin: '0 auto 28px' }}>
            MedHealth.ai helps you <strong style={{ color: '#15803d' }}>identify, understand, and manage</strong> your medicines through simple uploads and AI-powered search — making healthcare information accessible and easy for everyone.
          </p>

          {/* Mission pill strip */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
            {['AI-Powered', 'Secure & Private', 'Doctor-Friendly', 'Free to Use'].map(tag => (
              <span key={tag} style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                color: '#15803d', borderRadius: 99, padding: '5px 14px',
                fontSize: 12.5, fontWeight: 600,
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* ── Floating visual banner ───────────────────────────────── */}
        <div className="about-fade" style={{
          maxWidth: 860, margin: '0 auto 80px',
          background: 'linear-gradient(135deg,#16a34a 0%,#22c55e 60%,#86efac 100%)',
          borderRadius: 28,
          padding: '52px 40px',
          position: 'relative', overflow: 'hidden',
          animationDelay: '0.1s',
        }}>
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:'rgba(255,255,255,.08)', borderRadius:'50%' }} />
          <div style={{ position:'absolute', bottom:-30, left:-30, width:150, height:150, background:'rgba(255,255,255,.06)', borderRadius:'50%' }} />

          {/* Floating emoji blobs */}
          <span className="float-a" style={{ position:'absolute', top:20, right:80, fontSize:40 }}>💊</span>
          <span className="float-b" style={{ position:'absolute', bottom:24, right:200, fontSize:32 }}>🩺</span>
          <span className="float-c" style={{ position:'absolute', top:30, left:60, fontSize:28 }}>🔬</span>

          <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.8)', fontWeight:600, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>
              Our Mission
            </p>
            <h3 className={poppins.className} style={{ fontSize:'clamp(20px,4vw,32px)', color:'#fff', fontWeight:700, lineHeight:1.3, maxWidth:600, margin:'0 auto 16px' }}>
              "Democratise access to clear, reliable medical information for everyone — anywhere."
            </h3>
            <p style={{ color:'rgba(255,255,255,.8)', fontSize:15, maxWidth:480, margin:'0 auto' }}>
              We believe no one should feel confused about their own health. MedHealth.ai bridges the gap between complex prescriptions and plain understanding.
            </p>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <div
          ref={statsRef}
          className="about-fade"
          style={{
            maxWidth: 860, margin: '0 auto 80px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
            gap: 16, animationDelay: '0.15s',
          }}
        >
          {stats.map((s, i) => (
            <StatCounter key={i} {...s} visible={statsVisible} />
          ))}
        </div>

        {/* ── Features grid ───────────────────────────────────────── */}
        <div className="about-fade" style={{ maxWidth: 860, margin: '0 auto 80px', animationDelay: '0.2s' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p className={poppins.className} style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              Everything You Need
            </p>
            <p style={{ color: '#64748b', fontSize: 15 }}>Powerful tools, built for real health decisions</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${0.05 * i}s` }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: f.color, border: `1.5px solid ${f.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 14,
                }}>
                  {f.icon}
                </div>
                <h4 className={poppins.className} style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 7 }}>
                  {f.title}
                </h4>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ────────────────────────────────────────── */}
        <div className="about-fade" style={{ maxWidth: 860, margin: '0 auto 80px', animationDelay: '0.25s' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p className={poppins.className} style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              How It Works
            </p>
            <p style={{ color: '#64748b', fontSize: 15 }}>Get started in three simple steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 0, position: 'relative' }}>
            {/* Connector line (desktop only) */}
            <div style={{
              position: 'absolute', top: 36, left: '16%', right: '16%', height: 2,
              background: 'linear-gradient(90deg,#22c55e,#86efac,#22c55e)',
              zIndex: 0,
            }} />

            {[
              { step: '01', icon: '📤', title: 'Upload or Search',   desc: 'Upload your prescription PDF or type any medicine name.' },
              { step: '02', icon: '🤖', title: 'AI Analyses',        desc: 'Our AI reads your prescription and cross-references its database.' },
              { step: '03', icon: '✅', title: 'Get Clear Results',  desc: 'Receive alternatives, warnings, and a plain-English explanation.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: 26,
                  boxShadow: '0 4px 16px rgba(34,197,94,.35)',
                  border: '3px solid #fff',
                }}>
                  {item.icon}
                </div>
                <span style={{
                  display: 'inline-block', background: '#f0fdf4', color: '#15803d',
                  border: '1px solid #bbf7d0', borderRadius: 99,
                  padding: '2px 10px', fontSize: 11, fontWeight: 700, marginBottom: 8,
                }}>STEP {item.step}</span>
                <h4 className={poppins.className} style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

     
        {/* ── CTA ─────────────────────────────────────────────────── */}
        <div className="about-fade" style={{
          maxWidth: 620, margin: '0 auto', textAlign: 'center',
          background: '#fff', border: '1.5px solid #dcfce7',
          borderRadius: 24, padding: '48px 32px',
          boxShadow: '0 8px 40px rgba(34,197,94,.08)',
          animationDelay: '0.35s',
        }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🌿</div>
          <h3 className={poppins.className} style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
            Ready to take control of your health?
          </h3>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
            Join thousands of users who trust MedHealth.ai to simplify their medical journey.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            <a href="#services" style={{
              background: 'linear-gradient(135deg,#22c55e,#16a34a)',
              color: '#fff', borderRadius: 12, padding: '12px 28px',
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(34,197,94,.35)',
              transition: 'transform .15s',
              fontFamily: "'DM Sans', sans-serif",
            }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'none'}
            >
              Get Started Free →
            </a>
            <a href="#contact" style={{
              background: '#f8fafc', color: '#374151',
              border: '1.5px solid #e2e8f0', borderRadius: 12,
              padding: '12px 28px', fontWeight: 600, fontSize: 15,
              textDecoration: 'none', fontFamily: "'DM Sans', sans-serif",
            }}>
              Contact Us
            </a>
          </div>
        </div>

      </section>
    </>
  );
}