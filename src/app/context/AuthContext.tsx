import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { auth } from '../../lib/auth';
import type { User, ApiResult, LoginCredentials, SignUpCredentials } from '../../lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (credentials: LoginCredentials) => Promise<ApiResult<User>>;
  signUp: (credentials: SignUpCredentials) => Promise<ApiResult<User>>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const session = await auth.getSession();
        if (!cancelled) {
          setUser(session);
        }
      } catch {
        // Session restore failed — user stays logged out
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    restoreSession();

    // Subscribe to Supabase auth state changes (handles token refresh, etc.)
    const { data: { subscription } } = auth.onAuthStateChange((updatedUser) => {
      if (!cancelled) {
        setUser(updatedUser);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<ApiResult<User>> => {
      const result = await auth.signIn(credentials);
      if (result.data) {
        setUser(result.data);
      }
      return result;
    },
    []
  );

  const signUp = useCallback(
    async (credentials: SignUpCredentials): Promise<ApiResult<User>> => {
      const result = await auth.signUp(credentials);
      if (result.data) {
        setUser(result.data);
      }
      return result;
    },
    []
  );

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
