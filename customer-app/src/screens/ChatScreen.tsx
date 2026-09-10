import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  Headphones
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, chatMessages, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const quickReplies = [
    'What is your ETA?',
    'Please call when you arrive.',
    'Confirming pickup address.',
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 pb-24 h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top Header */}
      <div className="bg-card p-3.5 sm:p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-lg text-muted hover:text-ink hover:bg-surface"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-ink text-card flex items-center justify-center font-bold font-condensed">
              RK
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-status-verified ring-2 ring-card" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-ink flex items-center space-x-1.5">
              <span>{currentBooking.driver?.name} (Driver)</span>
              <span className="text-[10px] bg-surface text-muted px-1.5 py-0.5 rounded font-mono">
                {currentBooking.driver?.vehicleRegistration}
              </span>
            </h1>
            <p className="text-[11px] text-muted">
              Trip #{currentBooking.consignmentId} • Online
            </p>
          </div>
        </div>

        <a
          href={`tel:${currentBooking.driver?.phone}`}
          className="p-2 rounded-xl bg-surface hover:bg-neutral-state-tint text-primary transition-colors border border-border"
          title="Call Driver"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 bg-card rounded-2xl border border-border shadow-xs p-4 overflow-y-auto space-y-3">
        <div className="text-center my-2">
          <span className="text-[10px] text-muted bg-surface px-3 py-1 rounded-full border border-border">
            Secure Chat Channel with Driver & Support
          </span>
        </div>

        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isDispatch = msg.sender === 'dispatch';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-muted mb-1 px-1 flex items-center space-x-1">
                {isDispatch && <Headphones className="w-3 h-3 text-regulated-cargo" />}
                <span>{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-primary text-card rounded-tr-none'
                    : isDispatch
                    ? 'bg-regulated-cargo-tint text-ink border border-regulated-cargo/30 rounded-tl-none'
                    : 'bg-surface text-ink border border-border rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick message suggestions */}
      <div className="flex items-center space-x-2 py-2 overflow-x-auto shrink-0">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendChatMessage(reply)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-surface text-muted border border-border whitespace-nowrap transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="pt-1 shrink-0">
        <div className="flex items-center space-x-2 bg-card p-2 rounded-2xl border border-border shadow-xs">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to driver..."
            className="flex-1 px-3 py-2 text-xs text-ink bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-40 text-card transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
