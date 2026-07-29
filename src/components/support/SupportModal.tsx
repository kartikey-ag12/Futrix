"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, Send, Bot, User, Sparkles, RefreshCcw, Mail, HelpCircle,
  ArrowRight, CheckCircle2, MessageSquare
} from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
};

const QUICK_QUESTIONS = [
  "How do I connect Xero?",
  "How is cash flow forecasting calculated?",
  "How do I export transactions to CSV?",
  "How do I invite team members?",
];

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your **Futrix AI Support Assistant**. How can I help you with your financial dashboard, forecasting, or Xero integrations today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user_${crypto.randomUUID()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages,
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `bot_${crypto.randomUUID()}`,
        sender: "bot",
        text: data.reply || "I am here to help! Please let me know if you need assistance with forecasting or Xero.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${crypto.randomUUID()}`,
          sender: "bot",
          text: "I'm having trouble connecting right now. Please email our support team at **support@futrix.com**.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-2xl h-[600px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">Futrix Support Assistant</h3>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">24/7 AI-Powered Customer & Product Support</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close support chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? "" : "flex-row-reverse"}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isBot ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-teal-500 text-slate-950 font-black"
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? "bg-slate-900 border border-slate-800 text-slate-200"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-medium"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-2 ${isBot ? "text-slate-500" : "text-slate-900/60"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Support Assistant is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
            Quick Ask:
          </span>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full whitespace-nowrap transition-colors flex-shrink-0 border border-slate-700/50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Futrix, Xero, or forecasting..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-40 flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Powered by Futrix AI Engine</span>
            <a href="mailto:support@futrix.com" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
              <Mail className="w-3 h-3" /> Email Human Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
