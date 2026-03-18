
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles, Shield, User } from 'lucide-react';
import { Match, Message, Language } from '../types';
import { getMessages, sendMessage, subscribeToMessages } from '../services/chatService';
import { translations } from '../utils/translations';
import { getCurrentUser } from '../services/auth';

interface Props {
  match: Match;
  language: Language;
  onBack: () => void;
}

export const ChatWindow: React.FC<Props> = ({ match, language, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const t = translations[language].social;

  useEffect(() => {
    initChat();
    const subscription = subscribeToMessages(match.id, (newMsg) => {
      setMessages(prev => {
        if (prev.find(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [match.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = async () => {
    const user = await getCurrentUser();
    setCurrentUserId(user?.id || null);
    const history = await getMessages(match.id);
    setMessages(history);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(match.id, inputText.trim());
    if (success) {
      setInputText('');
    }
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#080808] flex flex-col overflow-hidden safe-area-inset">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 liquid-glass border-b border-white/5 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <User size={18} className="text-indigo-300" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{match.otherUser?.soulTitle}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Soul Connection Active</span>
            </div>
          </div>
        </div>

        <button className="p-2 text-white/20 hover:text-white/40">
           <Shield size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 custom-scrollbar">
        <div className="mb-8 text-center px-8">
            <div className="inline-block p-1 bg-white/[0.03] rounded-full mb-4 px-4 py-1.5 border border-white/5">
                <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Encrypted Resonance</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed font-light">
                Connect with the soul behind <span className="text-indigo-400 font-medium">"{match.otherUser?.soulTitle}"</span>. 
                {match.otherUser?.radarScores && Array.isArray(match.otherUser.radarScores) && (
                  <> Your shared resonance is <span className="text-pink-400 font-medium">{Math.round(match.otherUser.radarScores.reduce((a,b)=>a+b,0)/5 || 0)}</span>.</>
                )}
            </p>
        </div>

        {messages.map((msg, i) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                isMine 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20' 
                  : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
              }`}>
                {msg.content}
                <div className={`text-[9px] mt-1.5 font-mono ${isMine ? 'text-white/40' : 'text-white/20'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 pb-10 liquid-glass border-t border-white/5">
        <form onSubmit={handleSend} className="relative flex items-end gap-2">
            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[24px] focus-within:border-indigo-500/30 transition-all overflow-hidden p-1 px-4 flex items-center gap-2">
              <Sparkles size={16} className="text-white/10" />
              <textarea 
                rows={1}
                placeholder={t.chat_placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/20 focus:outline-none resize-none max-h-32"
              />
            </div>
            <button 
              type="submit"
              disabled={!inputText.trim() || sending}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                inputText.trim() ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-white/10'
              }`}
            >
              <Send size={18} fill={inputText.trim() ? "currentColor" : "none"} />
            </button>
        </form>
      </div>
    </div>
  );
};
