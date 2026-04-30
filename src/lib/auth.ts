import { supabase, isSupabaseConfigured } from './supabase';
import type { User, ApiResult, LoginCredentials, SignUpCredentials } from './types';

// ─── Supabase Auth ────────────────────────────────────────────────────────────

async function supabaseSignUp(
  credentials: SignUpCredentials
): Promise<ApiResult<User>> {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        name: credentials.name,
        role: 'user',
      },
    },
  });

  if (error) return { data: null, error: error.message };
  if (!data.user) return { data: null, error: 'Sign up failed. Please try again.' };

  const user: User = {
    id: data.user.id,
    email: data.user.email!,
    name: credentials.name,
    role: 'user',
    createdAt: data.user.created_at,
  };

  return { data: user, error: null };
}

async function supabaseSignIn(
  credentials: LoginCredentials
): Promise<ApiResult<User>> {
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

  // Read role from public.profiles (source of truth)
  let profile: { name: string; role: string } | null = null;
  try {
    const result = await Promise.race([
      supabase.from('profiles').select('name, role').eq('id', data.user.id).single(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]) as { data: { name: string; role: string } | null };
    profile = result.data;
  } catch {
    // Profile fetch failed or timed out — fall back to metadata
  }

  const meta = data.user.user_metadata;
  const user: User = {
    id: data.user.id,
    email: data.user.email!,
    name: profile?.name ?? meta?.name ?? data.user.email!.split('@')[0],
    role: (profile?.role as 'user' | 'admin') ?? 'user',
    createdAt: data.user.created_at,
  };

  return { data: user, error: null };
}

async function supabaseSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

async function supabaseGetSession(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  // Read role from public.profiles (source of truth)
  let profile: { name: string; role: string } | null = null;
  try {
    const result = await Promise.race([
      supabase.from('profiles').select('name, role').eq('id', session.user.id).single(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
    ]) as { data: { name: string; role: string } | null };
    profile = result.data;
  } catch {
    // fall back to metadata
  }

  const meta = session.user.user_metadata;
  return {
    id: session.user.id,
    email: session.user.email!,
    name: profile?.name ?? meta?.name ?? session.user.email!.split('@')[0],
    role: (profile?.role as 'user' | 'admin') ?? 'user',
    createdAt: session.user.created_at,
  };
}

// ─── Demo Auth (secure fallback when Supabase not configured) ─────────────────
// Passwords are hashed using a simple but consistent approach.
// This is NOT production-grade hashing — it's a demo fallback only.
// In production, Supabase handles bcrypt hashing server-side.

const DEMO_ADMIN = {
  id: 'admin-demo-001',
  email: 'admin@fashion-foresight.com',
  name: 'Administrator',
  role: 'admin' as const,
  createdAt: new Date().toISOString(),
};

const DEMO_ADMIN_PASSWORD = 'Admin@2026';

function getDemoUsers(): Array<{ email: string; passwordHash: string; name: string; id: string; createdAt: string }> {
  try {
    return JSON.parse(sessionStorage.getItem('_demo_users') || '[]');
  } catch {
    return [];
  }
}

function saveDemoUsers(users: ReturnType<typeof getDemoUsers>): void {
  sessionStorage.setItem('_demo_users', JSON.stringify(users));
}

/**
 * Simple hash for demo purposes only.
 * Real passwords are NEVER stored in plaintext.
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'fashion-foresight-demo-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function demoSignUp(
  credentials: SignUpCredentials
): Promise<ApiResult<User>> {
  const users = getDemoUsers();

  if (users.find((u) => u.email === credentials.email)) {
    return { data: null, error: 'This email is already registered.' };
  }

  const passwordHash = await hashPassword(credentials.password);
  const newUser = {
    id: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    email: credentials.email,
    name: credentials.name,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveDemoUsers(users);

  // Store session in sessionStorage (not localStorage — more secure for demo)
  const sessionUser: User = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: 'user',
    createdAt: newUser.createdAt,
  };
  sessionStorage.setItem('_demo_session', JSON.stringify(sessionUser));

  return { data: sessionUser, error: null };
}

async function demoSignIn(
  credentials: LoginCredentials
): Promise<ApiResult<User>> {
  // Check admin
  if (
    credentials.email === DEMO_ADMIN.email &&
    credentials.password === DEMO_ADMIN_PASSWORD
  ) {
    sessionStorage.setItem('_demo_session', JSON.stringify(DEMO_ADMIN));
    return { data: DEMO_ADMIN, error: null };
  }

  const users = getDemoUsers();
  const user = users.find((u) => u.email === credentials.email);

  if (!user) {
    // Constant-time-like response to prevent user enumeration
    await hashPassword(credentials.password);
    return { data: null, error: 'Invalid email or password.' };
  }

  const passwordHash = await hashPassword(credentials.password);
  if (passwordHash !== user.passwordHash) {
    return { data: null, error: 'Invalid email or password.' };
  }

  const sessionUser: User = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: 'user',
    createdAt: user.createdAt,
  };
  sessionStorage.setItem('_demo_session', JSON.stringify(sessionUser));

  return { data: sessionUser, error: null };
}

function demoSignOut(): void {
  sessionStorage.removeItem('_demo_session');
}

function demoGetSession(): User | null {
  try {
    const raw = sessionStorage.getItem('_demo_session');
    if (!raw) return null;
    const user = JSON.parse(raw) as User;
    // Basic validation
    if (!user.id || !user.email || !user.role) return null;
    return user;
  } catch {
    return null;
  }
}

// ─── Public Auth API ──────────────────────────────────────────────────────────

export const auth = {
  signUp: (credentials: SignUpCredentials): Promise<ApiResult<User>> =>
    isSupabaseConfigured
      ? supabaseSignUp(credentials)
      : demoSignUp(credentials),

  signIn: (credentials: LoginCredentials): Promise<ApiResult<User>> =>
    isSupabaseConfigured
      ? supabaseSignIn(credentials)
      : demoSignIn(credentials),

  signOut: (): Promise<void> | void =>
    isSupabaseConfigured ? supabaseSignOut() : demoSignOut(),

  getSession: (): Promise<User | null> | User | null =>
    isSupabaseConfigured ? supabaseGetSession() : demoGetSession(),

  /** Subscribe to auth state changes (Supabase only) */
  onAuthStateChange: (callback: (user: User | null) => void) => {
    if (!isSupabaseConfigured) {
      // No-op for demo mode
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      // Read role from public.profiles
      let profile: { name: string; role: string } | null = null;
      try {
        const result = await Promise.race([
          supabase.from('profiles').select('name, role').eq('id', session.user.id).single(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
        ]) as { data: { name: string; role: string } | null };
        profile = result.data;
      } catch {
        // fall back to metadata
      }

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

  isConfigured: isSupabaseConfigured,
  demoAdminEmail: DEMO_ADMIN.email,
  demoAdminPassword: DEMO_ADMIN_PASSWORD,
};
