'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: '700' });

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleScroll = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const menuItems = [
    { name: 'Home',     id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'About Us', id: 'about' },
    { name: 'Contact',  id: 'contact' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-green-100">
      <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <div className={`text-2xl font-extrabold ${poppins.className} cursor-pointer select-none`}
          onClick={(e) => handleScroll(e, 'home')}
        >
          <span className="text-green-500">MedHe</span>
          <span className="text-gray-900">alth.ai</span>
        </div>

        {/* ── Desktop nav links ────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-7 font-medium">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group cursor-pointer">
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScroll(e, item.id)}
                className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
              >
                {item.name}
              </a>
              <span className="absolute left-0 -bottom-[4px] w-0 h-[2px] bg-green-500 rounded-full transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* ── Right side: profile + mobile toggle ─────────────── */}
        <div className="flex items-center gap-3">

          {/* Profile avatar + dropdown */}
          {user && (
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full cursor-pointer border-2 border-green-400 hover:border-green-500 transition-colors duration-200 object-cover"
                />
              ) : (
                /* Fallback avatar if no photo */
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-sm font-bold border-2 border-green-400 flex items-center justify-center"
                >
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </button>
              )}

              {/* Dropdown */}
              {dropdownOpen && (
                <>
                  {/* Backdrop to close */}
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl py-1.5 text-sm border border-gray-100 z-50">
                    {user.displayName && (
                      <p className="px-4 py-2 text-xs text-gray-400 font-medium truncate border-b border-gray-100">
                        {user.displayName}
                      </p>
                    )}
                    <button
                      onClick={() => { setDropdownOpen(false); onLogout(); }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 font-medium transition-colors duration-150"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile nav ───────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-green-100 px-6 py-3 flex flex-col gap-1 shadow-md">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={`#${item.id}`}
              onClick={(e) => handleScroll(e, item.id)}
              className="py-2.5 px-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors duration-150"
            >
              {item.name}
            </a>
          ))}
          {user && (
            <button
              onClick={() => { setMenuOpen(false); onLogout(); }}
              className="mt-1 py-2.5 px-3 text-left text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors duration-150"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}