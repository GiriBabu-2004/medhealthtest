'use client';

import { useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: '600' });

export default function Home() {
  const router = useRouter();

  const goToLogin = () => router.push('/login');

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/medback.png')",
      }}
    >
      {/* Top Bar with Text Logo and Login Button */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
        {/* Text Logo */}
        <div className={`text-3xl font-extrabold  ${poppins.className}`}>
          <span className="text-green-400">MedHe</span>
          <span className="text-white">alth.ai</span>
        </div>

        {/* Login Button */}
        <button
          onClick={goToLogin}
          className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-100 transition"
        >
          Login
        </button>
      </div>

      {/* Centered Get Started Button */}
      <button
        onClick={goToLogin}
        className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition z-10"
      >
        Get Started
      </button>
    </div>
  );
}
