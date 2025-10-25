import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });
export default function Footer() {
  return (
    <footer className="bg-white text-black py-10 border-t border-green-500">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">

        {/* Left Side - Logo and Rights */}
        <div className="flex flex-col items-start space-y-2">
          <div className={`${poppins.className} text-2xl font-bold flex items-center`}>
          <span className="text-green-500">MedHe</span>
            <span className="text-black">alth.ai</span>
          </div>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} MedHealth. All rights reserved.
          </p>
           <div className="flex mt-4 space-x-4">
            <a href="#" className="text-gray-600 hover:text-green-500"><FaFacebookF /></a>
            <a href="#" className="text-gray-600 hover:text-green-500"><FaTwitter /></a>
            <a href="#" className="text-gray-600 hover:text-green-500"><FaInstagram /></a>
            <a href="#" className="text-gray-600 hover:text-green-500"><FaLinkedinIn /></a>
          </div>
        </div>
        

        {/* Right Side - Links and Socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-12 space-y-8 md:space-y-0">

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <ul className="space-y-1 text-gray-600">
              <li><a href="/upload-prescription" className="hover:text-green-500">Upload Prescription</a></li>
              <li><a href="/medicine-search" className="hover:text-green-500">Medicine Search</a></li>
              <li><a href="/save-track" className="hover:text-green-500">Save & Track</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Support</h3>
            <ul className="space-y-1 text-gray-600">
              <li><a href="#" className="hover:text-green-500">Contact Us</a></li>
                            <li><a href="#" className="hover:text-green-500">About Us</a></li>
              <li><a href="#" className="hover:text-green-500">FAQs</a></li>

            </ul>
          </div>

          {/* Social Icons */}
         
        </div>
      </div>
    </footer>
  );
}

