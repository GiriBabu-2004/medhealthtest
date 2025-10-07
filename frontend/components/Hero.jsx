export default function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center text-center h-[90vh] bg-gradient-to-b from-blue-100 to-white"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-4">
        Welcome to <span className="text-blue-800">MedHealth</span>
      </h1>
      <p className="max-w-xl text-lg text-gray-600 mb-6">
        Upload your prescription or a medicine image and instantly get detailed
        medicine information. Search for specific medicines and manage your health easily.
      </p>
     <button className="group bg-blue-600 text-white px-6 py-3 shadow-md hover:bg-blue-700 transition flex items-center gap-2">
  Get Started
  <span className="transform transition-transform  duration-300 group-hover:translate-x-1">
    →
  </span>
</button>

    </section>
  );
}
