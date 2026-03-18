import React, { useState } from 'react';
import { Button } from './Button';
import { Search, ArrowLeft } from 'lucide-react';
import { translations } from '../utils/translations';
import { getProfileBySoulId } from '../services/soulService';
import { MatchProfile } from '../types';

interface Props {
  onBack: () => void;
  onProfileFound: (profile: MatchProfile) => void;
  onRetry?: (attempt: import('../types').QuizAttempt) => void;
  userId?: string;
  text: typeof translations['en']['lookup'];
}

export const LookupScreen: React.FC<Props> = ({ onBack, onProfileFound, onRetry, userId, text }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState<import('../types').QuizAttempt[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  React.useEffect(() => {
    if (userId) {
      setLoadingHistory(true);
      import('../services/soulService').then(m => m.getUserAttempts(userId))
        .then(data => setAttempts(data))
        .finally(() => setLoadingHistory(false));
    }
  }, [userId]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      const profile = await getProfileBySoulId(code.trim());
      if (profile) {
        onProfileFound(profile);
      } else {
        setError(text.notFound);
      }
    } catch {
      setError('System Error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto liquid-glass rounded-[32px] p-8 md:p-10">
      <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium uppercase tracking-widest">{text.back}</span>
      </button>

      <h2 className="text-2xl font-semibold text-white mb-8 text-center tracking-tight">{text.title}</h2>

      <form onSubmit={handleLookup} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={text.placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-2xl liquid-glass focus:border-indigo-400/60 focus:ring-0 outline-none transition-all font-mono text-lg text-white uppercase tracking-wider placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-white/20"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
        </div>

        {error && (
          <div className="text-rose-300 text-sm text-center font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !code}
          className="w-full liquid-glass-primary py-4 rounded-full font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? 'Reconstructing...' : text.submit}
        </button>
      </form>

      {userId && (
        <div className="mt-12 pt-8 border-t border-white/5 w-full">
          <h3 className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            我的灵魂档案
          </h3>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {loadingHistory ? (
              <div className="text-center py-4 text-white/20 text-xs animate-pulse">加载中...</div>
            ) : attempts.length === 0 ? (
              <div className="text-center py-6 text-white/10 text-xs italic">暂无历史记录</div>
            ) : (
              attempts.map(att => (
                <div key={att.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/30 truncate w-32">{att.soulId}</span>
                    <span className="text-[10px] text-white/20">{new Date(att.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {att.status === 'completed' ? (
                      <button 
                        onClick={() => att.analysisResult && onProfileFound(att.analysisResult)}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors py-1.5 px-3 rounded-lg bg-indigo-500/10"
                      >
                        查看结果
                      </button>
                    ) : att.status === 'failed' ? (
                      <button 
                        onClick={() => onRetry?.(att)}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors py-1.5 px-3 rounded-lg bg-rose-500/10"
                      >
                        重试分析
                      </button>
                    ) : (
                      <span className="text-[10px] text-white/20 italic">分析中...</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};