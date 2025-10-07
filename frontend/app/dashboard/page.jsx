//app/dashboard/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black bg-gray-50">
      {user && (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user.displayName}
          </h1>
          <div>Email: {user.email}</div>
          <div>
          <img
            src={user.photoURL}
            alt="User avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}
