import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Mic, X, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage, Language, TRANSLATIONS } from '../types';
import { chatWithBodaPesa } from '../services/geminiService';
import { cn } from '../lib/utils';

interface Props {
  language: Language;
}

export const ChatBot: React.FC<Props> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithBodaPesa(text, history, language);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        setIsRecording(false);
        const simulatedVoiceText = language === 'lg' ? "Njagala kumanya obwesigwa bwange" : 
                                  language === 'sw' ? "Nataka kujua alama yangu ya imani" : 
                                  "I want to know my trust score";
        handleSend(simulatedVoiceText);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 bg-yellow-400 text-black p-4 rounded-full shadow-2xl z-50 border-4 border-black"
      >
        <MessageSquare size={32} />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-black"
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 lg:bottom-24 lg:right-8 w-[calc(100vw-3rem)] lg:w-96 h-[500px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border-4 border-black overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-yellow-400 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400 p-1.5 rounded-lg">
                  <Bot size={20} className="text-black" />
                </div>
                <span className="font-black uppercase tracking-widest text-sm">BodaPesa Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center mt-10 opacity-40">
                  <Bot size={48} className="mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase">How can I help you today?</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={cn("flex items-start gap-2", m.role === 'user' ? "flex-row-reverse" : "")}>
                  <div className={cn("p-2 rounded-lg", m.role === 'user' ? "bg-yellow-400" : "bg-black text-white")}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm font-medium leading-tight shadow-sm",
                    m.role === 'user' ? "bg-yellow-100 rounded-tr-none" : "bg-white border border-gray-200 rounded-tl-none"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="bg-black text-white p-2 rounded-lg">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none">
                    <Loader2 size={16} className="animate-spin opacity-40" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-2 border-gray-100">
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-2xl border border-gray-200">
                <button 
                  onClick={toggleRecording}
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    isRecording ? "bg-red-600 text-white animate-pulse" : "bg-black text-yellow-400"
                  )}
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder={t.chatPlaceholder}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
                />
                <button 
                  onClick={() => handleSend(input)}
                  className="bg-yellow-400 text-black p-2 rounded-xl"
                >
                  <Send size={20} />
                </button>
              </div>
              {isRecording && (
                <p className="text-[10px] text-center mt-2 font-black uppercase text-red-600 animate-pulse">
                  {t.voiceInput}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
