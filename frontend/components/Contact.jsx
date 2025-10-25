'use client';
import { SendHorizontal } from 'lucide-react';
import { PhoneCall } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('✅ Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('❌ Failed to send message.');
      }
    } catch (err) {
      setStatus('⚠️ Error sending message.');
    }
  };

  return (
    <section id="contact" className="py-20 text-center">
      <h2 className="text-4xl font-bold text-black mb-6 flex items-center justify-center gap-2">
  <PhoneCall className="w-8 h-8 text-black" />
  <span>Contact Us</span>
</h2>

      <p className="text-gray-600 mb-8">
        Have questions or feedback? We’d love to hear from you!
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4 bg-white p-6  shadow-lg"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border "
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-3 border resize-none"
          rows="4"
          required
        ></textarea>

        <button
  type="submit"
  className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg hover:from-green-600 hover:to-green-700 transition flex items-center gap-2 cursor-pointer w-full justify-center "
>
  Send Message
  <SendHorizontal className="inline w-5 h-5 transform transition-transform duration-200 group-hover:translate-x-1" />
</button>


        {status && <p className="mt-3 text-gray-600">{status}</p>}
      </form>
    </section>
  );
}
