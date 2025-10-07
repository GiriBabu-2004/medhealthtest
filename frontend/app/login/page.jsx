//app/login/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/lib/firebase';
import {
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-black">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-sm ">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          {showReset
            ? 'Reset Password'
            : isRegistering
            ? 'Create Account'
            : 'Login'}
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {isRegistering ? 'Sign Up' : 'Login'}
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* ERROR & SUCCESS MESSAGES */}
        {error && <p className="text-red-500 mt-3 text-sm text-center">{error}</p>}
        {message && <p className="text-green-600 mt-3 text-sm text-center">{message}</p>}

        {/* LINK TO TOGGLE LOGIN / REGISTER / RESET */}
        <div className="text-center mt-4 text-sm">
          {!showReset ? (
            <>
              <p>
                {isRegistering
                  ? 'Already have an account?'
                  : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-blue-600 hover:underline"
                >
                  {isRegistering ? 'Login' : 'Register'}
                </button>
              </p>
              <p className="mt-2">
                <button
                  onClick={() => setShowReset(true)}
                  className="text-blue-500 hover:underline"
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
                className="text-blue-600 hover:underline"
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
              <span className="px-2 text-gray-500 text-sm">or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
