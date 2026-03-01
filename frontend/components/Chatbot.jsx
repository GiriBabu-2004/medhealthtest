'use client';
import { useState, useRef, useEffect } from 'react';

// ── Inline styles for animations (no Tailwind keyframe support needed) ──────
const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes chatSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes msgPop {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);    opacity: 0.6; }
    100% { transform: scale(1.55); opacity: 0;   }
  }
  @keyframes typingDot {
    0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
    30%            { transform: translateY(-5px); opacity: 1;   }
  }
  @keyframes btnPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
    50%       { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
  }

  .chat-window    { animation: chatSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
  .msg-appear     { animation: msgPop 0.22s ease both; }
  .pulse-ring     { animation: pulse-ring 1.8s ease-out infinite; }
  .btn-pulse      { animation: btnPulse 2.4s ease-in-out infinite; }
  .dot1 { animation: typingDot 1.2s 0.0s infinite; }
  .dot2 { animation: typingDot 1.2s 0.2s infinite; }
  .dot3 { animation: typingDot 1.2s 0.4s infinite; }

  .chatbot-font { font-family: 'DM Sans', sans-serif; }
  .chat-scroll::-webkit-scrollbar { width: 4px; }
  .chat-scroll::-webkit-scrollbar-track { background: transparent; }
  .chat-scroll::-webkit-scrollbar-thumb { background: #d1fae5; border-radius: 99px; }

  .msg-bot  { background: #f0fdf4; color: #1e293b; border: 1px solid #dcfce7; border-bottom-left-radius: 4px !important; }
  .msg-user { background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; border-bottom-right-radius: 4px !important; }

  .send-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border: none; outline: none; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .send-btn:hover  { transform: scale(1.07); box-shadow: 0 4px 14px rgba(34,197,94,0.45); }
  .send-btn:active { transform: scale(0.95); }

  .chat-input {
    font-family: 'DM Sans', sans-serif;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .chat-input:focus { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.12); }

  .quick-chip {
    background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
    font-size: 11.5px; padding: 4px 10px; border-radius: 99px; cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }
  .quick-chip:hover { background: #dcfce7; transform: translateY(-1px); }

  .close-btn {
    background: rgba(255,255,255,0.15); border: none; cursor: pointer;
    border-radius: 50%; width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .close-btn:hover { background: rgba(255,255,255,0.3); }
`;

// ── Quick suggestion chips ───────────────────────────────────────────────────
const QUICK_CHIPS = [
  'What is MedHealth.ai?',
  'How do I upload a prescription?',
  'How does BMI work?',
  'Is my data secure?',
];

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="msg-appear flex items-end gap-2 mb-3">
      {/* Bot avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#22c55e,#16a34a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 13 }}>🤖</span>
      </div>
      <div className="msg-bot" style={{
        padding: '10px 14px', borderRadius: 14, display: 'flex', gap: 5, alignItems: 'center',
      }}>
        <span className="dot1" style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
        <span className="dot2" style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
        <span className="dot3" style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
      </div>
    </div>
  );
}

// ── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.from === 'bot';
  return (
    <div className={`msg-appear flex items-end gap-2 mb-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: isBot ? 'linear-gradient(135deg,#22c55e,#16a34a)' : '#e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13,
      }}>
        {isBot ? '🤖' : '👤'}
      </div>
      {/* Bubble */}
      <div
        className={isBot ? 'msg-bot' : 'msg-user'}
        style={{
          padding: '9px 13px',
          borderRadius: 14,
          maxWidth: '78%',
          fontSize: 13.5,
          lineHeight: 1.55,
          fontFamily: "'DM Sans', sans-serif",
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ── Main Chatbot Component ───────────────────────────────────────────────────
export default function Chatbot() {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi there! 👋 I\'m your MedHealth.ai assistant.\n\nI can help you understand medicines, prescriptions, BMI, and how to use this platform. What can I help you with?' },
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = (text || input).trim();
    if (!userMessage) return;

    setShowChips(false);
    setMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: data.reply || 'Sorry, I couldn\'t get a response. Please try again.' }]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: '⚠️ Something went wrong. Please check your connection and try again.' }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleChip = (chip) => sendMessage(chip);

  const handleClear = () => {
    setMessages([{ from: 'bot', text: 'Chat cleared! How can I help you? 😊' }]);
    setShowChips(true);
  };

  return (
    <>
      <style>{styleTag}</style>

      {/* ── Floating Toggle Button ────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        {/* Pulse ring behind button */}
        {!isOpen && (
          <div className="pulse-ring" style={{
            position: 'absolute', inset: -4,
            borderRadius: '50%', border: '2px solid #22c55e',
            pointerEvents: 'none',
          }} />
        )}
        <button
          onClick={() => setIsOpen(o => !o)}
          className={!isOpen ? 'btn-pulse' : ''}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg,#22c55e,#15803d)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            fontSize: 22,
          }}
          title={isOpen ? 'Close chat' : 'Open MedHealth Assistant'}
        >
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.18-1.35A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 13H7v-2h4v2zm4-4H7V9h8v2z"/>
            </svg>
          )}
        </button>

        {/* Unread badge (when closed and messages > 1) */}
        {!isOpen && messages.length > 1 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: '#fff',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {messages.filter(m => m.from === 'bot').length}
          </div>
        )}
      </div>

      {/* ── Chat Window ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="chat-window chatbot-font"
          style={{
            position: 'fixed', bottom: 92, right: 24, zIndex: 9998,
            width: 360, maxHeight: 560,
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(34,197,94,0.1)',
            border: '1px solid #dcfce7',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* ── Header ─────────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {/* Logo area */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {/* Cross / medical icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                <rect x="7" y="2" width="4" height="14" rx="1"/>
                <rect x="2" y="7" width="14" height="4" rx="1"/>
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                <span style={{ color: '#bbf7d0' }}>MedHe</span>alth.ai
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#86efac', borderRadius: '50%', display: 'inline-block' }}/>
                AI Health Assistant · Online
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleClear}
                className="close-btn"
                title="Clear chat"
                style={{ fontSize: 13 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="close-btn"
                title="Close"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Messages area ───────────────────────────────────── */}
          <div
            className="chat-scroll"
            style={{
              flex: 1, overflowY: 'auto',
              padding: '14px 14px 4px',
              minHeight: 0,
              maxHeight: 360,
            }}
          >
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* ── Quick chips ──────────────────────────────────────── */}
          {showChips && !isTyping && (
            <div style={{
              padding: '6px 14px 8px',
              display: 'flex', flexWrap: 'wrap', gap: 6,
              borderTop: '1px solid #f0fdf4',
            }}>
              {QUICK_CHIPS.map(chip => (
                <button key={chip} className="quick-chip" onClick={() => handleChip(chip)}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* ── Input bar ───────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '10px 12px 12px',
              borderTop: '1px solid #f0fdf4',
              display: 'flex', gap: 8, alignItems: 'center',
              background: '#fff',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about medicines, health…"
              disabled={isTyping}
              style={{
                flex: 1, borderRadius: 12, padding: '9px 13px',
                fontSize: 13.5, color: '#1e293b',
              }}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isTyping || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (isTyping || !input.trim()) ? 0.5 : 1,
                cursor: (isTyping || !input.trim()) ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>

          {/* ── Branding footer ──────────────────────────────────── */}
          <div style={{
            padding: '5px 0 7px',
            textAlign: 'center',
            fontSize: 10.5,
            color: '#94a3b8',
            fontFamily: "'DM Sans', sans-serif",
            background: '#fafafa',
            borderTop: '1px solid #f1f5f9',
          }}>
            Powered by <span style={{ color: '#16a34a', fontWeight: 600 }}>MedHe</span>
            <span style={{ color: '#374151', fontWeight: 600 }}>alth.ai</span>
            <span style={{ color: '#cbd5e1' }}> · Not a medical diagnosis</span>
          </div>
        </div>
      )}
    </>
  );
}