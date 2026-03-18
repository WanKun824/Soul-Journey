import { MatchProfile } from '../types';

const DB_KEY = 'soulcompass_db';

export const saveToCache = async (profile: MatchProfile): Promise<void> => {
  try {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    db[profile.soulId] = profile;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error('Cache save failed', e);
  }
  await new Promise(r => setTimeout(r, 100));
};

export const getFromCache = (soulId: string): MatchProfile | null => {
  try {
    const db = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    return db[soulId] ?? null;
  } catch {
    return null;
  }
};
