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
import Feedback from '@/components/Feedback';
import Chatbot from '@/components/Chatbot';
import FAQSection from '@/components/FAQsection';

export default function Dashboard() {
  const [user, setUser] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
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
            <FAQSection />
            <Contact />
          </main>
          <Footer />
          <Chatbot />


          
{/* Feedback Floating Button */}
<button
  onClick={() => setShowFeedback(true)}
  className="fixed right-6 top-32 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 z-40"
>
  💬 Feedback
</button>

{/* Feedback Popup Modal */}
{showFeedback && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={(e) => {
      // close when clicking outside form
      if (e.target === e.currentTarget) setShowFeedback(false);
    }}
  >
    <div className="bg-white  max-w-md p-6  shadow-lg relative animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={() => setShowFeedback(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-700 text-xl font-bold cursor-pointer"
      >
        &times;
      </button>

      <Feedback user={user} />
    </div>
  </div>
)}

        </>
      )}
    </div>
  );
}
