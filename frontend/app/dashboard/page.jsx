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
import { Edit2 } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showModal, setShowModal] = useState(false);
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
<div
  className={`fixed top-1/3 left-0 transform transition-transform duration-700 z-40 ${
    showFeedback ? 'translate-x-0' : '-translate-x-[80%]'
  }`}
>
  <button
    onClick={() => {
      if (!showFeedback) {
        // First click → show full button
        setShowFeedback(true);
        // Auto-hide after 5s
        setTimeout(() => setShowFeedback(false), 5000);
      } else {
        // Second click → open popup
        setShowModal(true);
      }
    }}
    className="bg-green-500 hover:bg-green-600 text-white px-1 py-3 rounded-r-full shadow-lg transition-all duration-300 flex items-center gap-2"
  >
    FeedBack <span className="hidden sm:inline"><ChevronRight className='w-5 h-5'/></span>
  </button>
</div>

{/* Feedback Popup Modal */}
{showModal && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={(e) => {
      if (e.target === e.currentTarget) setShowModal(false);
    }}
  >
    <div className="bg-white max-w-md p-6 shadow-lg relative animate-fadeIn ">
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
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
