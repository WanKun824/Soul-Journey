
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { MatchProfile } from '../types';
import { Button } from './Button';
import {
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Copy, Check, Sparkles, Heart, AlertTriangle,
  Fingerprint, ChevronDown, ChevronUp, ArrowRight, Zap, Share2
} from 'lucide-react';
import { translations } from '../utils/translations';

interface Props {
  profile: MatchProfile;
  onRestart: () => void;
  onGoSocial: () => void;
  text: typeof translations['en']['results'];
}

// ── Animated Radar Chart Component ──
const AnimatedRadarChart: React.FC<{ data: any[]; text: any }> = ({ data, text }) => {
  const [animValue, setAnimValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1800; // Slower, more "majestic" animation
    const raf = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4); // ease-out quartic
      setAnimValue(ease);
      if (t >= 1) clearInterval(raf);
    }, 16);

    return () => clearInterval(raf);
  }, [inView]);

  const animatedData = data.map(d => ({ ...d, A: d.A * animValue }));

  return (
    <div ref={ref} className="relative w-full aspect-square max-w-[360px] mx-auto transform-gpu" style={{ transform: 'translateZ(0)' }}>
      {/* Radial glow layers with increased vibrancy */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 75%)',
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(236,72,153,0.15) 0%, transparent 65%)',
        }}
      />

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={animatedData}>
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.7} />
              <stop offset="70%" stopColor="#c084fc" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
            </radialGradient>
            <filter id="glow-vivid" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <PolarGrid
            gridType="circle"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}
            tickLine={false}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="soul"
            dataKey="A"
            stroke="#c084fc"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="url(#radarFill)"
            fillOpacity={1}
            filter="url(#glow-vivid)"
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Score dots overlay */}
      {animValue > 0.95 && data.map((d, i) => {
        const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
        const r = 0.35 * (d.A / 100); 
        const dotX = 0.5 + r * Math.cos(angle);
        const dotY = 0.5 + r * Math.sin(angle);
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#fff,0_0_30px_#a855f7]"
            style={{
              left: `calc(${dotX * 100}% - 6px)`,
              top: `calc(${dotY * 100}% - 6px)`,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Refined Fade-in Card with Squish ──
const SquishCard: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ scale: 0.99, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`liquid-glass border border-white/5 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ── Main Component ──
export const ResultsScreen: React.FC<Props> = ({ profile, onRestart, onGoSocial, text }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [shared, setShared] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  const getDimensionLabel = (key: string) =>
    text.dimensions?.[key as keyof typeof text.dimensions] ?? key;

  const chartData = (profile.scores || []).map(s => ({
    subject: getDimensionLabel(s.dimension),
    A: s.score,
    fullMark: 100,
  }));

  const shareLink = `${window.location.origin}${window.location.pathname}?code=${profile.soulId}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Soul Journey - ${profile.mbtiType}`,
          text: `Check out my soul projection: ${profile.summary.slice(0, 50)}...`,
          url: shareLink,
        });
      } catch (err) {
        console.log('Share failed', err);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const idealPartner = profile.idealPartner || { description: '', traits: [], dealBreakers: [] };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#030303] text-white selection:bg-indigo-500/30">
      
      {/* ══ HERO AREA ══ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 0.3], [0, -100]) }}
            className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-radial-gradient from-indigo-900/10 via-transparent to-transparent opacity-50" 
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-10 text-center">
            {text.title}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={heroLoaded ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
          className="w-full relative z-10"
        >
          <AnimatedRadarChart data={chartData} text={text} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={heroLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8, ease: "backOut" }}
          className="text-center mt-8 relative z-10"
        >
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {profile.mbtiType || 'Soul Explorer'}
          </h1>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={heroLoaded ? { opacity: 0.4 } : {}}
          transition={{ delay: 2 }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
        >
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Scroll Manifest</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ CONTENT AREA ══ */}
      <div className="max-w-xl mx-auto px-6 pb-32 flex flex-col gap-6 relative z-10">
        
        {/* Soul Summary - Focus on Typography & Aesthetic */}
        <SquishCard className="p-8 rounded-[40px] relative overflow-hidden group" delay={0}>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] group-hover:bg-indigo-500/10 transition-colors" />
          <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 font-serif italic selection:text-indigo-300">
            "{profile.summary}"
          </p>
        </SquishCard>

        {/* Ideal Partner - Visual Hierarchy */}
        <SquishCard className="p-8 rounded-[40px] relative overflow-hidden" delay={0.1}>
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px]" />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-inner">
              <Heart size={18} className="text-rose-400 fill-current" />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">{text.idealMatchTitle}</h3>
          </div>

          <p className="text-lg text-white/80 leading-relaxed mb-8 font-light italic border-l-3 border-rose-500/20 pl-6">
            {idealPartner.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] rounded-3xl p-5 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles size={12} className="text-emerald-400" />
                 <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{text.lookFor}</span>
              </div>
              <ul className="flex flex-col gap-3">
                {(idealPartner.traits || []).map(t => (
                  <li key={t} className="text-xs text-white/70 flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_8px_#4ade80]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/[0.02] rounded-3xl p-5 border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                 <AlertTriangle size={12} className="text-amber-400" />
                 <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{text.dealBreakers}</span>
              </div>
              <ul className="flex flex-col gap-3">
                {(idealPartner.dealBreakers || []).map(t => (
                  <li key={t} className="text-xs text-white/60 flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0 opacity-50" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SquishCard>

        {/* Guidance - Deep Texture */}
        <SquishCard
          className="p-8 rounded-[40px] relative overflow-hidden group shadow-indigo-500/5"
          style={{ background: 'linear-gradient(165deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.03) 100%)' }}
          delay={0.2}
        >
          <div className="flex items-center gap-3 mb-6">
            <Zap size={16} className="text-indigo-400 fill-indigo-400/20" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30">{text.adviceTitle}</h3>
          </div>
          <p className="text-base font-light leading-relaxed text-indigo-100/80 whitespace-pre-wrap">
            {profile.compatibilityAdvice}
          </p>
        </SquishCard>

        {/* Action: Resonance Discovery */}
        <motion.button 
          onClick={onGoSocial}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-24 rounded-[40px] p-[1.5px] bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500 shadow-[0_20px_40px_rgba(99,102,241,0.2)] overflow-hidden"
        >
           <div className="w-full h-full bg-[#080808] rounded-[39px] flex items-center px-8 gap-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                 <Sparkles className="text-indigo-300" size={24} />
              </div>
              <div className="flex-1 text-left">
                 <h4 className="text-lg font-bold tracking-tight text-white mb-0.5">Soul Resonance</h4>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest">Connect with similar frequency</p>
              </div>
              <ArrowRight className="text-white/20" size={20} />
           </div>
        </motion.button>

        {/* Action: Share & Restart */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleShare}
            className="h-16 rounded-[28px] bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            {shared ? <Check size={18} /> : <Share2 size={18} />}
            {shared ? 'URL Copied' : text.shareBtn}
          </button>
          <button 
            onClick={onRestart}
            className="h-16 rounded-[28px] bg-white/5 border border-white/10 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 text-white/60"
          >
            <Zap size={16} />
            {text.retakeBtn}
          </button>
        </div>

        {/* Simplified History - Deep Scroll */}
        <div className="mt-12">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-center gap-3 text-white/20 hover:text-white/50 transition-colors uppercase tracking-[0.4em] text-[9px] font-bold py-6 group"
          >
            <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-white/10 transition-colors" />
            {showHistory ? text.hideHistory : text.viewHistory}
            <ChevronDown size={14} className={`transition-transform duration-500 ${showHistory ? 'rotate-180' : ''}`} />
            <div className="h-[1px] flex-1 bg-white/5 group-hover:bg-white/10 transition-colors" />
          </button>

          <AnimatePresence>
            {showHistory && profile.history && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 py-6">
                  {(profile.history.questions || []).map((q, idx) => {
                    const ans = profile.history!.answers.find(a => a.questionId === q.id)?.value;
                    return (
                      <div key={q.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex gap-5">
                         <span className="text-[10px] font-mono text-white/15 pt-1">{String(idx+1).padStart(2,'0')}</span>
                         <div className="flex-1">
                            <p className="text-sm text-white/60 mb-4">{q.text}</p>
                            <div className="flex items-center justify-between">
                               <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">{getDimensionLabel(q.dimension)}</span>
                               <div className="flex gap-1.5">
                                 {[1,2,3,4,5].map(v => (
                                   <div key={v} className={`w-1.5 h-1.5 rounded-full ${v <= (ans||0) ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' : 'bg-white/5'}`} />
                                 ))}
                               </div>
                            </div>
                         </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
