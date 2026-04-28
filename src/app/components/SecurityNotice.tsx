import { X } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../../lib/auth';

export function SecurityNotice() {
  const [isVisible, setIsVisible] = useState(true);
  if (auth.isConfigured || !isVisible) return null;

  return (
    <div className="bg-[#fdf2f2] border-b border-[#f5e5e5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#64020e] flex-shrink-0" />
          <p className="text-xs text-[#64020e] flex-1">
            <span className="font-semibold">Demo Mode</span> — Running without a backend. Auth uses session storage with hashed passwords. Do not enter real credentials.{' '}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4a0109]">
              Connect Supabase
            </a>{' '}
            for production auth.
          </p>
          <button onClick={() => setIsVisible(false)} className="text-[#64020e]/60 hover:text-[#64020e] transition-colors flex-shrink-0 p-0.5" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
