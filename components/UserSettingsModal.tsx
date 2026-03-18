import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Loader2 } from 'lucide-react';
import { useToast } from './Toast';
import { UserDemographics } from '../types';
import { supabase } from '../services/supabase';
import { getCurrentUser } from '../services/auth';
import type { User } from '@supabase/supabase-js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  demographics: UserDemographics | null;
  language: string;
  text: any; // Using simplified type for brevity
  onSave: (demo: UserDemographics) => void;
}

export const UserSettingsModal: React.FC<Props> = ({ isOpen, onClose, demographics, language, text, onSave }) => {
  const [formData, setFormData] = useState<UserDemographics>({
    age: '22',
    gender: 'non-binary',
    interestedIn: 'everyone',
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (demographics) {
        setFormData(demographics);
      }
      getCurrentUser().then(u => {
        setUser(u);
        // We still load from DB to ensure we have the most recent cloud state
        if (u) loadProfile(u.id);
      });
    }
  }, [isOpen]); // Only run on open

  const loadProfile = async (uid: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('age, gender, interested_in').eq('id', uid).single();
      if (data && !error) {
        setFormData({
          age: String(data.age),
          gender: data.gender,
          interestedIn: data.interested_in,
        });
      }
    } catch (e) {
      console.error('Failed to load profile', e);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      showToast(text.ageRangeError, 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (user) {
        // Save to Supabase DB if logged in
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          age: ageNum,
          gender: formData.gender,
          interested_in: formData.interestedIn,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
      }
      onSave(formData);
      showToast(text.successMsg, 'success');
      onClose();
    } catch (err: any) {
      console.error('Save error', err);
      showToast(text.failMsg || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserDemographics, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment key="settings-modal">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-panel p-8 relative rounded-3xl my-8 mx-auto"
              style={{ background: 'linear-gradient(135deg, rgba(30,15,40,0.85), rgba(15,10,30,0.95))' }}
            >
              <button onClick={onClose} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                  <Settings className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-light text-white tracking-widest uppercase">{text.title}</h2>
                <p className="text-white/40 text-sm mt-2">{text.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Age Input */}
                <div className="text-center">
                  <label className="block text-xs font-semibold text-neutral-500 mb-4 uppercase tracking-widest">{text.ageLabel}</label>
                  <div className="flex items-center justify-center gap-6">
                    <button type="button" onClick={() => setFormData(p => ({ ...p, age: String(Math.max(18, (parseInt(p.age || '22') - 1))) }))}
                      className="w-12 h-12 rounded-full border border-neutral-700 text-neutral-400 hover:border-neutral-400 hover:text-white flex items-center justify-center text-xl transition-colors">
                      -
                    </button>
                    <input type="number" min="18" max="100" required
                      className="w-24 text-center text-5xl font-thin text-white bg-transparent border-none focus:ring-0 outline-none placeholder:text-neutral-800 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }} placeholder="22" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} />
                    <button type="button" onClick={() => setFormData(p => ({ ...p, age: String(Math.min(100, (parseInt(p.age || '22') + 1))) }))}
                      className="w-12 h-12 rounded-full border border-neutral-700 text-neutral-400 hover:border-neutral-400 hover:text-white flex items-center justify-center text-xl transition-colors">
                      +
                    </button>
                  </div>
                </div>

                {/* Gender */}
                <div className="text-center">
                  <label className="block text-xs font-semibold text-neutral-500 mb-4 uppercase tracking-widest">{text.genderLabel}</label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { val: 'male', label: language === 'zh' ? '男生' : language === 'ja' ? '男性' : 'Male' },
                      { val: 'female', label: language === 'zh' ? '女生' : language === 'ja' ? '女性' : 'Female' },
                      { val: 'non-binary', label: language === 'zh' ? '非二元' : language === 'ja' ? 'その他' : 'Non-binary' }
                    ].map((opt) => (
                      <button key={opt.val} type="button" onClick={() => handleChange('gender', opt.val)}
                        className={`px-5 py-2 text-sm transition-all rounded-full border ${formData.gender === opt.val ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300' : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interested In */}
                <div className="text-center">
                  <label className="block text-xs font-semibold text-neutral-500 mb-4 uppercase tracking-widest">{text.seekingLabel}</label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { val: 'everyone', label: language === 'zh' ? '不限' : language === 'ja' ? 'すべて' : 'Everyone' },
                      { val: 'men', label: language === 'zh' ? '男生' : language === 'ja' ? '男性' : 'Men' },
                      { val: 'women', label: language === 'zh' ? '女生' : language === 'ja' ? '女性' : 'Women' }
                    ].map((opt) => (
                      <button key={opt.val} type="button" onClick={() => handleChange('interestedIn', opt.val)}
                        className={`px-5 py-2 text-sm transition-all rounded-full border ${formData.interestedIn === opt.val ? 'border-rose-400 bg-rose-500/20 text-rose-300' : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-white text-black hover:bg-neutral-200 font-medium rounded-xl py-3 mt-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {text.savingBtn}</> : text.saveBtn}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};
