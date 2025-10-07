export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold text-blue-700 mb-6">Contact Us</h2>
      <p className="text-gray-600 mb-8">Have questions or feedback? We’d love to hear from you!</p>
      <form className="max-w-md mx-auto space-y-4">
        <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" />
        <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" />
        <textarea placeholder="Your Message" className="w-full p-3 border rounded-lg" rows="4"></textarea>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition">
          Send Message
        </button>
      </form>
    </section>
  );
}
