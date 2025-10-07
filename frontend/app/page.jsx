//app/page.jsx

'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToLogin = () => router.push('/login');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-700">
          Welcome to My App 🚀
        </h1>
        <p className="text-gray-700 mb-6 text-lg">
          Start your journey by signing in to your account.
        </p>
        <button
          onClick={goToLogin}
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
