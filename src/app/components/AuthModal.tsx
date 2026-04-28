import { X, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { loginSchema, signUpSchema } from '../../lib/validation';
import { auth } from '../../lib/auth';
import type { ZodError } from 'zod';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'signin' | 'signup';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function getZodErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof FieldErrors;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setFieldErrors({}); setShowPassword(false); setShowConfirm(false); setIsSubmitting(false);
  };

  const handleClose = () => { resetForm(); onClose(); };
  const switchMode = (m: Mode) => { setMode(m); setFieldErrors({}); setPassword(''); setConfirmPassword(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        const parsed = loginSchema.safeParse({ email, password });
        if (!parsed.success) { setFieldErrors(getZodErrors(parsed.error)); return; }
        const result = await signIn(parsed.data);
        if (result.error) { setFieldErrors({ general: result.error }); return; }
        toast.success(`Welcome back, ${result.data?.name}!`);
        handleClose();
      } else {
        const parsed = signUpSchema.safeParse({ name, email, password, confirmPassword });
        if (!parsed.success) { setFieldErrors(getZodErrors(parsed.error)); return; }
        const result = await signUp(parsed.data);
        if (result.error) { setFieldErrors({ general: result.error }); return; }
        toast.success(`Welcome to Fashion Foresight, ${result.data?.name}!`);
        handleClose();
      }
    } catch {
      setFieldErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 4) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = mode === 'signup' ? getPasswordStrength(password) : null;

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border-2 rounded-xl text-sm text-[#1a0508] placeholder:text-[#d4d4d4] focus:outline-none transition-all duration-200 bg-white ${
      hasError
        ? 'border-[#64020e] bg-[#fdf2f2] focus:border-[#64020e]'
        : 'border-[#e5e5e5] focus:border-[#64020e]'
    }`;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={handleClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-[#f5f5f5]">
            <div>
              <h2 id="auth-title" className="text-xl font-semibold text-[#1a0508]">
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-[#737373] mt-0.5">
                {mode === 'signin' ? 'Sign in to your Fashion Foresight account' : 'Join the Fashion Foresight community'}
              </p>
            </div>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-all" aria-label="Close">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="px-7 py-6">
            {/* Mode tabs */}
            <div className="flex bg-[#f5f5f5] rounded-xl p-1 mb-6">
              {(['signin', 'signup'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    mode === m
                      ? 'bg-white text-[#1a0508] shadow-sm'
                      : 'text-[#737373] hover:text-[#1a0508]'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Demo credentials */}
            {mode === 'signin' && !auth.isConfigured && (
              <div className="mb-5 p-4 bg-[#fdf2f2] border border-[#f5e5e5] rounded-2xl text-xs">
                <p className="font-semibold text-[#64020e] mb-2">Demo Credentials</p>
                <div className="space-y-1 text-[#737373]">
                  <p><span className="font-medium text-[#1a0508]">Admin:</span> {auth.demoAdminEmail} / {auth.demoAdminPassword}</p>
                  <p><span className="font-medium text-[#1a0508]">User:</span> Register a new account below</p>
                </div>
              </div>
            )}

            {/* General error */}
            {fieldErrors.general && (
              <div role="alert" className="mb-4 p-3.5 bg-[#fdf2f2] border border-[#f5e5e5] text-[#64020e] rounded-2xl text-sm flex items-start gap-2.5">
                <span className="flex-shrink-0 mt-0.5">⚠</span>
                {fieldErrors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="block mb-1.5 text-sm font-medium text-[#1a0508]">Full Name</label>
                  <input ref={firstInputRef} type="text" id="auth-name" value={name} onChange={(e) => setName(e.target.value)}
                    autoComplete="name" aria-invalid={Boolean(fieldErrors.name)}
                    className={inputClass(Boolean(fieldErrors.name))} placeholder="John Doe" />
                  {fieldErrors.name && <p role="alert" className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.name}</p>}
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block mb-1.5 text-sm font-medium text-[#1a0508]">Email Address</label>
                <input ref={mode === 'signin' ? firstInputRef : undefined} type="email" id="auth-email" value={email}
                  onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={Boolean(fieldErrors.email)}
                  className={inputClass(Boolean(fieldErrors.email))} placeholder="you@example.com" />
                {fieldErrors.email && <p role="alert" className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="auth-password" className="block mb-1.5 text-sm font-medium text-[#1a0508]">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="auth-password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className={`${inputClass(Boolean(fieldErrors.password))} pr-11`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1a0508] transition-colors"
                    aria-label={showPassword ? 'Hide' : 'Show'}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && <p role="alert" className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.password}</p>}
                {mode === 'signup' && password && strength && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-[#e5e5e5]'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-[#737373]">Strength: <span className="font-medium text-[#1a0508]">{strength.label}</span></p>
                  </div>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-confirm" className="block mb-1.5 text-sm font-medium text-[#1a0508]">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'} id="auth-confirm" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password"
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                      className={`${inputClass(Boolean(fieldErrors.confirmPassword))} pr-11`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1a0508] transition-colors"
                      aria-label={showConfirm ? 'Hide' : 'Show'}>
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {confirmPassword && password === confirmPassword && (
                      <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {fieldErrors.confirmPassword && <p role="alert" className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.confirmPassword}</p>}
                </div>
              )}

              {mode === 'signup' && (
                <p className="text-xs text-[#737373]">Password must be 8+ characters with uppercase, lowercase, and a number.</p>
              )}

              <button type="submit" disabled={isSubmitting}
                className="w-full btn-brand justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {mode === 'signup' && (
              <p className="mt-4 text-xs text-[#737373] text-center">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-[#64020e] hover:underline">Terms</a> and{' '}
                <a href="#" className="text-[#64020e] hover:underline">Privacy Policy</a>.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
