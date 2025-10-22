import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: "Upload Prescription",
      desc: "Get instant medicine info from your prescriptions.",
      route: "/upload-prescription",
    },
    {
      title: "Medicine Search",
      desc: "Find detailed info about any medicine.",
      route: "/medicine-search",
    },
    {
      title: "Save & Track",
      desc: "Save your searches and manage your medical history.",
      route: "/save-track",
    },
  ];

  return (
    <section id="services" className="py-20 text-center">
      <h2 className="text-4xl font-bold mb-8 text-blue-700">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        {services.map((service, i) => (
          <Link href={service.route} key={i} passHref>
            <div className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
