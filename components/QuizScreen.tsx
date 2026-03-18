import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, QuizAnswer, UserDemographics, Language } from '../types';
import { translations } from '../utils/translations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  questions: Question[];
  language: Language;
  onComplete: (answers: QuizAnswer[]) => void;
  text: typeof translations['en']['quiz'];
}

type Slide = { kind: 'question'; qIndex: number };

export const QuizScreen: React.FC<Props> = ({ questions, language, onComplete, text }) => {
  const ALL_SLIDES: Slide[] = questions.map((_, i): Slide => ({ kind: 'question', qIndex: i }));
  const total = ALL_SLIDES.length;

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [anim, setAnim] = useState<'in' | 'left' | 'right'>('in');
  const touchX = useRef(0);

  useEffect(() => { setAnim('in'); }, [idx]);

  const slide = ALL_SLIDES[idx];
  const isLast = idx === total - 1;

  const canGoNext = (() => {
    if (!slide) return false;
    const q = questions[slide.qIndex];
    return q ? answers[q.id] !== undefined : false;
  })();

  const advance = (dir: 'next' | 'prev') => {
    if (dir === 'next' && !canGoNext) return;
    if (dir === 'prev' && idx === 0) return;

    if (dir === 'next' && isLast) {
      onComplete(Object.entries(answers).map(([id, v]) => ({ questionId: +id, value: v })));
      return;
    }
    setAnim(dir === 'next' ? 'left' : 'right');
    setTimeout(() => setIdx(i => i + (dir === 'next' ? 1 : -1)), 170);
  };

  const pickAnswer = (qId: number, val: number) => {
    const isNew = answers[qId] === undefined;
    setAnswers(p => ({ ...p, [qId]: val }));
    if (isNew) {
      setTimeout(() => {
        if (isLast) {
          const nextAnswers = { ...answers, [qId]: val };
          onComplete(Object.entries(nextAnswers).map(([id, v]) => ({ questionId: +id, value: v })));
        } else {
          setAnim('left');
          setTimeout(() => setIdx(i => i + 1), 170);
        }
      }, 300);
    }
  };

  const animCls = anim === 'in' ? 'opacity-100 translate-x-0' : anim === 'left' ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8';
  const answeredQ = Object.keys(answers).length;
  const progressPct = ((Math.min(idx, 3) + answeredQ) / total) * 100;

  /* ── Slide renderer ── */
  const renderSlide = () => {
    if (!slide) return null;

    /* Question */
    const q = questions[slide.qIndex];
    if (!q) return null;
    const cur = answers[q.id];
    return (
      <div className="text-center w-full">
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo-300/60 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/15 mb-8">
          {q.dimension}
        </span>
        <h2 className="text-xl sm:text-2xl font-medium leading-snug mb-10 text-white/90 px-1">
          {q.text}
        </h2>
        <div className="max-w-sm mx-auto w-full">
          <div className="flex justify-between mb-3 px-1">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{text.disagree}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider">{text.agree}</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map(val => (
              <button key={val} onClick={() => pickAnswer(q.id, val)}
                className={`flex-1 rounded-2xl transition-all duration-150 min-h-[64px] sm:min-h-[72px] flex items-center justify-center text-xl font-bold active:scale-95
                  ${cur === val
                    ? 'liquid-glass-primary scale-[1.06] shadow-[0_0_28px_rgba(255,255,255,0.2)]'
                    : 'liquid-glass-btn text-white/60'
                  }`}>
                {val}
              </button>
            ))}
          </div>
          {cur !== undefined && (
            <p className="text-center text-[10px] text-white/25 mt-3 tracking-widest uppercase">已选 {cur} · 可更改</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen w-full text-white flex flex-col"
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 60) { dx < 0 ? advance('next') : advance('prev'); }
      }}
    >
      {/* Progress bar */}
      <div className="w-full h-0.5 bg-white/5 sticky top-0 z-50 shrink-0">
        <div className="h-full bg-gradient-to-r from-indigo-400 to-rose-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Slide content */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-10 max-w-xl mx-auto w-full">
        <div className="text-xs font-mono text-white/20 mb-10 tracking-widest">
          {String(idx + 1).padStart(2, '0')} <span className="text-white/10">/</span> {String(total).padStart(2, '0')}
        </div>
        <div className={`w-full transition-all duration-[170ms] transform ${animCls}`}>
          {renderSlide()}
        </div>
      </div>

      {/* Bottom nav — Liquid Glass */}
      <div className="shrink-0 w-full px-5 py-3 liquid-glass" style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none', borderRadius: 0 }}>
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <button onClick={() => advance('prev')} disabled={idx === 0}
            className="liquid-glass-btn flex items-center gap-1 px-4 py-3 rounded-2xl text-white/50 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none text-sm">
            <ChevronLeft size={16} />
            <span className="hidden sm:inline text-xs">上一步</span>
          </button>

          <div className="flex-1 flex items-center justify-center">
            <span className="text-[11px] font-mono text-white/25">
              <span className="text-white/60">{answeredQ}</span> / {questions.length} 题
            </span>
          </div>

          <button onClick={() => advance('next')} disabled={!canGoNext}
            className={`flex items-center gap-1 px-4 py-3 rounded-2xl text-sm transition-all
              ${isLast && canGoNext ? 'liquid-glass-primary font-semibold' :
                canGoNext ? 'liquid-glass-btn text-white' :
                'liquid-glass-btn text-white/20 pointer-events-none opacity-40'}`}>
            <span className="hidden sm:inline text-xs">{isLast ? text.finish : '下一步'}</span>
            {isLast && canGoNext && <span className="sm:hidden text-xs">{text.finish}</span>}
            {!isLast && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};