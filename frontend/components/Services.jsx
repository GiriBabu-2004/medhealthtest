'use client';

import Link from 'next/link';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes pulse-dot {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.5; transform:scale(1.5); }
  }
  @keyframes shimmer-arrow {
    0%   { transform: translateX(0); opacity: 0.7; }
    50%  { transform: translateX(5px); opacity: 1; }
    100% { transform: translateX(0); opacity: 0.7; }
  }

  .svc-fade { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }

  .service-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 22px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition: border-color .25s, box-shadow .3s, transform .25s;
    position: relative;
    font-family: 'DM Sans', sans-serif;
  }
  .service-card::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .3s cubic-bezier(.22,1,.36,1);
  }
  .service-card:hover {
    border-color: #86efac;
    box-shadow: 0 12px 40px rgba(34,197,94,.15), 0 2px 8px rgba(0,0,0,.05);
    transform: translateY(-6px);
  }
  .service-card:hover::after { transform: scaleX(1); }
  .service-card:hover .svc-illustration { animation: float 3s ease-in-out infinite; }
  .service-card:hover .svc-arrow { animation: shimmer-arrow 1s ease-in-out infinite; }
  .service-card:hover .svc-icon-ring { transform: scale(1.08); }

  .svc-illustration { transition: transform .3s; }
  .svc-icon-ring { transition: transform .25s; }

  .arrow-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s, border-color .2s;
  }
  .service-card:hover .arrow-btn {
    background: linear-gradient(135deg,#22c55e,#16a34a);
    border-color: transparent;
  }
  .service-card:hover .arrow-btn svg { stroke: #fff; }

  .svc-tag {
    display: inline-flex; align-items: center;
    background: #f0fdf4; color: #15803d;
    border: 1px solid #bbf7d0; border-radius: 99px;
    padding: 3px 10px; font-size: 11.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }
`;

// ── Inline SVG Illustrations ─────────────────────────────────────────────────

const UploadIllustration = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Background blobs */}
    <ellipse cx="120" cy="80" rx="90" ry="60" fill="#f0fdf4" />
    <ellipse cx="60" cy="110" rx="30" ry="20" fill="#dcfce7" opacity=".6" />
    <ellipse cx="190" cy="50" rx="25" ry="18" fill="#bbf7d0" opacity=".5" />

    {/* Document base */}
    <rect x="72" y="28" width="96" height="118" rx="10" fill="white" stroke="#86efac" strokeWidth="2"/>
    <rect x="72" y="28" width="96" height="118" rx="10" fill="url(#docGrad)" opacity=".4"/>

    {/* Document fold corner */}
    <path d="M148 28 L168 48 H148 V28Z" fill="#bbf7d0" stroke="#86efac" strokeWidth="1.5"/>

    {/* Text lines on document */}
    <rect x="84" y="60" width="50" height="5" rx="2.5" fill="#86efac"/>
    <rect x="84" y="72" width="65" height="4" rx="2" fill="#d1fae5"/>
    <rect x="84" y="82" width="55" height="4" rx="2" fill="#d1fae5"/>
    <rect x="84" y="92" width="60" height="4" rx="2" fill="#d1fae5"/>
    <rect x="84" y="102" width="45" height="4" rx="2" fill="#d1fae5"/>

    {/* Upload arrow with circle */}
    <circle cx="163" cy="115" r="18" fill="url(#arrowGrad)" />
    <path d="M163 124 V108 M157 114 L163 107 L169 114" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

    {/* Sparkles */}
    <path d="M68 40 L70 36 L72 40 L68 40Z" fill="#22c55e" opacity=".7"/>
    <path d="M180 130 L182 126 L184 130 L180 130Z" fill="#16a34a" opacity=".6"/>
    <circle cx="176" cy="32" r="3" fill="#22c55e" opacity=".5"/>
    <circle cx="78" cy="130" r="2" fill="#16a34a" opacity=".4"/>

    <defs>
      <linearGradient id="docGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22c55e" stopOpacity=".1"/>
        <stop offset="100%" stopColor="#16a34a" stopOpacity=".05"/>
      </linearGradient>
      <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22c55e"/>
        <stop offset="100%" stopColor="#16a34a"/>
      </linearGradient>
    </defs>
  </svg>
);

const SearchIllustration = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Background */}
    <ellipse cx="120" cy="80" rx="88" ry="58" fill="#f0fdf4"/>
    <ellipse cx="55" cy="55" rx="28" ry="18" fill="#dcfce7" opacity=".5"/>
    <ellipse cx="195" cy="115" rx="22" ry="16" fill="#bbf7d0" opacity=".4"/>

    {/* Pill capsule large */}
    <rect x="60" y="52" width="80" height="36" rx="18" fill="white" stroke="#86efac" strokeWidth="2"/>
    <rect x="100" y="52" width="40" height="36" rx="0" fill="#dcfce7"/>
    <rect x="100" y="52" width="40" height="36" rx="18" fill="#dcfce7"/>
    <line x1="100" y1="52" x2="100" y2="88" stroke="#86efac" strokeWidth="1.5"/>

    {/* Small pills */}
    <rect x="68" y="104" width="38" height="16" rx="8" fill="white" stroke="#86efac" strokeWidth="1.5"/>
    <rect x="87" y="104" width="19" height="16" rx="0" fill="#bbf7d0"/>
    <rect x="87" y="104" width="19" height="16" rx="8" fill="#bbf7d0"/>

    <rect x="116" y="104" width="38" height="16" rx="8" fill="white" stroke="#86efac" strokeWidth="1.5"/>
    <rect x="135" y="104" width="19" height="16" rx="0" fill="#d1fae5"/>
    <rect x="135" y="104" width="19" height="16" rx="8" fill="#d1fae5"/>

    {/* Magnifying glass */}
    <circle cx="172" cy="54" r="18" fill="url(#searchBg)"/>
    <circle cx="172" cy="54" r="9" stroke="white" strokeWidth="2.5" fill="none"/>
    <line x1="178" y1="61" x2="184" y2="67" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>

    {/* Plus cross on pill */}
    <line x1="80" y1="70" x2="80" y2="62" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
    <line x1="76" y1="66" x2="84" y2="66" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>

    {/* Sparkles */}
    <circle cx="62" cy="38" r="3" fill="#22c55e" opacity=".5"/>
    <circle cx="188" cy="38" r="2.5" fill="#16a34a" opacity=".5"/>
    <path d="M155 118 L157 113 L159 118 L155 118Z" fill="#22c55e" opacity=".6"/>

    <defs>
      <linearGradient id="searchBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22c55e"/>
        <stop offset="100%" stopColor="#16a34a"/>
      </linearGradient>
    </defs>
  </svg>
);

const TrackIllustration = () => (
  <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Background */}
    <ellipse cx="120" cy="80" rx="90" ry="58" fill="#f0fdf4"/>
    <ellipse cx="50" cy="110" rx="26" ry="17" fill="#dcfce7" opacity=".5"/>
    <ellipse cx="198" cy="45" rx="22" ry="15" fill="#bbf7d0" opacity=".4"/>

    {/* Clipboard base */}
    <rect x="68" y="34" width="104" height="110" rx="10" fill="white" stroke="#86efac" strokeWidth="2"/>
    {/* Clipboard top clip */}
    <rect x="98" y="26" width="44" height="18" rx="5" fill="#22c55e"/>
    <rect x="108" y="29" width="24" height="10" rx="4" fill="white"/>

    {/* Rows with checkboxes */}
    {[0,1,2,3].map((row) => (
      <g key={row} transform={`translate(0, ${row * 18})`}>
        <rect x="80" y="58" width="12" height="12" rx="3"
          fill={row < 2 ? '#22c55e' : 'white'}
          stroke={row < 2 ? '#16a34a' : '#86efac'} strokeWidth="1.5"/>
        {row < 2 && <path d={`M83 ${64} L85.5 ${67} L89 ${62}`} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
        <rect x="98" y="61" width={row === 0 ? 52 : row === 1 ? 44 : row === 2 ? 48 : 38} height="5" rx="2.5"
          fill={row < 2 ? '#d1fae5' : '#e2e8f0'}/>
      </g>
    ))}

    {/* Mini bar chart at bottom of clipboard */}
    <rect x="82" y="126" width="10" height="10" rx="2" fill="#22c55e"/>
    <rect x="96" y="120" width="10" height="16" rx="2" fill="#16a34a"/>
    <rect x="110" y="123" width="10" height="13" rx="2" fill="#86efac"/>
    <rect x="124" y="116" width="10" height="20" rx="2" fill="#22c55e"/>
    <rect x="138" y="119" width="10" height="17" rx="2" fill="#4ade80"/>

    {/* Heart rate line */}
    <path d="M166 70 L172 70 L175 62 L179 78 L183 65 L187 70 L193 70"
      stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="179" cy="78" r="3" fill="#16a34a"/>

    {/* PDF export icon */}
    <circle cx="185" cy="118" r="14" fill="url(#trackGrad)"/>
    <path d="M181 118 L185 114 L189 118 M185 114 L185 124" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

    <defs>
      <linearGradient id="trackGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22c55e"/>
        <stop offset="100%" stopColor="#16a34a"/>
      </linearGradient>
    </defs>
  </svg>
);

// ── Services data ─────────────────────────────────────────────────────────────
const services = [
  {
    title: 'Upload Prescription',
    desc: 'Upload any prescription image or PDF and instantly get a plain-English breakdown — medicine names, dosages, and usage instructions.',
    route: '/upload-prescription',
    tag: 'AI Vision',
    highlight: 'Instant Analysis',
    Illustration: UploadIllustration,
    bg: 'linear-gradient(135deg,#f0fdf4 0%,#ecfdf5 100%)',
    accent: '#22c55e',
  },
  {
    title: 'Medicine Search',
    desc: 'Search any drug to find alternatives, generic options, side effects, and interaction warnings personalised to your health history.',
    route: '/medicine-search',
    tag: 'AI Search',
    highlight: 'Smart Alternatives',
    Illustration: SearchIllustration,
    bg: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)',
    accent: '#16a34a',
  },
  {
    title: 'Save & Track',
    desc: 'Log your vitals, medications, symptoms and medical history. Download a professional PDF record anytime for your doctor.',
    route: '/save-track',
    tag: 'Health Records',
    highlight: 'PDF Export',
    Illustration: TrackIllustration,
    bg: 'linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 100%)',
    accent: '#15803d',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Services() {
  return (
    <>
      <style>{css}</style>

      <section
        id="services"
        style={{
          padding: '96px 16px 80px',
          background: 'linear-gradient(160deg,#fff 0%,#f0fdf4 50%,#fff 100%)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="svc-fade" style={{ textAlign: 'center', marginBottom: 52, animationDelay: '0s' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 99, padding: '5px 14px',
            marginBottom: 16, fontSize: 12.5, fontWeight: 600, color: '#15803d',
          }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            What We Offer
          </div>

          <h2 className={poppins.className} style={{
            fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700,
            color: '#0f172a', marginBottom: 12, lineHeight: 1.2,
          }}>
            Our <span style={{ color: '#22c55e' }}>Services</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Three powerful tools to help you understand, search, and manage your medicines — all in one place.
          </p>
        </div>

        {/* ── Cards grid ─────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 24,
          maxWidth: 1040,
          margin: '0 auto',
        }}>
          {services.map((svc, i) => (
            <Link
              href={svc.route}
              key={i}
              className="service-card svc-fade"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              {/* Illustration area */}
              <div style={{
                background: svc.bg,
                padding: '28px 24px 20px',
                position: 'relative',
                borderBottom: '1px solid #e2e8f0',
              }}>
                {/* Tag */}
                <span className="svc-tag" style={{ position: 'absolute', top: 16, left: 16 }}>
                  {svc.tag}
                </span>

                {/* SVG illustration */}
                <div className="svc-illustration" style={{ height: 150, margin: '8px 0 0' }}>
                  <svc.Illustration />
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Highlight chip */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#f0fdf4', color: '#15803d',
                  border: '1px solid #bbf7d0', borderRadius: 99,
                  padding: '3px 10px', fontSize: 11.5, fontWeight: 600,
                  marginBottom: 10, alignSelf: 'flex-start',
                }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="#22c55e"><circle cx="5" cy="5" r="5"/></svg>
                  {svc.highlight}
                </span>

                <h3 className={poppins.className} style={{
                  fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 8,
                }}>
                  {svc.title}
                </h3>

                <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, flex: 1, margin: '0 0 18px' }}>
                  {svc.desc}
                </p>

                {/* Arrow CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: svc.accent }}>
                    Get started
                  </span>
                  <div className="arrow-btn">
                    <svg className="svc-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        
      </section>
    </>
  );
}