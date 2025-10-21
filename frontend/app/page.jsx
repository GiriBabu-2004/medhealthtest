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
        backgroundImage: "url('/backgorund2.png')",
      }}
    >
      {/* Top Bar with Text Logo and Login Button */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
        {/* Text Logo */}
        <div className={`text-3xl font-extrabold ${poppins.className}`}>
          <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </div>

        {/* Login Button */}
        <button
          onClick={goToLogin}
          className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-100 transition"
        >
          Login
        </button>
      </div>

      {/* Right-middle Get Started Section with paragraph text */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 max-w-md z-10 text-white">
        {/* Paragraph Text */}
        <p className="text-lg mb-6 leading-relaxed text-right text-black">
          Welcome to <span className="text-green-500 font-semibold">MedHealth.ai</span> — your
          intelligent healthcare assistant. Our platform leverages advanced AI technology to help you
          monitor, manage, and improve your health from anywhere in the world.
          <br /><br />
          Whether you're tracking symptoms, reviewing insights, or connecting with professionals,
          MedHealth.ai ensures a personalized, secure, and seamless healthcare experience.
        </p>

        {/* Get Started Button */}
        <div className="flex justify-end">
          <button
            onClick={goToLogin}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
