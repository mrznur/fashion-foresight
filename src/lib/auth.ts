import { supabase } from './supabase';
import type { User, ApiResult, LoginCredentials, SignUpCredentials } from './types';

// ─── Helper: fetch role from profiles ────────────────────────────────────────

async function getProfile(userId: string): Promise<{ name: string; role: string } | null> {
  try {
    const result = await Promise.race([
      supabase.from('profiles').select('name, role').eq('id', userId).single(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]) as { data: { name: string; role: string } | null };
    return result.data;
  } catch {
    return null;
  }
}

// ─── Auth functions ───────────────────────────────────────────────────────────

export const auth = {

  signUp: async (credentials: SignUpCredentials): Promise<ApiResult<User>> => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: { data: { name: credentials.name, role: 'user' } },
    });

    if (error) return { data: null, error: error.message };
    if (!data.user) return { data: null, error: 'Sign up failed. Please try again.' };

    return {
      data: {
        id: data.user.id,
        email: data.user.email!,
        name: credentials.name,
        role: 'user',
        createdAt: data.user.created_at,
      },
      error: null,
    };
  },

  signIn: async (credentials: LoginCredentials): Promise<ApiResult<User>> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { data: null, error: 'Invalid email or password.' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { data: null, error: 'Please verify your email before signing in.' };
      }
      return { data: null, error: 'Sign in failed. Please try again.' };
    }

    if (!data.user) return { data: null, error: 'Sign in failed. Please try again.' };

    const profile = await getProfile(data.user.id);
    const meta = data.user.user_metadata;

    return {
      data: {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name ?? meta?.name ?? data.user.email!.split('@')[0],
        role: (profile?.role as 'user' | 'admin') ?? 'user',
        createdAt: data.user.created_at,
      },
      error: null,
    };
  },

  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  getSession: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const profile = await getProfile(session.user.id);
    const meta = session.user.user_metadata;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: profile?.name ?? meta?.name ?? session.user.email!.split('@')[0],
      role: (profile?.role as 'user' | 'admin') ?? 'user',
      createdAt: session.user.created_at,
    };
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      const profile = await getProfile(session.user.id);
      const meta = session.user.user_metadata;

      callback({
        id: session.user.id,
        email: session.user.email!,
        name: profile?.name ?? meta?.name ?? session.user.email!.split('@')[0],
        role: (profile?.role as 'user' | 'admin') ?? 'user',
        createdAt: session.user.created_at,
      });
    });
  },

  isConfigured: true,
};
