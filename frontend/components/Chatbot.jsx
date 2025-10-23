'use client';
import { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleToggle = () => setIsOpen(!isOpen);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMessage }]);
    setInput('');

    // Send the message to your API route
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { from: 'bot', text: data.reply }]);
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        💬
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg font-semibold">
            Website Assistant
          </div>

          <div className="flex-1 p-3 overflow-y-auto h-64 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md ${
                  msg.from === 'bot'
                    ? 'bg-gray-100 text-gray-800 self-start'
                    : 'bg-blue-500 text-white self-end'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t flex">
            <input
              type="text"
              className="flex-1 border rounded-md px-2 py-1 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
