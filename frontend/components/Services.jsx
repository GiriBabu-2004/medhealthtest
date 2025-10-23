import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
export default function Services() {
  const services = [
    {
      title: "Upload Prescription",
      desc: "Get instant medicine info from your prescriptions.",
      route: "/upload-prescription",
      image: "/banner/upload-pres.png",
    },
    {
      title: "Medicine Search",
      desc: "Find detailed info about any medicine.",
      route: "/medicine-search",
      image: "/banner/medicine-search.png",
    },
    {
      title: "Save & Track",
      desc: "Save your searches and manage your medical history.",
      route: "/save-track",
      image: "/banner/save-track.png",
    },
  ];

  return (
    <section id="services" className="py-20 text-center">
      <h2 className="text-4xl font-bold mb-10 text-black">Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-16">
        {services.map((service, i) => (
          <Link
            href={service.route}
            key={i}
            className="group bg-white  shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col text-left border-1 border-green-500"
          >
            {/* 🖼️ Image Section */}
            <div className="relative w-full h-48 mt-2">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* 🧾 Content Section */}
            <div className=" h-[1px] mt-2 bg-gray-300"></div>
            <div className="flex flex-col flex-grow p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4 text-md flex-grow">{service.desc}</p>

              {/* ➡️ Arrow aligned to bottom right */}
              <div className="flex justify-end">
                <ArrowRight className="w-6 h-6 text-green-600 transform transition-transform duration-200 group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}