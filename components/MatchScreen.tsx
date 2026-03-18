
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Sparkles, MessageCircle, ArrowLeft, Info, Zap } from 'lucide-react';
import { SocialProfile, Language } from '../types';
import { getRecommendedSouls, swipe } from '../services/matchService';
import { translations } from '../utils/translations';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface Props {
  language: Language;
  onBack: () => void;
  onMatch: (profile: SocialProfile) => void;
  onGoToInbox: () => void;
  currentUserScores?: number[];
}

export const MatchScreen: React.FC<Props> = ({ language, onBack, onMatch, onGoToInbox, currentUserScores }) => {
  const [souls, setSouls] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState<SocialProfile | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<SocialProfile | null>(null);
  
  const t = translations[language].social;
  const resText = translations[language].results;

  useEffect(() => {
    loadSouls();
  }, []);

  const loadSouls = async () => {
    setLoading(true);
    const data = await getRecommendedSouls(15);
    setSouls(data);
    setLoading(false);
  };

  const handleSwipe = async (direction: 'like' | 'dislike') => {
    const soul = souls[currentIndex];
    if (!soul) return;

    const isMatch = await swipe(soul.id, direction);
    if (isMatch && direction === 'like') {
      setShowMatchModal(soul);
    }

    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Zap className="text-indigo-400 animate-pulse mb-4" size={48} />
        <p className="text-white/40 font-mono text-sm tracking-widest uppercase animate-pulse">
          Searching Resonance...
        </p>
      </div>
    );
  }

  const currentSoul = souls[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col overflow-hidden safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-6 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white/60">{t.discovery_title}</h2>
        <button onClick={onGoToInbox} className="relative p-2 -mr-2 text-white/40 hover:text-white transition-colors">
          <MessageCircle size={24} />
        </button>
      </div>

      <div className="flex-1 relative px-4 flex items-center justify-center">
        {currentSoul ? (
          <AnimatePresence mode="popLayout">
            <SwipeCard 
              key={currentSoul.id}
              soul={currentSoul}
              currentUserScores={currentUserScores}
              onSwipe={handleSwipe}
              resText={resText}
              language={language}
              onShowDetail={(s) => setShowDetailModal(s)}
            />
          </AnimatePresence>
        ) : (
          <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 max-w-xs mx-auto">
            <Sparkles className="mx-auto text-white/20 mb-4" size={32} />
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {t.discovery_empty}
            </p>
            <button onClick={loadSouls} className="liquid-glass-primary w-full py-3 rounded-full text-sm font-bold">
              Refresh Sector
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      <AnimatePresence>
        {showMatchModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center max-w-sm w-full"
            >
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Heart className="text-rose-500 fill-rose-500 animate-ping absolute inset-0" size={80} />
                  <Heart className="text-rose-500 fill-rose-500 relative" size={80} />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">{t.match_alert}</h2>
              <p className="text-white/60 mb-10 leading-relaxed">{t.match_subtitle}</p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => { onMatch(showMatchModal); setShowMatchModal(null); }}
                  className="w-full liquid-glass-primary py-4 rounded-full font-bold"
                >
                  {t.chat_btn}
                </button>
                <button 
                  onClick={() => setShowMatchModal(null)}
                  className="w-full text-white/40 text-sm py-4 hover:text-white transition-colors"
                >
                  {t.keep_swiping}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Soul Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6"
            onClick={() => setShowDetailModal(null)}
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-white/[0.03] border border-white/10 rounded-[40px] w-full max-w-sm p-8 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{showDetailModal.soulTitle}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Soul Detail Archive</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailModal(null)}
                  className="p-2 -mr-2 text-white/30 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/60 mb-3">{resText.adviceTitle}</h4>
                  <p className="text-white/80 leading-relaxed text-sm italic">
                    "{showDetailModal.summary}"
                  </p>
                </div>

                {showDetailModal.idealPartner && (
                  <>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/60 mb-3">{resText.lookFor}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(showDetailModal.idealPartner.traits || []).map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
                             {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400/60 mb-3">{resText.dealBreakers}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(showDetailModal.idealPartner.dealBreakers || []).map((t: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs text-rose-400">
                             {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={() => setShowDetailModal(null)}
                className="w-full mt-10 liquid-glass-primary py-4 rounded-full font-bold"
              >
                关闭查询
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CardProps {
  soul: SocialProfile;
  currentUserScores?: number[];
  onSwipe: (dir: 'like' | 'dislike') => void;
  resText: any;
  language: Language;
  onShowDetail: (soul: SocialProfile) => void;
}

const SwipeCard: React.FC<CardProps> = ({ soul, currentUserScores, onSwipe, resText, language, onShowDetail }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 0.5, 1, 0.5, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (_, info: any) => {
    if (info.offset.x > 100) onSwipe('like');
    else if (info.offset.x < -100) onSwipe('dislike');
  };

  const scores = Array.isArray(soul.radarScores) ? soul.radarScores : [0,0,0,0,0];
  const chartData = (scores).map((s, i) => {
    const dimKeys = ['Wealth & Consumption', 'Family & Boundaries', 'Lifestyle & Pace', 'Conflict & Comms', 'Growth & Beliefs'];
    return {
      subject: resText.dimensions?.[dimKeys[i]] || dimKeys[i],
      A: currentUserScores?.[i] || 0,
      B: s,
      fullMark: 100,
    };
  });

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full max-w-[380px] aspect-[3/4.5] liquid-glass rounded-[40px] p-6 shadow-2xl cursor-grab active:cursor-grabbing preserve-3d"
    >
      {/* Swipe Badges */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 border-4 border-emerald-500 rounded-xl px-4 py-1.5 -rotate-12">
        <span className="text-3xl font-black text-emerald-500 uppercase tracking-widest">LIKE</span>
      </motion.div>
      <motion.div style={{ opacity: dislikeOpacity }} className="absolute top-8 right-8 z-20 border-4 border-rose-500 rounded-xl px-4 py-1.5 rotate-12">
        <span className="text-3xl font-black text-rose-500 uppercase tracking-widest">NOPE</span>
      </motion.div>

      <div className="h-full flex flex-col gap-6">
        {/* Profile Card Info */}
        <div className="relative pt-6">
          <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
          <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{soul.soulTitle}</h3>
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Resonance: {Math.round(soul.distance || 0)}%</p>
        </div>

        {/* Radar Comparison */}
        <div className="flex-1 border border-white/5 rounded-3xl bg-white/[0.02] flex items-center justify-center p-2 relative overflow-hidden min-w-0">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <Heart className="text-rose-500" size={120} />
          </div>
          <div className="w-full h-full min-w-0 transform-gpu" style={{ transform: 'translateZ(0)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <defs>
                   <radialGradient id="userRadarFill" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                   </radialGradient>
                   <radialGradient id="matchRadarFill" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity={0.1} />
                   </radialGradient>
                </defs>
                <PolarGrid gridType="circle" stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 500 }} />
                <Radar
                   name="You"
                   dataKey="A"
                   stroke="#818cf8"
                   strokeWidth={1.5}
                   strokeLinejoin="round"
                   strokeLinecap="round"
                   fill="url(#userRadarFill)"
                   fillOpacity={1}
                />
                <Radar
                   name="Soul"
                   dataKey="B"
                   stroke="#f472b6"
                   strokeWidth={3}
                   strokeLinejoin="round"
                   strokeLinecap="round"
                   fill="url(#matchRadarFill)"
                   fillOpacity={1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pb-4">
          <p className="text-sm text-white/60 leading-relaxed line-clamp-3 italic">
            "{soul.summary}"
          </p>
        </div>

        {/* Buttons for Desktop/Manual Swipe */}
        <div className="flex justify-between items-center px-4 mt-auto">
          <button 
            onClick={() => onSwipe('dislike')}
            className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center text-rose-400 hover:bg-rose-500/10 transition-colors border border-white/5"
          >
            <X size={28} />
          </button>
          
          <button 
            onClick={() => onSwipe('like')}
            className="w-20 h-20 rounded-full bg-indigo-500 shadow-[0_0_30px_#6366f1] flex items-center justify-center text-white hover:scale-105 transition-transform"
          >
            <Heart size={36} fill="white" />
          </button>
          
          <button 
            onClick={() => onShowDetail(soul)}
            className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center text-indigo-400 hover:bg-indigo-500/10 transition-colors border border-white/5 active:scale-95"
          >
            <Info size={28} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
