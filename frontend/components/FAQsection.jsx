'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  @keyframes spinIn {
    from { transform: rotate(-90deg) scale(0.7); opacity: 0; }
    to   { transform: rotate(0deg)   scale(1);   opacity: 1; }
  }

  .faq-fade { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }

  .faq-item {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    transition: border-color .25s, box-shadow .25s;
    font-family: 'DM Sans', sans-serif;
  }
  .faq-item.open {
    border-color: #86efac;
    box-shadow: 0 6px 28px rgba(34,197,94,.1);
  }
  .faq-item:not(.open):hover {
    border-color: #bbf7d0;
    box-shadow: 0 4px 16px rgba(34,197,94,.07);
  }

  .faq-btn {
    width: 100%; display: flex; align-items: center; gap: 14px;
    padding: 18px 20px; background: none; border: none; cursor: pointer;
    text-align: left; font-family: 'DM Sans', sans-serif;
    transition: background .2s;
  }
  .faq-btn:hover { background: #fafff9; }
  .faq-item.open .faq-btn { background: #f0fdf4; }

  .faq-icon {
    width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    transition: background .25s, border-color .25s;
  }
  .faq-item.open .faq-icon {
    background: linear-gradient(135deg,#22c55e,#16a34a);
    border-color: transparent;
  }
  .faq-item.open .faq-icon svg { stroke: #fff; }

  .faq-chevron {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    transition: background .25s, transform .3s, border-color .25s;
  }
  .faq-item.open .faq-chevron {
    background: #22c55e; border-color: #22c55e;
    transform: rotate(180deg);
  }
  .faq-item.open .faq-chevron svg { stroke: #fff; }

  .faq-answer {
    overflow: hidden;
    transition: max-height 0.38s cubic-bezier(.22,1,.36,1), opacity 0.28s ease;
  }

  .faq-number {
    font-size: 10px; font-weight: 700; color: #22c55e;
    font-family: 'DM Sans', sans-serif; line-height: 1;
  }
`;

// ── FAQ icon per question ────────────────────────────────────────────────────
const faqIcons = [
  // What is MedHealth
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="#22c55e"/>
  </svg>,
  // Upload
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>,
  // Security
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
  // Substitutes
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>
  </svg>,
  // Track
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
  </svg>,
  // Free
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>,
  // Incorrect info
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>,
];

const faqs = [
  {
    question: 'What is MedHealth.ai?',
    answer: 'MedHealth.ai is an AI-powered health platform that lets you upload a prescription or medicine image to instantly get detailed information — including dosage, side effects, timing, alternative brands, and drug interactions.',
  },
  {
    question: 'How does the image upload feature work?',
    answer: 'Upload a clear photo or PDF of your prescription. Our AI reads and extracts medicine names, then cross-references its database to deliver accurate, plain-English information in seconds.',
  },
  {
    question: 'Is my medical data safe?',
    answer: 'Absolutely. MedHealth.ai uses Firebase with encrypted storage. Your health records are completely private — only accessible to you when you\'re logged in. We never sell or share your data.',
  },
  {
    question: 'Can I find substitute medicines?',
    answer: 'Yes! The Medicine Search feature lets you search any drug and discover equivalent medicines under different brand names, generic alternatives, and safe substitutes — all with AI-powered safety warnings.',
  },
  {
    question: 'Can I track my medicines or prescriptions?',
    answer: 'Yes. The Save & Track feature lets you log vitals, symptoms, current medications, and your full medical history. You can also export a professional PDF record anytime for your doctor.',
  },
  {
    question: 'Is this service free to use?',
    answer: 'Core features — prescription upload, medicine search, and health tracking — are completely free. We believe everyone deserves access to clear health information.',
  },
  {
    question: 'What if I find incorrect medicine information?',
    answer: 'Use the feedback form or contact our support team directly. We review every report promptly and update our database to maintain accuracy and safety.',
  },
];

// ── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ faq, index, isOpen, onClick }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [isOpen]);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-btn" onClick={onClick}>
        {/* Number + icon */}
        <div className="faq-icon">
          {faqIcons[index]}
        </div>

        {/* Question */}
        <span style={{
          flex: 1, fontSize: 15, fontWeight: 600,
          color: isOpen ? '#15803d' : '#1e293b',
          transition: 'color .2s',
          lineHeight: 1.4,
        }}>
          {faq.question}
        </span>

        {/* Chevron */}
        <div className="faq-chevron">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Answer */}
      <div
        className="faq-answer"
        style={{ maxHeight: height, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} style={{ padding: '0 20px 18px 70px' }}>
          <div style={{
            width: '100%', height: 1,
            background: 'linear-gradient(90deg,#dcfce7,transparent)',
            marginBottom: 14,
          }} />
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: 0 }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // first open by default

  return (
    <>
      <style>{css}</style>

      <section
        style={{
          padding: '96px 16px 80px',
          background: 'linear-gradient(160deg,#fff 0%,#f0fdf4 50%,#fff 100%)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="faq-fade" style={{ textAlign: 'center', marginBottom: 52, animationDelay: '0s' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 99, padding: '5px 14px',
            marginBottom: 16, fontSize: 12.5, fontWeight: 600, color: '#15803d',
          }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            Got Questions?
          </div>

          <h2 className={poppins.className} style={{
            fontSize: 'clamp(28px,5vw,44px)',
            fontWeight: 700, color: '#0f172a',
            marginBottom: 12, lineHeight: 1.2,
          }}>
            Frequently Asked{' '}
            <span style={{ color: '#22c55e' }}>Questions</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>
            Everything you need to know about MedHealth.ai — answered clearly and simply.
          </p>
        </div>

        {/* ── Two-column layout: FAQ list + contact card ─────────── */}
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 280px',
          gap: 28,
          alignItems: 'start',
        }}
          className="faq-layout"
        >
          {/* ── FAQ list ────────────────────────────────────────── */}
          <div className="faq-fade" style={{ display: 'flex', flexDirection: 'column', gap: 10, animationDelay: '0.1s' }}>
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div className="faq-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16, animationDelay: '0.2s' }}>

            {/* Still confused card */}
            <div style={{
              background: 'linear-gradient(135deg,#16a34a,#22c55e)',
              borderRadius: 20, padding: '28px 22px',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              {/* Deco circles */}
              <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, background:'rgba(255,255,255,.08)', borderRadius:'50%' }} />
              <div style={{ position:'absolute', bottom:-15, left:-15, width:70, height:70, background:'rgba(255,255,255,.06)', borderRadius:'50%' }} />

              <div style={{ fontSize: 36, marginBottom: 10, position: 'relative', zIndex: 1 }}>🤔</div>
              <h4 className={poppins.className} style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                Still have questions?
              </h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', lineHeight: 1.55, marginBottom: 18, position: 'relative', zIndex: 1 }}>
                Our AI assistant is available 24/7 to answer anything about your medicines.
              </p>
              <a href="#contact" style={{
                display: 'inline-block',
                background: '#fff', color: '#15803d',
                borderRadius: 10, padding: '9px 20px',
                fontWeight: 700, fontSize: 13.5,
                textDecoration: 'none',
                transition: 'transform .15s',
                position: 'relative', zIndex: 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Contact Us →
              </a>
            </div>

            {/* Quick stats */}
            {[
              { icon: '💬', label: '7 common questions', sub: 'covered below' },
              { icon: '⚡', label: 'Instant answers', sub: 'from our AI chatbot' },
              { icon: '🔒', label: '100% private', sub: 'your data stays yours' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: '#fff', border: '1.5px solid #e2e8f0',
                borderRadius: 14, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'border-color .2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#bbf7d0'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <span style={{ fontSize: 22 }}>{stat.icon}</span>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', margin: 0 }}>{stat.label}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '1px 0 0' }}>{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        

        {/* Responsive sidebar collapse */}
        <style>{`
          @media (max-width: 680px) {
            .faq-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </>
  );
}