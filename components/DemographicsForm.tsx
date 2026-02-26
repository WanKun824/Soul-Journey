import React, { useState } from 'react';
import { Button } from './Button';
import { UserDemographics } from '../types';
import { translations } from '../utils/translations';

interface Props {
  onComplete: (data: UserDemographics) => void;
  text: typeof translations['en']['demographics'];
}

export const DemographicsForm: React.FC<Props> = ({ onComplete, text }) => {
  const [formData, setFormData] = useState<UserDemographics>({
    age: '22',
    gender: 'non-binary',
    interestedIn: 'everyone'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.age) {
      onComplete(formData);
    }
  };

  const handleChange = (field: keyof UserDemographics, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6 animate-fade-in visible">
      <div className="w-full max-w-2xl">
        <h2 className="text-xs font-bold tracking-[0.4em] text-neutral-500 uppercase mb-20 text-center border-b border-neutral-800 pb-4">{text.title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-20">
          
          {/* Age Input */}
          <div className="text-center group">
            <label className="block text-sm font-medium text-neutral-500 mb-6 uppercase tracking-widest">{text.ageLabel}</label>
            <input
              type="number"
              min="18"
              max="100"
              required
              className="w-full text-center text-7xl md:text-9xl font-thin text-white bg-transparent border-none focus:ring-0 outline-none placeholder:text-neutral-800 transition-all"
              placeholder="22"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="text-center">
            <label className="block text-sm font-medium text-neutral-500 mb-8 uppercase tracking-widest">{text.genderLabel}</label>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { val: 'male', label: text.genderOptions.male },
                { val: 'female', label: text.genderOptions.female },
                { val: 'non-binary', label: text.genderOptions.nonbinary }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleChange('gender', opt.val)}
                  className={`px-6 py-2 text-lg transition-all rounded-full border ${
                    formData.gender === opt.val
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interested In */}
          <div className="text-center">
            <label className="block text-sm font-medium text-neutral-500 mb-8 uppercase tracking-widest">{text.interestedLabel}</label>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(text.interestedOptions).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleChange('interestedIn', key)}
                  className={`px-6 py-2 text-lg transition-all rounded-full border ${
                    formData.interestedIn === key 
                    ? 'border-white bg-white text-black' 
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-12 flex justify-center">
              <Button type="submit" className="text-lg px-16 py-5 rounded-full bg-white text-black hover:bg-neutral-200 transition-transform hover:scale-105">
              {text.nextBtn}
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
