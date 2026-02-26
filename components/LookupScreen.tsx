import React, { useState } from 'react';
import { Button } from './Button';
import { Search, ArrowLeft } from 'lucide-react';
import { translations } from '../utils/translations';
import { getProfileBySoulId } from '../services/geminiService';
import { MatchProfile } from '../types';

interface Props {
  onBack: () => void;
  onProfileFound: (profile: MatchProfile) => void;
  text: typeof translations['en']['lookup'];
}

export const LookupScreen: React.FC<Props> = ({ onBack, onProfileFound, text }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (e) {
      setError("System Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mt-12">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">{text.back}</span>
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{text.title}</h2>
      <p className="text-center text-gray-500 mb-8 text-sm">Enter a valid Soul ID to retrieve the spectral analysis.</p>

      <form onSubmit={handleLookup} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={text.placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-0 outline-none transition-all font-mono text-lg text-gray-800 uppercase tracking-wider placeholder:normal-case placeholder:font-sans placeholder:tracking-normal"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {error && <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}

        <Button type="submit" fullWidth disabled={loading || !code}>
          {loading ? 'Searching Database...' : text.submit}
        </Button>
      </form>
    </div>
  );
};