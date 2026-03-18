
import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, ArrowRight, ChevronDown, Heart, Brain, Fingerprint } from 'lucide-react';
import { translations } from '../utils/translations';
import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
  onLookup: () => void;
  onSocial: () => void;
  text: typeof translations['en']['welcome'];
}

// ─────────────────────────────────────────
// Flowing Animated Background
// ─────────────────────────────────────────
const FlowingBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Base dark canvas */}
    <div className="absolute inset-0 bg-[#030014]" />
    
    {/* Animated Blobs */}
    <motion.div
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -50, 50, 0],
        scale: [1, 1.2, 0.9, 1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-indigo-600/20 blur-[80px] will-change-transform"
    />
    <motion.div
      animate={{
        x: [0, -120, 80, 0],
        y: [0, 100, -40, 0],
        scale: [1, 0.8, 1.1, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-fuchsia-600/15 blur-[80px] will-change-transform"
    />
    <motion.div
      animate={{
        x: [0, 50, -100, 0],
        y: [0, 80, 120, 0],
        scale: [1, 1.3, 1, 1],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-rose-600/10 blur-[80px] will-change-transform"
    />
    <motion.div
      animate={{
        rotate: [0, 360],
      }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
      style={{
        backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
  </div>
);

// ─────────────────────────────────────────
// Vaporwave neon animation panels – NO TEXT
// ─────────────────────────────────────────

const HEART_PATH = "M12,21.35C5.4,15.36,2,12.28,2,8.5C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3c3.08,0,5.5,2.42,5.5,5.5c0,3.78-3.4,6.86-10,12.85Z";

/** Panel 1: 霓虹心跳波纹 — neon heart pulse + ripple rings */
const VaporHeartPulse: React.FC = () => (
  <div
    className="relative w-full h-52 md:h-60 rounded-3xl liquid-glass overflow-hidden flex items-center justify-center translate-z-0"
    style={{ background: 'linear-gradient(135deg,#12002a,#200040,#0d0018)' }}
  >
    {/* CRT scanlines */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 3px)', backgroundSize: '100% 3px' }} />

    {/* Perspective grid floor */}
    <div className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none opacity-20"
      style={{
        backgroundImage: 'repeating-linear-gradient(90deg,#FF1493 0,#FF1493 1px,transparent 1px,transparent 28px),repeating-linear-gradient(0deg,#FF1493 0,#FF1493 1px,transparent 1px,transparent 14px)',
        backgroundSize: '28px 14px',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
      }}
    />

    {/* Expanding ripple rings */}
    {[0, 1, 2].map(i => (
      <motion.div key={i}
        className="absolute rounded-full border border-[rgba(255,20,147,0.5)] shadow-[0_0_12px_rgba(255,20,147,0.4)]"
        initial={{ width: 40, height: 40, opacity: 0.85 }}
        animate={{ width: 200, height: 200, opacity: 0 }}
        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.72, ease: 'easeOut' }}
      />
    ))}

    {/* Pulsing neon heart */}
    <div className="relative z-10 w-16 h-16 flex items-center justify-center">
      {/* Static glow element instead of animating SVG filter */}
      <motion.div 
        className="absolute inset-0 bg-[#FF1493] rounded-full blur-xl opacity-60"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
      />
      <motion.svg
        viewBox="0 0 24 24" className="absolute inset-0 w-full h-full drop-shadow-md"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 0.65, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
      >
        <path d={HEART_PATH} fill="#FF1493" />
      </motion.svg>
    </div>

    {/* Blinking indicator dot (no text) */}
    <motion.div
      className="absolute top-4 right-4 w-2 h-2 rounded-full shadow-[0_0_8px_#FF1493]"
      style={{ background: '#FF1493' }}
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1.5 }}
    />
  </div>
);

/** Panel 2: 霓虹心电图 — single EKG drawing line */
const VaporEKG: React.FC = () => {
  // A single heartbeat centered in the 400x100 view
  const singleBeat = "M 0,50 L 150,50 L 165,50 L 175,25 L 185,75 L 195,15 L 210,85 L 225,50 L 250,50 L 400,50";
  return (
    <div
      className="relative w-full h-52 md:h-60 rounded-3xl liquid-glass overflow-hidden flex items-center justify-center translate-z-0"
      style={{ background: 'linear-gradient(135deg,#00101a,#001828,#000d14)' }}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,#00ffff 0,#00ffff 1px,transparent 1px,transparent 4px)', backgroundSize: '100% 4px' }} />

      {/* Screen vignette */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_60px_rgba(0,255,255,0.08)]" />

      {/* Drawing EKG */}
      <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {/* Static faint baseline */}
        <path d="M 0,50 L 400,50" stroke="rgba(0,255,255,0.1)" strokeWidth="2" fill="none" />
        
        {/* Animated Drawing Path */}
        <motion.path
          d={singleBeat}
          stroke="#00FFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
        />
        {/* Glow trail */}
        <motion.path
          d={singleBeat}
          stroke="rgba(0,255,255,0.4)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
        />
      </svg>

      {/* Flicker overlay on "peak" */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_30px_rgba(0,255,255,0.06)] border border-[rgba(0,255,255,0.2)]"
        animate={{ opacity: [1, 1, 1.0, 0.5, 1] }}
        transition={{ duration: 2.7, repeat: Infinity, ease: 'linear', times: [0, 0.4, 0.45, 0.5, 0.55] }}
      />
    </div>
  );
};

/** Panel 3: 双心汇合 — two hearts drift and merge with neon ripple */
const VaporTwinMerge: React.FC = () => (
  <div
    className="relative w-full h-52 md:h-60 rounded-3xl liquid-glass overflow-hidden flex items-center justify-center translate-z-0"
    style={{ background: 'linear-gradient(135deg,#1a0030,#280040,#0a0020)' }}
  >
    {/* Grid bg */}
    <div className="absolute inset-0 pointer-events-none opacity-10"
      style={{
        backgroundImage: 'repeating-linear-gradient(90deg,#9400d3 0,#9400d3 1px,transparent 1px,transparent 32px),repeating-linear-gradient(0deg,#9400d3 0,#9400d3 1px,transparent 1px,transparent 32px)',
        backgroundSize: '32px 32px',
      }}
    />

    {/* Merge ripple — blooms when hearts "arrive" */}
    {[0, 1].map(i => (
      <motion.div key={i}
        className="absolute rounded-full border border-[rgba(255,255,255,0.4)] shadow-[0_0_16px_rgba(255,105,180,0.5)]"
        animate={{ width: [0, 180], height: [0, 180], opacity: [0.8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: i * 1.2, ease: 'easeOut', repeatDelay: 1.6 }}
      />
    ))}

    {/* Left heart container - animated horizontally */}
    <motion.div
      className="absolute flex items-center justify-center w-14 h-14"
      style={{ left: '15%' }}
      animate={{ x: [0, 72, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94], repeatDelay: 0.2 }}
    >
      <div className="absolute inset-0 bg-[#FF1493] rounded-full blur-md opacity-40" />
      <svg viewBox="0 0 24 24" className="absolute w-full h-full">
        <path d={HEART_PATH} fill="none" stroke="#FF1493" strokeWidth="2.5" />
      </svg>
    </motion.div>

    {/* Right heart container - animated horizontally */}
    <motion.div
      className="absolute flex items-center justify-center w-14 h-14"
      style={{ right: '15%' }}
      animate={{ x: [0, -72, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94], repeatDelay: 0.2 }}
    >
      <div className="absolute inset-0 bg-[#00FFFF] rounded-full blur-md opacity-40" />
      <svg viewBox="0 0 24 24" className="absolute w-full h-full">
        <path d={HEART_PATH} fill="none" stroke="#00FFFF" strokeWidth="2.5" />
      </svg>
    </motion.div>

    {/* Spark particles at center */}
    {[0, 1, 2, 3, 4, 5].map(i => {
      const angle = (i / 6) * 360;
      const rad = (angle * Math.PI) / 180;
      const tx = Math.cos(rad) * 40;
      const ty = Math.sin(rad) * 40;
      return (
        <motion.div key={i}
          className={`absolute w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-[#FF1493] shadow-[0_0_6px_#FF1493]' : 'bg-[#00FFFF] shadow-[0_0_6px_#00FFFF]'}`}
          animate={{ x: [0, tx, 0], y: [0, ty, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 2.0 + (i * 0.04), repeatDelay: 3.6 }}
        />
      );
    })}
  </div>
);


// ─────────────────────────────────────────
// Feature card
// ─────────────────────────────────────────
interface FProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  reverse?: boolean;
  neonColor: string;  // e.g. '#FF1493'
  visual: React.ReactNode;
}
const FeatureSection: React.FC<FProps> = ({ icon, title, desc, reverse = false, neonColor, visual }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-14`}
  >
    <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
      {/* Neon icon box – matches panel color */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: `rgba(0,0,0,0.4)`,
          border: `1.5px solid ${neonColor}`,
          boxShadow: `0 0 14px ${neonColor}55, inset 0 0 12px ${neonColor}22`,
          color: neonColor,
          filter: `drop-shadow(0 0 6px ${neonColor})`,
        }}
      >
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 leading-snug">{title}</h3>
      <p className="text-white/50 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
    <div className="flex-1 w-full">{visual}</div>
  </motion.div>
);

// ─────────────────────────────────────────
// Main WelcomeScreen
// ─────────────────────────────────────────
export const WelcomeScreen: React.FC<Props> = ({ onStart, onLookup, onSocial, text }) => {
  const features = [
    {
      icon: <Brain size={22} />,
      title: '60道深度探问，构建你的灵魂图谱',
      desc: '财富观、家庭边界、生活方式、沟通风格、个人成长——五大维度，每一道题都是一次自我内观。',
      neonColor: '#FF1493',
      visual: <VaporHeartPulse />,
    },
    {
      icon: <Sparkles size={22} />,
      title: 'AI 深度解析',
      desc: '先进的大语言模型接管分析，像关系心理学家一样解读你的内在矛盾、情感格局与精神图腾。',
      neonColor: '#00FFFF',
      reverse: true,
      visual: <VaporEKG />,
    },
    {
      icon: <Heart size={22} />,
      title: '生成你的灵魂伴侣画像',
      desc: '根据你的完整心理画像，生成专属伴侣蓝图——五种致命吸引特质与需要警惕的核心雷区。',
      neonColor: '#bf5af2',
      visual: <VaporTwinMerge />,
    },
  ];

  return (
    <div className="w-full flex flex-col text-white font-sans overflow-x-hidden relative">
      <FlowingBackground />

      {/* ══ HERO ══ */}
      <section className="min-h-screen flex flex-col relative pt-24 px-6 text-center overflow-hidden">

        {/* Hero content */}
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center relative z-10 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="max-w-3xl transform-gpu"
            style={{ transform: 'translateZ(0)' }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-md mb-8">
              <Sparkles size={14} className="text-yellow-200" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/90">AI-Powered Relationship Psychology</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05]">
              了解<span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">真实的</span>自己
            </h1>
            <p className="text-lg md:text-xl text-white/60 font-light mb-12 max-w-xl mx-auto leading-relaxed">
              60道深度问题 × AI 核心解析，为你绘制灵魂图谱
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center w-full px-4 sm:px-0">
              <Button onClick={onStart}
                className="w-full sm:w-auto text-base sm:text-xl px-10 sm:px-14 py-4 sm:py-6 rounded-full liquid-glass-primary flex items-center justify-center gap-3 font-bold hover:scale-110 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all">
                {text.startBtn} <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </Button>
              <button onClick={onLookup}
                className="w-full sm:w-auto liquid-glass-btn px-10 sm:px-14 py-4 sm:py-6 rounded-full text-white text-base sm:text-lg font-semibold hover:scale-110 border border-white/10 transition-all">
                {text.lookupBtn}
              </button>
              <button onClick={onSocial}
                className="w-full sm:w-auto liquid-glass border border-indigo-500/30 px-10 sm:px-14 py-4 sm:py-6 rounded-full text-indigo-300 text-base sm:text-lg font-semibold hover:bg-indigo-500/20 hover:scale-110 transition-all flex items-center justify-center gap-3">
                <Heart size={18} className="sm:w-5 sm:h-5" /> 灵魂契合
              </button>
            </div>
            <p className="mt-10 text-xs text-white/25 font-mono tracking-widest uppercase">{text.timeEst}</p>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y:[0,8,0], opacity:[0.3,0.6,0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
        >
          <div className="w-px h-6 bg-gradient-to-b from-white/0 to-white/20 rounded-full" />
          <ChevronDown size={14} className="text-white/20" />
        </motion.div>

        {/* ══ FEATURES (merged into hero section for seamless bg) ══ */}
        <div className="relative z-10 w-full text-center pt-16 pb-4 px-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-300/60 mb-3"
          >How it works</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-bold text-white tracking-tight"
          >AI 赋能的灵魂解析系统</motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-5 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
          />
        </div>

        <div className="max-w-5xl mx-auto w-full px-0 py-14 flex flex-col gap-20 relative z-10">
          {features.map((f, i) => <FeatureSection key={i} {...f} reverse={f.reverse} />)}
        </div>
      </section>

      {/* ══ 创作理念 ══ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once: true }}
            className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-300/50 mb-3">创作理念</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">为什么做 Soul Journey</h2>
          </motion.div>
          <div className="space-y-8">
            {[
              {
                icon: '✦',
                title: '亲密关系里，最难看见的是自己',
                body: '大多数感情困惑的根源，不是遇错了人，而是还没真正理解自己的需求与边界。我们想先帮你照见自己。',
              },
              {
                icon: '✦',
                title: '不要标签，要叙事',
                body: 'MBTI 给你四个字母，色彩性格给你贴颜色——但人比任何标签都复杂。AI 用一段文字深刻描述你，而不是一个字母。',
              },
              {
                icon: '✦',
                title: '你的灵魂档案，只属于你',
                body: '所有数据不上传服务器。生成的 Soul ID 本身就包含你的全部信息，可以跨设备随时还原——这是你自己的档案。',
              },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-5"
              >
                <span className="text-rose-400 text-lg shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white/90 mb-2">{item.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-24 px-6 flex flex-col items-center text-center relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        <motion.div
          initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
            准备好开启<br />你的灵魂旅程了吗？
          </h2>
          <p className="text-white/40 mb-8 text-base">60道问题，揭开你最真实的内心世界。</p>
          <Button onClick={onStart}
            className="w-full sm:w-auto text-base sm:text-xl px-10 sm:px-14 py-4 sm:py-6 rounded-full liquid-glass-primary flex items-center justify-center gap-3 font-bold hover:scale-110 mx-auto transition-all">
            {text.startBtn} <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </motion.div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="py-12 px-6 text-center border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto w-full">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20">Soul Journey · Digital Authenticity Protocol</p>
        <div className="flex items-center gap-1.5 text-[10px] text-white/15">
          <Fingerprint size={10} />
          <span>数据Preserved于本地逻辑，安全且私密</span>
        </div>
      </footer>
    </div>
  );
};
