// src/components/ChatbotWidget.tsx
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import axios from 'axios';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input immediately after sending

    try {
      const response = await axios.post('http://localhost:5000/chat', { message: input }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const botMessage = { text: response.data.response, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Error: Could not reach chatbot.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or unwanted behavior
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="chatbot-window w-80 h-[400px] bg-[#EFF6FF] border-2 border-[#1E40AF] rounded-lg shadow-lg flex flex-col">
          <div
            className="chatbot-header bg-[#1E40AF] text-white p-2 flex justify-between items-center cursor-pointer rounded-t-md"
            onClick={() => setIsOpen(false)}
          >
            <span>Chatbot</span>
            <X className="close-icon h-5 w-5" />
          </div>
          <div className="chatbot-messages flex-1 p-3 overflow-y-auto bg-[#EFF6FF]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender} p-2 my-1 rounded-md max-w-[80%] ${
                  msg.sender === 'user'
                    ? 'bg-[#3B82F6] text-white ml-auto text-right'
                    : 'bg-[#BFDBFE] text-[#1E40AF] mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input flex p-3 bg-[#EFF6FF] border-t border-[#1E40AF] rounded-b-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)} // Fixed typo: was valueExteriorColor
              onKeyDown={handleKeyDown} // Updated to onKeyDown for consistency
              placeholder="Type your message..."
              className="flex-1 p-1 border border-[#1E40AF] rounded-md mr-2 bg-white text-[#1E40AF]"
            />
            <button
              onClick={sendMessage}
              className="bg-[#1E40AF] text-white px-4 py-1 rounded-md hover:bg-[#3B82F6]"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          className="chatbot-toggle bg-[#1E40AF] text-white p-3 rounded-full hover:bg-[#3B82F6]"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;