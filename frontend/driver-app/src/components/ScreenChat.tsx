import React, { useState } from 'react';
import { 
  Send, 
  Phone, 
  ArrowRight
} from 'lucide-react';
import { ChatMessage, CargoJob } from '../types';
import { QUICK_CHAT_OPTIONS } from '../data';

interface ScreenChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  job: CargoJob;
  onProceedToTrust: () => void;
  onBackToTrip: () => void;
}

export const ScreenChat: React.FC<ScreenChatProps> = ({
  messages,
  onSendMessage,
  job,
  onProceedToTrust,
  onBackToTrip,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickChipClick = (chip: string) => {
    onSendMessage(chip);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-between max-w-2xl mx-auto select-none p-3 pb-16">
      {/* Top Bar for Chat Partner */}
      <div className="bg-ink text-card rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary text-card font-bold flex items-center justify-center font-display text-sm">
            JC
          </div>
          <div>
            <div className="font-bold text-sm text-card">
              {job.dropoff.recipientName}
            </div>
            <div className="text-xs text-white/70 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-status-verified" />
              <span>Receiving Lead • Memorial Hospital East</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert(`Dialing recipient: ${job.dropoff.recipientPhone}`)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-card cursor-pointer transition-colors"
            title="Call Recipient"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[50vh]">
        {messages.map((msg) => {
          const isDriver = msg.sender === 'driver';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isDriver ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[11px] text-muted mb-1 px-1">
                {msg.senderName} • {msg.timestamp}
              </div>
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isDriver
                    ? 'bg-primary text-card rounded-br-none shadow-sm'
                    : 'bg-card text-ink rounded-bl-none border border-border shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick One-Handed Driver Text Chips */}
      <div className="pt-2 pb-3 space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted px-1 flex items-center justify-between">
          <span>One-Tap Driver Quick Chips</span>
          <span className="text-[10px] text-muted">Tap to send immediately</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_CHAT_OPTIONS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickChipClick(chip)}
              className="touch-btn shrink-0 bg-card hover:bg-surface text-ink text-xs font-semibold px-3 py-2 rounded-xl border border-border shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex space-x-2 pt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to recipient or dispatch..."
          className="flex-1 px-4 py-3.5 rounded-xl border border-border text-sm font-medium focus:border-primary focus:outline-none bg-card text-ink"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="touch-btn px-5 bg-primary hover:bg-primary-dark disabled:bg-neutral-state text-card font-bold rounded-xl flex items-center justify-center shadow cursor-pointer transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Next Flow Action */}
      <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-xs">
        <button
          onClick={onBackToTrip}
          className="font-bold text-ink hover:underline cursor-pointer"
        >
          ← Back to Active Trip
        </button>
        <button
          onClick={onProceedToTrust}
          className="font-bold text-primary hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>View Trust Score</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
