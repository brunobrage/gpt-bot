"use client";

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: "system", content: "You're a math teacher." } // Mensagem inicial
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { role: "assistant", content: "An error occurred" };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.role === 'user' ? 'text-blue-500' : 'text-green-500'}`}>
            <strong>{msg.role === 'user' ? 'You: ' : 'Bot: '}</strong>{msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        className="border p-2 mb-4 w-full"
        style={{ color: 'black' }} 
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Loading..." : "Send Message"}
      </button>
    </div>
  );
}
