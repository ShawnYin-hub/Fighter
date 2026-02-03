import { supabase } from '../supabaseClient';
import { Decision } from '../types';

export const authService = {
  signUpWithEmail: async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { displayName: name || '' },
      },
    });
    if (error) throw error;
    return data;
  },

  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  sendPasswordReset: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/#/auth/login',
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  onAuthStateChanged: (callback: (user: any | null) => void) => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    // 初始触发一次
    supabase.auth.getUser().then(({ data }) => callback(data.user ?? null));
    return () => {
      data.subscription.unsubscribe();
    };
  },

  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  },
};

export const dbService = {
  saveDecision: async (decision: Decision) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('User not authenticated');

    const payload = {
      user_id: userData.user.id,
      title: decision.title,
      category: decision.category,
      status: decision.status,
      options: decision.options,
      eliminated: decision.eliminated,
      winner: decision.winner ?? null,
      summary: decision.summary ?? null,
      tags: decision.tags ?? [],
      pinned: !!decision.pinned,
      reflection: decision.reflection ?? null,
      reflection_advice: decision.reflectionAdvice ?? null,
    };

    const { data, error } = await supabase
      .from('decisions')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return { ...decision, id: data.id };
  },

  getDecisions: async (userId: string, limitCount: number = 50) => {
    const { data, error } = await supabase
      .from('decisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limitCount);

    if (error) throw error;
    return (data || []) as Decision[];
  },

  updateDecision: async (decision: Decision) => {
    const { error } = await supabase
      .from('decisions')
      .update({
        title: decision.title,
        category: decision.category,
        status: decision.status,
        options: decision.options,
        eliminated: decision.eliminated,
        winner: decision.winner ?? null,
        summary: decision.summary ?? null,
        tags: decision.tags ?? [],
        pinned: !!decision.pinned,
        reflection: decision.reflection ?? null,
        reflection_advice: decision.reflectionAdvice ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', decision.id);

    if (error) throw error;
    return decision;
  },
};

