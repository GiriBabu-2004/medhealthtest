//app/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/lib/firebase';
import { Poppins } from 'next/font/google';
  const poppins = Poppins({ subsets: ['latin'], weight: '600' });

import {
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { ArrowRight } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Github } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { Instagram } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) router.push('/dashboard');
    });
    return () => unsubscribe();
  }, [router]);

  // Handle Google login
  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Email login/register
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-black " style={{
      backgroundImage: "url('/backgorund2.png')",
    }}>
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
        {/* Text Logo */}
        <div className={`text-3xl font-extrabold ${poppins.className}`}>
          <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </div>
      </div>
      <div className="p-8 bg-white shadow-lg w-full max-w-sm ">
      <h1><div className={`text-xl text-center font-extrabold ${poppins.className}`}>
          <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </div></h1>
        <h1 className="text-sm mb-6 mt-4 text-center text-gray-600">
          {showReset
            ? 'Reset your password easily with MedHealth.ai'
            : isRegistering
            ? 'Create an account to get started with MedHealth.ai'
            : 'Login to MedHealth.ai using your preferred method'}
        </h1>

        {/* LOGIN / REGISTER FORM */}
        {!showReset ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border  focus:outline-none focus:ring-2 focus:ring-green-500 "
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border  focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="group w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-base shadow hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRegistering ? 'Sign Up' : 'Login'} <ArrowRight className="inline w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>
        ) : (
          // PASSWORD RESET FORM
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
            
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="group w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white  shadow hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Send Reset Link <ArrowRight className="inline w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>
        )}

        {/* ERROR & SUCCESS MESSAGES */}
        {error && <p className="text-red-500 mt-3 text-sm text-center">{error}</p>}
        {message && <p className="text-green-600 mt-3 text-sm text-center">{message}</p>}

        {/* LINK TO TOGGLE LOGIN / REGISTER / RESET */}
        <div className="text-center text-gray-700 mt-4 text-sm">
          {!showReset ? (
            <>
              <p>
                {isRegistering
                  ? 'Already have an account?'
                  : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {isRegistering ? 'Login' : 'Register'}
                </button>
              </p>
              <p className="mt-2">
                <button
                  onClick={() => setShowReset(true)}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </p>
            </>
          ) : (
            <p>
              Remember your password?{' '}
              <button
                onClick={() => setShowReset(false)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            </p>
          )}
        </div>

        {/* GOOGLE LOGIN */}
        {!showReset && (
          <>
            <div className="my-4 flex items-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-gray-700 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <button
  onClick={handleGoogleLogin}
  className="w-full py-2 bg-black text-white hover:bg-gray-800 transition cursor-pointer flex items-center justify-center gap-3 "
>
  <img
    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
    alt="Google Icon"
    className="w-4 h-4 bg-white rounded-full p-0.5"
  />
  <span className="font-medium text-sm sm:text-base">
    Continue with Google
  </span>
</button>
          </>
        )}
      </div>
        {/* Social Media Handles in Bottom-Right Corner */}
<div className="absolute bottom-6 right-8 flex space-x-6  z-20">
  {/* Twitter */}
  <a href="#" target="_blank" rel="noopener noreferrer">
    <Github className="w-7 h-7 text-gray-600 hover:text-green-500 transition" />
  </a>
  {/* LinkedIn */}
  <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
    <Linkedin className="w-7 h-7 text-gray-600 hover:text-green-500 transition" />
  </a>
  {/* Instagram */}
  <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">
    <Instagram className="w-7 h-7 text-gray-600 hover:text-green-500 transition" />
  </a>
</div>
    </div>
  );
}
