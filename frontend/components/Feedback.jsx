'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';

export default function FeedbackForm({ user }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !message) return alert('Please add rating and message.');

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
        setStatus('✅ Feedback submitted successfully!');
        setRating(0);
        setMessage('');
      } else {
        setStatus('❌ Error submitting feedback.');
      }
    } catch (err) {
      setStatus('⚠️ Failed to send feedback.');
    }
  };

  return (
    <div className="max-w-md w-full p-6">
      <h2 className="text-2xl font-bold text-center mb-4">We Value Your Feedback</h2>

      {/* ⭐ Animated Rating Stars */}
      <div className="flex justify-center mb-6 gap-x-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform duration-200 hover:scale-115"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              className={`w-8 h-8 cursor-pointer  transition-all duration-300 ${
                (hover || rating) >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'
              }`}
              stroke="currentColor"
            >
              <defs>
                <linearGradient id={`grad-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <path
                fill={(hover || rating) >= star ? `url(#grad-${star})` : 'none'}
                stroke={(hover || rating) >= star ? 'url(#grad-' + star + ')' : 'currentColor'}
                d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l7.1-1.01L12 2z"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border resize-none focus:outline-none p-3"
          rows="4"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2  hover:from-green-600 hover:to-green-700 transition-all duration-300"
        >
          Submit
        </button>
      </form>

      {status && <p className="mt-3 text-center text-gray-600">{status}</p>}
    </div>
  );
}
