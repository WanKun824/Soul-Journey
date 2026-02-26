
import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DemographicsForm } from './components/DemographicsForm';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { LookupScreen } from './components/LookupScreen';
import { AppStep, Question, UserDemographics, QuizAnswer, MatchProfile, Language } from './types';
import { generateQuizQuestions, analyzeProfile, getProfileBySoulId, translateQuestions } from './services/geminiService';
import { Loader2 } from 'lucide-react';
import { translations } from './utils/translations';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [demographics, setDemographics] = useState<UserDemographics | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [profile, setProfile] = useState<MatchProfile | null>(null);
  // Default to Chinese for UI
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        setStep(AppStep.LOADING_QUIZ); 
        getProfileBySoulId(code).then((p) => {
            if (p) {
                setProfile(p);
                setStep(AppStep.RESULTS);
            } else {
                setStep(AppStep.LOOKUP); 
            }
        });
    }
  }, []);

  const t = translations[language];

  // Initialize questions on load (respecting default language)
  useEffect(() => {
    if (questions.length === 0 && step === AppStep.WELCOME) {
      generateQuizQuestions(language).then(setQuestions);
    }
  }, [questions.length, step]);

  const handleStart = () => {
    setStep(AppStep.DEMOGRAPHICS);
  };

  const handleDemographicsComplete = (data: UserDemographics) => {
    setDemographics(data);
    if (questions.length > 0) {
      setStep(AppStep.QUIZ);
    } else {
      setStep(AppStep.LOADING_QUIZ);
      generateQuizQuestions(language).then((qs) => {
        setQuestions(qs);
        setStep(AppStep.QUIZ);
      });
    }
  };

  const handleQuizComplete = async (userAnswers: QuizAnswer[]) => {
    setAnswers(userAnswers);
    setStep(AppStep.ANALYZING);
    
    if (demographics) {
      try {
        const result = await analyzeProfile(demographics, questions, userAnswers, language);
        setProfile(result);
        setStep(AppStep.RESULTS);
      } catch (error) {
        console.error("Analysis Error", error);
        alert("System busy. Please try again.");
        setStep(AppStep.WELCOME);
      }
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setProfile(null);
    setStep(AppStep.WELCOME);
    window.history.pushState({}, document.title, window.location.pathname);
    // Refresh questions in current language
    generateQuizQuestions(language).then(setQuestions);
  };

  const toggleLanguage = () => {
      let newLang: Language = 'en';
      if (language === 'en') newLang = 'zh';
      else if (language === 'zh') newLang = 'ja';
      else newLang = 'en';

      setLanguage(newLang);

      // Immediately translate current questions if they exist
      if (questions.length > 0) {
          const translated = translateQuestions(questions, newLang);
          setQuestions(translated);
      }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-white transition-opacity duration-700`}>
      {/* Minimal Header with glass effect */}
      <header className="fixed top-0 w-full p-6 z-50 flex justify-between items-center text-white/90">
        <button 
            onClick={() => { setStep(AppStep.WELCOME); window.history.pushState({}, document.title, window.location.pathname); }} 
            className="font-bold text-sm tracking-widest uppercase hover:opacity-60 transition-opacity drop-shadow-md"
        >
            Soul Journey
        </button>
        <div className="flex items-center gap-4">
            <button 
                onClick={toggleLanguage}
                className="text-xs font-bold uppercase text-white/60 hover:text-white transition-colors bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10"
            >
                {language === 'en' ? 'EN' : (language === 'zh' ? '中文' : '日本語')}
            </button>
            {step !== AppStep.WELCOME && (
                <button onClick={handleRestart} className="text-xs font-bold uppercase text-white/60 hover:text-white transition-colors">
                    Exit
                </button>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {step === AppStep.WELCOME && (
          <WelcomeScreen onStart={handleStart} onLookup={() => setStep(AppStep.LOOKUP)} text={t.welcome} />
        )}

        {step === AppStep.LOOKUP && (
          <div className="min-h-screen flex items-center justify-center">
            <LookupScreen 
                onBack={() => setStep(AppStep.WELCOME)} 
                onProfileFound={(p) => { setProfile(p); setStep(AppStep.RESULTS); }}
                text={t.lookup}
            />
          </div>
        )}

        {step === AppStep.DEMOGRAPHICS && (
          <DemographicsForm onComplete={handleDemographicsComplete} text={t.demographics} />
        )}

        {(step === AppStep.LOADING_QUIZ || step === AppStep.ANALYZING) && (
          <div className="min-h-screen flex flex-col items-center justify-center text-center text-white">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-white/80 animate-spin mx-auto mb-6 relative z-10" />
            </div>
            <h2 className="text-3xl font-light text-white mb-3 tracking-tight animate-pulse drop-shadow-lg">
              {step === AppStep.LOADING_QUIZ ? t.loading.calibrating : t.loading.analyzing}
            </h2>
            <p className="text-white/50 font-mono text-xs uppercase tracking-widest">
              {step === AppStep.LOADING_QUIZ ? t.loading.generating : t.loading.consulting}
            </p>
          </div>
        )}

        {step === AppStep.QUIZ && questions.length > 0 && (
          <QuizScreen questions={questions} onComplete={handleQuizComplete} text={t.quiz} />
        )}

        {step === AppStep.RESULTS && profile && (
          <ResultsScreen profile={profile} onRestart={handleRestart} text={t.results} />
        )}
      </main>
    </div>
  );
}
