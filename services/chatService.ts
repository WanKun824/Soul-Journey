import { supabase } from "./supabase";
import { Match, Message } from "../types";
import { getCurrentUser } from "./auth";

// Helper to handle pgvector format variations ([1,2,3] vs string "[1,2,3]")
const parseVector = (v: any): number[] => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    return v.replace(/[\[\]]/g, '').split(',').map(Number);
  }
  return [0, 0, 0, 0, 0];
};

export const getMatchList = async (): Promise<Match[]> => {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:profiles!matches_user1_id_fkey(id, soul_title, summary, radar_scores, age, gender),
      user2:profiles!matches_user2_id_fkey(id, soul_title, summary, radar_scores, age, gender)
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getMatchList error:', error);
    return [];
  }

  return (data as any[]).map(d => {
    const otherUser = d.user1_id === user.id ? d.user2 : d.user1;
    return {
      id: d.id,
      user1Id: d.user1_id,
      user2Id: d.user2_id,
      createdAt: d.created_at,
      otherUser: {
        id: otherUser.id,
        soulTitle: otherUser.soul_title,
        summary: otherUser.summary,
        radarScores: parseVector(otherUser.radar_scores),
        age: otherUser.age,
        gender: otherUser.gender
      }
    };
  });
};

export const getMessages = async (matchId: string, limit: number = 50): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getMessages error:', error);
    return [];
  }

  return (data as any[]).map(d => ({
    id: d.id,
    matchId: d.match_id,
    senderId: d.sender_id,
    content: d.content,
    createdAt: d.created_at
  }));
};

export const sendMessage = async (matchId: string, content: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const { error } = await supabase.from('messages').insert({
    match_id: matchId,
    sender_id: user.id,
    content
  });

  if (error) {
    console.error('sendMessage error:', error);
    return false;
  }
  return true;
};

export const subscribeToMessages = (matchId: string, onNewMessage: (msg: Message) => void) => {
  return supabase
    .channel(`match:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        const d = payload.new as any;
        onNewMessage({
          id: d.id,
          matchId: d.match_id,
          senderId: d.sender_id,
          content: d.content,
          createdAt: d.created_at
        });
      }
    )
    .subscribe();
};
