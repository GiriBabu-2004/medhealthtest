'use client';
import { useState } from 'react';

export default function FeedbackForm({ user }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const active = hover || rating;

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];
  const COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !message) return;
    setSubmitting(true);

    const payload = {
      userId: user?.uid,
      name: user?.displayName || 'Anonymous User',
      rating,
      message,
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setRating(0);
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full p-6">

      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" />
          Share Your Experience
        </div>
        <h2 className="text-2xl font-bold text-gray-900">We Value Your Feedback</h2>
        <p className="text-sm text-gray-500 mt-1">Help us improve MedHealth.ai</p>
      </div>

      {/* Star rating */}
      <div className="flex flex-col items-center mb-5 gap-2">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform duration-150 hover:scale-110 active:scale-95"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-9 h-9 cursor-pointer transition-all duration-200"
              >
                <defs>
                  <linearGradient id={`grad-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  fill={active >= star ? `url(#grad-${star})` : 'none'}
                  stroke={active >= star ? '#f59e0b' : '#d1d5db'}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Dynamic label */}
        <span
          className="text-sm font-semibold transition-all duration-200"
          style={{ color: active ? COLORS[active] : '#94a3b8', minHeight: 20 }}
        >
          {active ? LABELS[active] : 'Tap to rate'}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback..."
          rows="4"
          required
          className="w-full border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 p-3 text-sm text-gray-800 bg-gray-50 placeholder-gray-400 transition-all duration-200"
        />

        <button
          type="submit"
          disabled={submitting || !rating || !message.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Submitting…
            </>
          ) : 'Submit Feedback'}
        </button>

        {/* Hint when no rating selected */}
        {!rating && !status && (
          <p className="text-center text-xs text-gray-400">⭐ Select a star rating above</p>
        )}
      </form>

      {/* Status messages */}
      {status === 'success' && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Feedback submitted — thank you! 🎉
        </div>
      )}
      {status === 'error' && (
        <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
          <span>⚠️</span> Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}