'use client';

import { useState } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.5; transform:scale(1.5); }
  }
  @keyframes slideArrow {
    0%,100% { transform: translateX(0); }
    50%      { transform: translateX(5px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes successPop {
    0%   { opacity:0; transform:scale(.85) translateY(8px); }
    100% { opacity:1; transform:scale(1) translateY(0); }
  }

  .contact-fade { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }

  .contact-input {
    width: 100%;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    color: #1e293b;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 13px 16px;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
    box-sizing: border-box;
    resize: none;
  }
  .contact-input:focus {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(34,197,94,.1);
  }
  .contact-input::placeholder { color: #94a3b8; }

  .contact-label {
    display: block;
    font-size: 12px; font-weight: 700;
    color: #64748b; text-transform: uppercase;
    letter-spacing: .06em;
    margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif;
  }

  .submit-btn {
    width: 100%;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700;
    padding: 14px 24px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    transition: transform .15s, box-shadow .2s, opacity .2s;
    box-shadow: 0 4px 16px rgba(34,197,94,.35);
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34,197,94,.45);
  }
  .submit-btn:hover:not(:disabled) .btn-arrow { animation: slideArrow 1s ease-in-out infinite; }
  .submit-btn:active:not(:disabled) { transform: scale(.97); }
  .submit-btn:disabled { opacity: .65; cursor: not-allowed; }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
  }

  .info-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 16px 18px;
    display: flex; align-items: center; gap: 14px;
    font-family: 'DM Sans', sans-serif;
    transition: border-color .2s, box-shadow .2s, transform .2s;
  }
  .info-card:hover {
    border-color: #bbf7d0;
    box-shadow: 0 4px 16px rgba(34,197,94,.1);
    transform: translateX(4px);
  }

  .success-banner {
    animation: successPop .35s cubic-bezier(.22,1,.36,1) both;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif;
  }

  .error-banner {
    background: #fff1f2; border: 1.5px solid #fca5a5;
    border-radius: 12px; padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px; color: #be123c;
  }
`;

const contactInfo = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Phone',
    value: '+91 98765 43210',
    sub: 'Mon–Fri, 9am–6pm IST',
    bg: '#f0fdf4',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'support@medhealth.ai',
    sub: 'We reply within 24 hours',
    bg: '#fff7ed',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Location',
    value: 'Mumbai, India',
    sub: 'Serving users worldwide',
    bg: '#eff6ff',
  },
];

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(''); // 'sending' | 'success' | 'error' | ''
  const [touched, setTouched] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBlur   = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTouched({});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const isSending = status === 'sending';

  return (
    <>
      <style>{css}</style>

      <section
        id="contact"
        style={{
          padding: '96px 16px 80px',
          background: 'linear-gradient(160deg,#f0fdf4 0%,#fff 45%,#f8fafc 100%)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="contact-fade" style={{ textAlign: 'center', marginBottom: 52, animationDelay: '0s' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 99, padding: '5px 14px',
            marginBottom: 16, fontSize: 12.5, fontWeight: 600, color: '#15803d',
          }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            Get in Touch
          </div>

          <h2 className={poppins.className} style={{
            fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700,
            color: '#0f172a', marginBottom: 12, lineHeight: 1.2,
          }}>
            We'd Love to{' '}
            <span style={{ color: '#22c55e' }}>Hear From You</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 440, margin: '0 auto' }}>
            Questions, feedback, or just want to say hello? Send us a message and we'll get back to you quickly.
          </p>
        </div>

        {/* ── Two-column layout ────────────────────────────────────── */}
        <div style={{
          maxWidth: 940, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 28,
          alignItems: 'start',
        }}
          className="contact-layout"
        >

          {/* ── Form card ────────────────────────────────────────── */}
          <div className="contact-fade" style={{
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 22,
            padding: '32px 30px',
            boxShadow: '0 6px 32px rgba(0,0,0,.05)',
            animationDelay: '0.1s',
          }}>
            <h3 className={poppins.className} style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 22 }}>
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-row">
                <div>
                  <label className="contact-label">Your Name</label>
                  <input
                    className="contact-input"
                    type="text" name="name"
                    placeholder="e.g. Arjun Sharma"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      borderColor: touched.name && !form.name ? '#fca5a5' : undefined,
                    }}
                  />
                </div>
                <div>
                  <label className="contact-label">Email Address</label>
                  <input
                    className="contact-input"
                    type="email" name="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    style={{
                      borderColor: touched.email && !form.email ? '#fca5a5' : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="contact-label">Your Message</label>
                <textarea
                  className="contact-input"
                  name="message"
                  placeholder="Tell us how we can help you…"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  required
                  style={{
                    borderColor: touched.message && !form.message ? '#fca5a5' : undefined,
                  }}
                />
                <div style={{ textAlign: 'right', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  {form.message.length} / 500
                </div>
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="success-banner">
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#15803d', margin: 0 }}>Message sent!</p>
                    <p style={{ fontSize: 12.5, color: '#16a34a', margin: '2px 0 0' }}>We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}
              {status === 'error' && (
                <div className="error-banner">
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <span>Something went wrong. Please try again or email us directly.</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={isSending}>
                {isSending ? (
                  <><span className="spinner" /> Sending…</>
                ) : (
                  <>
                    Send Message
                    <svg className="btn-arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="contact-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16, animationDelay: '0.2s' }}>

            {/* Contact info cards */}
            {contactInfo.map((info, i) => (
              <div key={i} className="info-card">
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: info.bg, border: '1.5px solid #dcfce7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {info.icon}
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 2px' }}>
                    {info.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{info.value}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{info.sub}</p>
                </div>
              </div>
            ))}

            {/* Response time promise */}
            <div style={{
              background: 'linear-gradient(135deg,#16a34a,#22c55e)',
              borderRadius: 18, padding: '22px 20px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position:'absolute', top:-16, right:-16, width:70, height:70, background:'rgba(255,255,255,.08)', borderRadius:'50%' }} />
              <div style={{ position:'absolute', bottom:-10, left:-10, width:50, height:50, background:'rgba(255,255,255,.06)', borderRadius:'50%' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                <h4 className={poppins.className} style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                  Fast Response Time
                </h4>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', lineHeight: 1.55, margin: '0 0 14px' }}>
                  Our team responds to all messages within <strong style={{ color: '#fff' }}>24 hours</strong> on business days.
                </p>

                {/* Availability indicator */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: 'rgba(255,255,255,.15)', borderRadius: 99,
                  padding: '5px 12px',
                }}>
                  <span style={{ width: 7, height: 7, background: '#86efac', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Support online now</span>
                </div>
              </div>
            </div>

            {/* Social / AI assistant nudge */}
            <div style={{
              background: '#fff', border: '1.5px solid #e2e8f0',
              borderRadius: 14, padding: '16px 18px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>
                🤖 Need a faster answer?
              </p>
              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.55, margin: '0 0 12px' }}>
                Our AI assistant can answer most questions about medicines and MedHealth.ai instantly.
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                color: '#15803d', borderRadius: 8,
                padding: '7px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Open AI Chat →
              </div>
            </div>
          </div>
        </div>

        {/* Responsive collapse */}
        <style>{`
          @media (max-width: 700px) {
            .contact-layout { grid-template-columns: 1fr !important; }
            .form-row       { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}