"use client";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { ArrowRight } from "lucide-react";
const poppins = Poppins({ subsets: ["latin"], weight: "700" });
export default function Hero() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        if (data.success) setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-start text-center px-6 pt-[100px] pb-20 min-h-screen"
    >
      {/* Hero content area (fills top of screen) */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <span
          className={`font-bold  text-6xl block mb-2 ${poppins.className} `}
        >
          Welcome to <span className="text-green-500">MedHe</span>
          <span className="text-black">alth.ai</span>
        </span>

        <p className="max-w-2xl text-md text-gray-600 mb-8 mx-auto">
          Upload your prescription or medicine image and instantly get detailed
          information. Search for specific medicines and manage your health
          effortlessly. Create your medicine track records with ease!
        </p>

        <button
          onClick={() => {
            const section = document.getElementById("services");
            if (section) section.scrollIntoView({ behavior: "smooth" });
          }}
          className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-2 cursor-pointer"
        >
          Try Now
          <ArrowRight className="inline w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Feedback Section */}
      {feedbacks.length > 0 && (
        <div className="w-full max-w-6xl bg-white  shadow-lg p-8 overflow-x-auto scrollbar-hide mt-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            ⭐ Top User Feedback
          </h2>

          <div className="flex gap-6 justify-start">
            {feedbacks.map((f, i) => (
              <div
                key={i}
                className="min-w-[260px] max-w-[280px] bg-blue-50 border border-blue-200  shadow-sm p-4 text-left flex-shrink-0 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-2">
                  {[...Array(f.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                  {[...Array(5 - f.rating)].map((_, i) => (
                    <span key={i} className="text-gray-300 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 italic line-clamp-3">
                  "{f.message}"
                </p>
                <p className="text-sm text-gray-600 mt-3 font-medium">
                  – {f.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
