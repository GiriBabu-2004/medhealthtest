'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Poppins } from 'next/font/google';
const poppins = Poppins({ subsets: ['latin'], weight: '700' });
export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleScroll = (e, id) => {
    e.preventDefault(); // prevent default anchor jump
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "About Us", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md shadow-md border border-green-500">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <div className={`text-2xl font-extrabold ${poppins.className}`}>
          <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </div>

        {/* Nav Links */}
       <div className="hidden md:flex gap-6 font-medium">
      {menuItems.map((item) => (
        <div key={item.name} className="relative group cursor-pointer">
          <a
            href={`#${item.id}`}
            onClick={(e) => handleScroll(e, item.id)}
            className="text-black  transition-colors duration-300"
          >
            {item.name}
          </a>
          {/* Underline animation */}
          <span className="absolute left-0 -bottom-[5px] w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full"></span>
        </div>
      ))}
    </div>


        {/* Profile */}
        <div className="relative">
          <img
            src={user?.photoURL}
            alt="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-green-500"
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
