"use client";

import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { LogIn } from "lucide-react";
import { Github, Linkedin, Instagram } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: "600" });

export default function Home() {
  const router = useRouter();

  const goToLogin = () => router.push("/login");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/backgorund2.png')",
      }}
    >
      {/* Top Bar with Text Logo and Login Button */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-6">
        {/* Text Logo */}
        <div className={`text-3xl font-extrabold ${poppins.className}`}>
          <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </div>

        {/* Login Button */}
        <button
  onClick={goToLogin}
  className="group px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-semibold shadow hover:from-green-600 hover:to-green-700 transition flex items-center gap-2 cursor-pointer"
>
  <LogIn className="inline w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1" /> Login
</button>

      </div>

      {/* Centered Get Started Section */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-3xl w-full text-center px-6 z-10">
        {/* Paragraph Text */}
        <p className="text-md mb-6 leading-relaxed text-black">
          <span className={`font-bold  text-5xl block mb-2 ${poppins.className} `}>
            Welcome to <span className="text-green-500">MedHe</span>
            <span className="text-black">alth.ai</span>
          </span>
          <span className="font-semibold  text-2xl block mb-2">
            {" "}
            Your Trusted Partner in Smarter, AI-Powered Healthcare
          </span>
          <span className="text-gray-600">
            Using advanced AI technology, we help you better understand, track,
            and manage your health concerns with confidence and ease. Learn how
            MedHealth can support your journey to better health.
          </span>
        </p>

        {/* Get Started Button */}
        <div className="flex justify-center">
          <button
            onClick={goToLogin}
            className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-2 cursor-pointer"
          >
            Get Started
            <ArrowRight className="inline w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
     

      </div>
         {/* Social Media Handles in Bottom-Right Corner */}
<div className="absolute bottom-6 right-8 flex space-x-6  z-20">
  {/* Twitter */}
  <a href="#" target="_blank" rel="noopener noreferrer">
    <Github className="w-7 h-7 text-gray-600 hover:text-green-500 transition" />
  </a>
  {/* LinkedIn */}
  <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
    <Linkedin className="w-7 h-7 text-gray-600 hover:text-green-500 transition" />
  </a>
  {/* Instagram */}
  <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">
    <Instagram className="w-7 h-7 text-gray-600 hover:text-green-500 transition" />
  </a>
</div>
    </div>
  );
}
