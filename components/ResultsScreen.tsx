
import React, { useState } from 'react';
import { MatchProfile } from '../types';
import { Button } from './Button';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChevronDown, ChevronUp, Copy, Sparkles, Heart, AlertTriangle, Fingerprint } from 'lucide-react';
import { translations } from '../utils/translations';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  profile: MatchProfile;
  onRestart: () => void;
  text: typeof translations['en']['results'];
}

export const ResultsScreen: React.FC<Props> = ({ profile, onRestart, text }) => {
  const [showHistory, setShowHistory] = useState(false);

  const getDimensionLabel = (key: string) => {
    if (text.dimensions && text.dimensions[key as keyof typeof text.dimensions]) {
        return text.dimensions[key as keyof typeof text.dimensions];
    }
    return key;
  };

  const scores = profile.scores || [];
  const chartData = scores.map(s => ({
    subject: getDimensionLabel(s.dimension),
    originalKey: s.dimension,
    A: s.score,
    fullMark: 100
  }));

  const retrievalLink = `${window.location.origin}${window.location.pathname}?code=${profile.soulId}`;
  
  const copyLink = () => {
      navigator.clipboard.writeText(retrievalLink);
      alert("Link Copied");
  };

  const idealPartner = profile.idealPartner || { description: '', traits: [], dealBreakers: [] };

  return (
    <div className="min-h-screen w-full pt-24 pb-24 px-4 md:px-8 font-sans text-white">
      
      {/* Container with Fade Enter */}
      <div className="max-w-7xl mx-auto animate-enter visible">
        
        {/* Header - Floating Title */}
        <div className="text-center mb-16 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] -z-10"></div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-white/50 uppercase mb-4 drop-shadow-sm">{text.title}</h2>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white drop-shadow-2xl">
               {profile.mbtiType}
            </h1>
        </div>

        {/* visionOS Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1. Deep Analysis / Summary Card (Glass) */}
            <div className="md:col-span-12 glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden group transition-transform duration-500 hover:scale-[1.01]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                    <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90 tracking-wide font-serif">
                        {profile.summary}
                    </p>
                </div>
            </div>

            {/* 2. Radar Chart - The "Instrument" */}
            <div className="md:col-span-12 lg:col-span-5 glass-panel rounded-[32px] p-8 flex flex-col items-center justify-center relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[32px]"></div>
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8 absolute top-8 left-8">{text.chartTitle}</h3>
                <div className="w-full aspect-square max-w-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }} 
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name="You"
                                dataKey="A"
                                stroke="#a5b4fc"
                                strokeWidth={2}
                                fill="#6366f1"
                                fillOpacity={0.4}
                                isAnimationActive={true}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Ideal Partner - The "Hologram" */}
            <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-6">
                <div className="glass-panel rounded-[32px] p-8 md:p-10 flex-grow relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px]"></div>
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-rose-500/20 rounded-full backdrop-blur-md">
                            <Heart className="text-rose-200 fill-current" size={18} />
                        </div>
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">{text.idealMatchTitle}</h3>
                    </div>
                    
                    <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 font-light relative z-10 border-l-2 border-rose-500/30 pl-6">
                        {idealPartner.description}
                    </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10 mt-auto">
                        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                            <span className="text-[10px] font-bold text-white/30 block mb-4 uppercase tracking-widest">{text.lookFor}</span>
                            <ul className="space-y-3">
                                {(idealPartner.traits || []).map(t => (
                                    <li key={t} className="text-sm font-medium text-white/90 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                            <span className="text-[10px] font-bold text-white/30 block mb-4 uppercase tracking-widest">{text.dealBreakers}</span>
                            <ul className="space-y-3">
                                {(idealPartner.dealBreakers || []).map(t => (
                                    <li key={t} className="text-sm font-medium text-white/60 flex items-center gap-3">
                                        <AlertTriangle size={12} className="text-amber-500/80" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Advice - High Contrast Card */}
            <div className="md:col-span-12 glass-panel bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-[32px] p-8 md:p-12 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="text-amber-200" size={20} />
                        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">{text.adviceTitle}</h3>
                    </div>
                    <p className="text-xl md:text-2xl font-light leading-relaxed whitespace-pre-wrap text-white/90">
                        {profile.compatabilityAdvice}
                    </p>
                 </div>
            </div>

            {/* 5. Footer / ID Card */}
            <div className="md:col-span-12 glass-panel rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                        <QRCodeSVG value={retrievalLink} size={70} fgColor="#000" />
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2 justify-center md:justify-start">
                            <Fingerprint size={12} /> {text.featureCodeLabel}
                        </p>
                         <button onClick={copyLink} className="flex items-center gap-3 group bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <span className="text-xl font-mono font-medium text-white/90 tracking-wider">
                                {profile.soulId}
                            </span>
                            <Copy size={14} className="text-white/40 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="secondary" onClick={onRestart} className="rounded-full px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md">
                        {text.retakeBtn}
                    </Button>
                     <Button variant="primary" onClick={copyLink} className="rounded-full px-8 py-4 bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)] border-0">
                        {text.shareBtn}
                    </Button>
                </div>
            </div>

            {/* History Toggle */}
             <div className="md:col-span-12 flex justify-center mt-8">
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest px-4 py-2 rounded-full hover:bg-white/5"
                >
                    {showHistory ? text.hideHistory : text.viewHistory}
                    {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            {/* History Section */}
            {showHistory && profile.history && (
                <div className="md:col-span-12 glass-panel rounded-[32px] p-8 md:p-12 animate-fade-in visible">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {(profile.history.questions || []).map((q, idx) => {
                             const answerVal = profile.history!.answers.find(a=>a.questionId===q.id)?.value;
                             return (
                                <div key={q.id} className="border-b border-white/10 pb-6 last:border-0 break-inside-avoid">
                                    <div className="flex gap-4">
                                        <span className="text-xs font-mono text-white/30 pt-1">{String(idx+1).padStart(2,'0')}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white/80 mb-3 leading-relaxed">{q.text}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold uppercase text-white/30 tracking-wider bg-white/5 px-2 py-1 rounded">
                                                    {getDimensionLabel(q.dimension)}
                                                </span>
                                                <div className="flex gap-1.5">
                                                    {[1,2,3,4,5].map(v => (
                                                        <div 
                                                            key={v} 
                                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${v <= (answerVal||0) ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' : 'bg-white/10'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
