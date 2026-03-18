
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, Search, Heart, ChevronRight } from 'lucide-react';
import { Match, Language } from '../types';
import { getMatchList } from '../services/chatService';
import { translations } from '../utils/translations';

interface Props {
  language: Language;
  onBack: () => void;
  onSelectMatch: (match: Match) => void;
}

export const MatchHub: React.FC<Props> = ({ language, onBack, onSelectMatch }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const t = translations[language].social;

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    const data = await getMatchList();
    setMatches(data);
    setLoading(false);
  };

  const filteredMatches = matches.filter(m => 
    m.otherUser?.soulTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col overflow-hidden safe-area-inset">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white leading-none">{t.inbox_title}</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Match List */}
      <div className="flex-1 overflow-y-auto px-6 pb-20 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-20">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="space-y-3">
            {filteredMatches.map((match, i) => (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="w-full p-4 liquid-glass rounded-3xl flex items-center gap-4 group active:scale-[0.98] transition-all border border-white/5"
              >
                {/* Avatar Placeholder / Soul Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20 flex items-center justify-center p-0.5 shadow-inner">
                   <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center overflow-hidden">
                      <Heart size={20} className="text-white/10 group-hover:text-rose-400 group-hover:scale-110 transition-all duration-500" fill="currentColor" />
                   </div>
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                      {match.otherUser?.soulTitle}
                    </h3>
                    <span className="text-[10px] font-mono text-white/20 uppercase">
                      Matched {new Date(match.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 truncate italic">
                    {match.otherUser?.summary}
                  </p>
                </div>

                <ChevronRight size={18} className="text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
              <MessageCircle size={24} className="text-white/10" />
            </div>
            <p className="text-white/30 text-sm">{t.inbox_empty}</p>
          </div>
        )}
      </div>
    </div>
  );
};
