import React, { useState, useEffect } from 'react';
import { Question, QuizAnswer } from '../types';
import { translations } from '../utils/translations';

interface Props {
  questions: Question[];
  onComplete: (answers: QuizAnswer[]) => void;
  text: typeof translations['en']['quiz'];
}

export const QuizScreen: React.FC<Props> = ({ questions, onComplete, text }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [fade, setFade] = useState(true);

  // Safe access to current question
  const currentQuestion = questions && questions.length > 0 ? questions[currentIndex] : null;
  
  // Calculate percentage safely
  const progress = Math.round(((currentIndex) / (questions?.length || 1)) * 100);

  useEffect(() => {
    // Fade in on mount or question change
    setFade(true);
  }, [currentIndex]);

  const handleAnswer = (value: number) => {
    if (!currentQuestion) return;

    // Instant feedback is crucial for 100 questions. No long artificial delays.
    setFade(false); 
    
    // Slight delay for animation to register
    setTimeout(() => {
        const newAnswers = [...answers, { questionId: currentQuestion.id, value }];
        setAnswers(newAnswers);
        
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(newAnswers);
        }
    }, 200);
  };

  // Prevent rendering if question is missing (prevents the "reading 'dimension' of undefined" crash)
  if (!currentQuestion) {
    return (
        <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
            <div className="text-white animate-pulse">Loading Question...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex flex-col relative">
      
      {/* Top Bar */}
      <div className="w-full h-1 bg-neutral-900 sticky top-0 z-50">
        <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full z-10">
        
        <div className={`w-full text-center transition-all duration-300 transform ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            
            <span className="inline-block py-1 px-3 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-400 tracking-widest mb-12">
                {String(currentIndex + 1).padStart(2, '0')} / {questions.length} · {currentQuestion.dimension}
            </span>

            <h2 className="text-2xl md:text-4xl font-medium leading-normal mb-16 text-neutral-100">
                {currentQuestion.text}
            </h2>

            {/* Likert Scale - Optimized for quick clicking */}
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between mb-4 px-2">
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{text.disagree}</span>
                    <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{text.agree}</span>
                </div>
                
                <div className="grid grid-cols-5 gap-3 md:gap-6">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            onClick={() => handleAnswer(val)}
                            className={`
                                aspect-square rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-white hover:text-black hover:border-white transition-all duration-200
                                flex items-center justify-center text-lg font-medium text-neutral-400
                                ${val === 3 ? 'scale-90 opacity-70 hover:scale-100 hover:opacity-100' : ''}
                                ${val === 1 || val === 5 ? 'scale-105 font-bold' : ''}
                            `}
                        >
                            {val}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};