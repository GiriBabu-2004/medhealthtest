'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md shadow-md">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">MedHealth</div>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 font-medium">
          <a href="#home" className="hover:text-blue-500">Home</a>
          <a href="#services" className="hover:text-blue-500">Services</a>
          <a href="#about" className="hover:text-blue-500">About Us</a>
          <a href="#contact" className="hover:text-blue-500">Contact</a>
        </div>

        {/* Profile */}
        <div className="relative">
          <img
            src={user?.photoURL}
            alt="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500"
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 text-sm">
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-800"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white shadow-md px-6 py-3">
          <a href="#home" className="py-2" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#services" className="py-2" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" className="py-2" onClick={() => setMenuOpen(false)}>About Us</a>
          <a href="#contact" className="py-2" onClick={() => setMenuOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
}
