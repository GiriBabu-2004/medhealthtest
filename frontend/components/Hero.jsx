'use client';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/feedback');
        const data = await res.json();
        if (data.success) setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-start text-center px-6 pt-[100px] pb-20 min-h-screen"
    >
      {/* Hero content area (fills top of screen) */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-4 leading-tight">
          Welcome to <span className="text-blue-800">MedHealth</span>
        </h1>

        <p className="max-w-xl text-lg text-gray-600 mb-8 mx-auto">
          Upload your prescription or medicine image and instantly get detailed
          information. Search for specific medicines and manage your health effortlessly.
        </p>

        <button
          onClick={() =>
            document.getElementById('save-track')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="group bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
        >
          Get Started
          <span className="transform transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* Feedback Section */}
      {feedbacks.length > 0 && (
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 overflow-x-auto scrollbar-hide mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            ⭐ Top User Feedback
          </h2>

          <div className="flex gap-6 justify-start">
            {feedbacks.map((f, i) => (
              <div
                key={i}
                className="min-w-[260px] max-w-[280px] bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-4 text-left flex-shrink-0 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  {[...Array(f.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                  {[...Array(5 - f.rating)].map((_, i) => (
                    <span key={i} className="text-gray-300 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic line-clamp-3">"{f.message}"</p>
                <p className="text-sm text-gray-600 mt-3 font-medium">– {f.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
