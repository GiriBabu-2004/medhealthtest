'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Feedback from '@/app/feedback/page';

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
    <div className="text-gray-800 bg-gray-50 min-h-screen">
      {user && (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <main   style={{ backgroundImage: 'url("/mainback1.png")' }}
>
            <Hero />
            <Services />
            <About />
            <Contact />
            <Feedback />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
