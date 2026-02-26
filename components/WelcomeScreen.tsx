
import React from 'react';
import { Button } from './Button';
import { Sparkles, Activity, Fingerprint, ArrowRight, Hexagon } from 'lucide-react';
import { translations } from '../utils/translations';
import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
  onLookup: () => void;
  text: typeof translations['en']['welcome'];
}

export const WelcomeScreen: React.FC<Props> = ({ onStart, onLookup, text }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white pt-20 pb-10 font-sans">
      
      {/* Fluid Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/40 rounded-full blur-3xl mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-purple-800/30 rounded-full blur-3xl mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-fuchsia-900/30 rounded-full blur-3xl mix-blend-screen"
        />
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left animate-enter visible">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-8 shadow-lg">
                <Sparkles size={14} className="text-yellow-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">AI-Powered Psychology</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 leading-tight text-white drop-shadow-2xl">
                {text.screen1_title}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 font-light mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {text.screen1_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button 
                    onClick={onStart} 
                    className="text-lg px-10 py-5 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center gap-3 font-medium transition-all hover:scale-105 shadow-[inset_0_0_15px_rgba(255,255,255,0.8),0_0_15px_rgba(255,255,255,0.4)] border-0"
                >
                    {text.startBtn}
                    <ArrowRight size={20} />
                </Button>
                <button 
                    onClick={onLookup}
                    className="px-10 py-5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors backdrop-blur-sm"
                >
                    {text.lookupBtn}
                </button>
            </div>
            <div className="mt-8 text-xs text-white/40 font-mono tracking-widest uppercase flex items-center justify-center lg:justify-start gap-4">
                <span className="flex items-center gap-2"><Activity size={12}/> {text.timeEst}</span>
            </div>
        </div>

        {/* Right Content / Glass Cards */}
        <div className="flex-1 w-full max-w-md lg:max-w-full perspective-1000">
            <motion.div 
              className="grid grid-cols-1 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
                <motion.div variants={cardVariants} className="p-8 rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 group cursor-default hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <Activity className="text-indigo-400 mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.8)] transition-all duration-500" size={32} />
                    <h3 className="text-xl font-bold mb-2 text-white/90">{text.screen2_title}</h3>
                    <p className="text-white/70 leading-relaxed text-sm font-light">
                        {text.screen2_desc}
                    </p>
                </motion.div>
                
                <motion.div variants={cardVariants} className="p-8 rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 group cursor-default lg:translate-x-8 hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <Hexagon className="text-fuchsia-400 mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(232,121,249,0.8)] transition-all duration-500" size={32} />
                    <h3 className="text-xl font-bold mb-2 text-white/90">{text.screen3_title}</h3>
                    <p className="text-white/70 leading-relaxed text-sm font-light">
                        {text.screen3_desc}
                    </p>
                </motion.div>

                 <motion.div variants={cardVariants} className="p-8 rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-500 group cursor-default hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                    <Fingerprint className="text-cyan-400 mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-500" size={32} />
                    <h3 className="text-xl font-bold mb-2 text-white/90">{text.screen4_title}</h3>
                    <p className="text-white/70 leading-relaxed text-sm font-light">
                        {text.screen4_desc}
                    </p>
                </motion.div>
            </motion.div>
        </div>

      </div>

      <footer className="absolute bottom-6 w-full text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">Soul Journey Engine v2.0</p>
      </footer>

    </div>
  );
};
