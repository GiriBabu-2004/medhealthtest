'use client';

import { useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700'] });

// ── Inline styles / animations ───────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600&display=swap');

  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes cardIn   { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:none} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }

  .fade-up { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .card-in { animation: cardIn 0.35s cubic-bezier(.22,1,.36,1) both; }

  .med-input {
    font-family: 'DM Sans', sans-serif;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 13px 16px 13px 46px;
    font-size: 15px;
    color: #1e293b;
    width: 100%;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .med-input:focus {
    border-color: #22c55e;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(34,197,94,.1);
  }
  .med-input::placeholder { color: #94a3b8; }

  .drop-zone {
    border: 2px dashed #bbf7d0;
    border-radius: 14px;
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    background: #f0fdf4;
    transition: border-color .2s, background .2s, transform .15s;
    font-family: 'DM Sans', sans-serif;
  }
  .drop-zone:hover, .drop-zone.drag-over {
    border-color: #22c55e;
    background: #dcfce7;
    transform: scale(1.01);
  }

  .btn-primary {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 15px;
    padding: 13px 32px;
    cursor: pointer;
    transition: transform .15s, box-shadow .2s, opacity .2s;
    box-shadow: 0 4px 14px rgba(34,197,94,.35);
    display: flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(34,197,94,.45); }
  .btn-primary:active:not(:disabled) { transform: scale(.97); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; }

  .btn-ghost {
    background: #f1f5f9;
    color: #64748b;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 15px;
    padding: 12px 24px;
    cursor: pointer;
    transition: background .15s, border-color .2s;
    display: flex; align-items: center; gap: 6px;
  }
  .btn-ghost:hover { background: #e2e8f0; border-color: #cbd5e1; }

  .skel {
    background: linear-gradient(90deg,#f0fdf4 25%,#dcfce7 50%,#f0fdf4 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 10px;
  }

  .spinner {
    width:20px; height:20px;
    border:2.5px solid rgba(255,255,255,.4);
    border-top-color:#fff;
    border-radius:50%;
    animation: spin .7s linear infinite;
    flex-shrink:0;
  }

  .suggestion-card {
    background: #fff;
    border: 1.5px solid #dcfce7;
    border-radius: 14px;
    padding: 14px 16px;
    cursor: default;
    transition: border-color .2s, box-shadow .2s, transform .15s;
    font-family: 'DM Sans', sans-serif;
  }
  .suggestion-card:hover {
    border-color: #22c55e;
    box-shadow: 0 4px 16px rgba(34,197,94,.12);
    transform: translateY(-2px);
  }

  .warning-item {
    display: flex; align-items: flex-start; gap: 10px;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #9a3412;
  }

  .tag-badge {
    display: inline-flex; align-items: center;
    background: #dcfce7; color: #15803d;
    border-radius: 99px; padding: 3px 10px;
    font-size: 11.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }
`;

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const PillIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skel" style={{ height: 72, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function MedicalSearch() {
  const [user, setUser]           = useState(null);
  const [query, setQuery]         = useState('');
  const [pdfFile, setPdfFile]     = useState(null);
  const [pdfText, setPdfText]     = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [results, setResults]     = useState(null);
  const [error, setError]         = useState('');
  const [isDrag, setIsDrag]       = useState(false);
  const fileInputRef              = useRef(null);
  const resultsRef                = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // Scroll to results smoothly when they appear
  useEffect(() => {
    if (results) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [results]);

  // ── Upload PDF via /api/medsearch/upload ──────────────────────────────────
  const handleFileSelect = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setPdfFile(file);
    setError('');
    setPdfLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/medsearch/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) {
        setPdfText(data.text || '');
      } else {
        setError(data.message || 'Failed to read PDF.');
        setPdfFile(null);
      }
    } catch {
      setError('Failed to upload PDF. Please try again.');
      setPdfFile(null);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const removeFile = () => {
    setPdfFile(null);
    setPdfText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    setError('');
    setResults(null);

    if (!user) { setError('Please log in to search.'); return; }
    if (!query.trim() && !pdfFile) { setError('Enter a medicine name or upload a prescription PDF.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/medsearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), userId: user.uid, pdfText }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Search failed.');
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery(''); setPdfFile(null); setPdfText('');
    setResults(null); setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>

      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #f0fdf4 0%, #fff 50%, #f8fafc 100%)',
        padding: '100px 16px 64px',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        
        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="fade-up" style={{ textAlign: 'center', marginBottom: 40, animationDelay: '0s' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 99, padding: '5px 14px', marginBottom: 14,
            fontSize: 12.5, fontWeight: 600, color: '#15803d',
          }}>
            <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI-Powered Medicine Search
          </div>
          <div className="absolute top-[-75px] left-2">
  <div className={`text-2xl font-extrabold ${poppins.className}`}>
    <span className="text-green-500">MedHe</span>
    <span className="text-black">alth.ai</span>
  </div>
</div>
          <h1 className={poppins.className} style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 700, color: '#0f172a',
            lineHeight: 1.2, marginBottom: 12,
          }}>
            Find the Right{' '}
            <span style={{ color: '#22c55e' }}>Medicine</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Search by name or upload your prescription PDF — our AI suggests alternatives, interactions, and safety warnings.
          </p>
        </div>

        {/* ── Search Card ───────────────────────────────────────────── */}
        <div className="fade-up" style={{
          maxWidth: 680, margin: '0 auto',
          background: '#fff',
          borderRadius: 24,
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 8px 40px rgba(0,0,0,.07), 0 2px 8px rgba(34,197,94,.06)',
          padding: 28,
          animationDelay: '0.08s',
        }}>

          {/* Medicine name input */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
              <SearchIcon />
            </span>
            <input
              className="med-input"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter medicine name (e.g. Paracetamol 500mg)"
            />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>or upload prescription</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          </div>

          {/* Drop zone */}
          {!pdfFile ? (
            <div
              className={`drop-zone ${isDrag ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
              onDragLeave={() => setIsDrag(false)}
              onDrop={handleDrop}
            >
              <UploadIcon />
              <p style={{ color: '#15803d', fontWeight: 600, margin: '8px 0 4px', fontSize: 14 }}>
                Drop your prescription PDF here
              </p>
              <p style={{ color: '#94a3b8', fontSize: 12.5 }}>or click to browse · PDF only · max 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={e => handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            /* File pill */
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#f0fdf4', border: '1.5px solid #bbf7d0',
              borderRadius: 12, padding: '10px 14px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ flex: 1, fontSize: 13.5, color: '#15803d', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {pdfFile.name}
              </span>
              {pdfLoading ? (
                <span style={{ fontSize: 12, color: '#64748b', animation: 'pulse 1.2s infinite' }}>Reading…</span>
              ) : (
                <span className="tag-badge"><CheckIcon /> Parsed</span>
              )}
              <button onClick={removeFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 2 }}>
                <XIcon />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 14, background: '#fff1f2', border: '1px solid #fecdd3',
              borderRadius: 10, padding: '10px 14px',
              color: '#be123c', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Auth warning */}
          {!user && (
            <div style={{
              marginTop: 14, background: '#fefce8', border: '1px solid #fde68a',
              borderRadius: 10, padding: '10px 14px',
              color: '#92400e', fontSize: 13.5,
            }}>
              🔒 Please <strong>log in</strong> to use the medicine search feature.
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn-primary" onClick={handleSearch} disabled={loading || pdfLoading || !user} style={{ flex: 1 }}>
              {loading ? <><span className="spinner" /> Searching…</> : <><SearchIcon /> Search Medicines</>}
            </button>
            <button className="btn-ghost" onClick={handleReset}>
              <XIcon /> Reset
            </button>
          </div>
        </div>

        {/* ── Skeleton ─────────────────────────────────────────────── */}
        {loading && (
          <div style={{ maxWidth: 680, margin: '24px auto 0' }}>
            <Skeleton />
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────── */}
        {results && !loading && (
          <div
            ref={resultsRef}
            className="fade-up"
            style={{ maxWidth: 680, margin: '28px auto 0', animationDelay: '0s' }}
          >
            {/* Result header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 className={poppins.className} style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  💊 Medicine Suggestions
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: '3px 0 0' }}>
                  For <strong style={{ color: '#15803d' }}>"{results.query}"</strong>
                  {results.patientAge ? ` · Patient age: ${results.patientAge}` : ''}
                  {pdfText ? ' · Based on uploaded prescription' : ''}
                </p>
              </div>
              <span className="tag-badge">
                {results.suggestions?.length || 0} found
              </span>
            </div>

            {/* Suggestion cards */}
            {results.suggestions?.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {results.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="suggestion-card card-in"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <PillIcon />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', margin: '0 0 4px' }}>{s}</p>
                        {results.reasons?.[i] && (
                          <p style={{ fontSize: 12.5, color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                            {results.reasons[i]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '32px 16px',
                background: '#f8fafc', borderRadius: 14, border: '1.5px dashed #e2e8f0',
              }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>No alternatives found for this query.</p>
              </div>
            )}

            {/* Warnings */}
            {results.warnings?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#92400e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <WarnIcon /> Warnings & Interactions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {results.warnings.map((w, i) => (
                    <div key={i} className="warning-item card-in" style={{ animationDelay: `${i * 0.05}s` }}>
                      <WarnIcon />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LLM error note */}
            {results.llmError && (
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 12, textAlign: 'center' }}>
                ⚠️ AI model error — showing database results only.
              </p>
            )}

            {/* Disclaimer */}
            <div style={{
              marginTop: 20, padding: '12px 16px',
              background: '#f8fafc', borderRadius: 12,
              border: '1px solid #e2e8f0',
              fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5,
            }}>
              🩺 These suggestions are AI-generated for informational purposes only. Always consult a licensed doctor or pharmacist before changing any medication.
            </div>
          </div>
        )}
      </section>
    </>
  );
}