import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Footer() {
  return (
    <footer className="bg-white text-black border-t border-green-100">

      {/* Main content */}
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start gap-10">

        {/* ── Left: Logo + tagline + socials ─────────────────────── */}
        <div className="flex flex-col items-start gap-2">
          <div className={`${poppins.className} text-2xl font-bold`}>
            <span className="text-green-500">MedHe</span>
            <span className="text-gray-900">alth.ai</span>
          </div>

          <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
            Your intelligent AI health companion. Making medicine simple.
          </p>

          {/* Social icons */}
          <div className="flex gap-3 mt-2">
            {[
              { icon: <FaFacebookF size={13} />, href: '#' },
              { icon: <FaTwitter   size={13} />, href: '#' },
              { icon: <FaInstagram size={13} />, href: '#' },
              { icon: <FaLinkedinIn size={13} />, href: '#' },
            ].map(({ icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-green-500 hover:text-white transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Right: Links ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">

          {/* Services */}
          <div>
            <h3 className={`${poppins.className} text-sm font-700 text-gray-900 uppercase tracking-wider mb-3`}>
              Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/upload-prescription" className="hover:text-green-500 transition-colors duration-150">Upload Prescription</a></li>
              <li><a href="/medicine-search"     className="hover:text-green-500 transition-colors duration-150">Medicine Search</a></li>
              <li><a href="/save-track"          className="hover:text-green-500 transition-colors duration-150">Save &amp; Track</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className={`${poppins.className} text-sm font-700 text-gray-900 uppercase tracking-wider mb-3`}>
              Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#contact" className="hover:text-green-500 transition-colors duration-150">Contact Us</a></li>
              <li><a href="#about"   className="hover:text-green-500 transition-colors duration-150">About Us</a></li>
              <li><a href="#faq"     className="hover:text-green-500 transition-colors duration-150">FAQs</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 px-6 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} MedHealth.ai. All rights reserved.</p>
          <p>Not a substitute for professional medical advice.</p>
        </div>
      </div>

    </footer>
  );
}