import React, { useState } from 'react';
import { SignIn, SignUp, useSignIn } from '@clerk/clerk-react';
import type { UserProfile } from '../../types';
import type { RegisteredAccount } from '../../data/usersData';
import { DhammeLogo } from '../DhammeLogo';

import { supabase } from '../../services/supabaseClient';

interface AuthModalProps {
  initialScreen: 'login' | 'signup' | 'forgot_password';
  registeredAccounts: RegisteredAccount[];
  onRegisterAccount: (account: RegisteredAccount) => void;
  onLoginSuccess: (profile: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialScreen,
  registeredAccounts,
  onRegisterAccount,
  onLoginSuccess,
  onClose
}) => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const [screen, setScreen] = useState<'login' | 'signup' | 'forgot_password'>(initialScreen);
  const [authMode, setAuthMode] = useState<'local' | 'clerk'>('local');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');

      // Try Supabase Google OAuth
      supabase.auth.signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (isSignInLoaded && signIn && (signIn as any).authenticateWithRedirect) {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      } else {
        window.location.href = screen === 'signup' 
          ? 'https://accounts.capilorix.store/sign-up' 
          : 'https://accounts.capilorix.store/sign-in';
      }
    } finally {
      setTimeout(() => setIsGoogleLoading(false), 3000);
    }
  };
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  // SIGN UP HANDLER (With Auto-Login)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!fullName.trim()) {
      setErrorMsg('Fadlan qor magacaaga buuxa.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Fadlan qor Gmail ama Email sax ah (e.g. magac@gmail.com).');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password-ku waa inuu ka badan yahay 6 xaraf/nambar.');
      return;
    }
    if (!phone.trim() || phone.length < 6) {
      setErrorMsg('Fadlan qor nambarkaaga telefoonka.');
      return;
    }

    // Check if account already exists
    const existing = registeredAccounts.find((acc) => acc.email === trimmedEmail);
    if (existing) {
      setErrorMsg('Gmail-kan horay ayaa loo isticmaalay. Fadlan badal ama soo gal (Login).');
      return;
    }

    const newAccount: RegisteredAccount = {
      id: `user-${Date.now()}`,
      email: trimmedEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'DHAMME Registered Member',
      isVerified: true,
      passwordHash: password,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    onRegisterAccount(newAccount);

    const newProfile: UserProfile = {
      id: newAccount.id,
      email: newAccount.email,
      fullName: newAccount.fullName,
      phone: newAccount.phone,
      avatarUrl: newAccount.avatarUrl,
      bio: newAccount.bio,
      isVerified: true,
      isAdmin: false,
      joinedDate: newAccount.joinedDate
    };

    onLoginSuccess(newProfile);
    onClose();
  };

  // LOGIN HANDLER (Includes Master Admin Credentials)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!validateEmail(trimmedEmail)) {
      setErrorMsg('Fadlan qor Gmail ama Email sax ah.');
      return;
    }
    if (!password) {
      setErrorMsg('Fadlan qor password-kaaga.');
      return;
    }

    // Master Admin Authentication Check
    if (trimmedEmail === 'magudbeai@gmail.com' && password === 'Bookh.112233') {
      const masterAdminAccount: UserProfile = {
        id: 'admin-master-magudbe',
        email: 'magudbeai@gmail.com',
        fullName: 'Magudbe Master Admin',
        phone: '0915752826',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isVerified: true,
        isAdmin: true,
        joinedDate: '2026-08-01'
      };
      onLoginSuccess(masterAdminAccount);
      onClose();
      return;
    }

    const account = registeredAccounts.find((acc) => acc.email === trimmedEmail);

    if (!account) {
      setErrorMsg('Gmail-kan ma diwaan gashana. Fadlan marka hore sameey koonto (Sign Up).');
      return;
    }

    if (account.passwordHash !== password) {
      setErrorMsg('Password-ka aad gelisay waa ku khaldan yahay.');
      return;
    }

    const { passwordHash, ...userProfile } = account;
    onLoginSuccess(userProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#fcf9f8] max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 text-center relative border border-[#bec9c5]/40 my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#645d54] hover:text-[#1b1b1c] p-1 rounded-full"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header Logo */}
        <div className="pt-2 flex justify-center">
          <DhammeLogo variant="md" animated={true} showSubtitle={true} />
        </div>

        {/* Google OAuth Direct Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-gray-50 border border-[#bec9c5]/60 text-gray-800 font-poppins font-bold text-xs flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {isGoogleLoading ? 'Connecting Google...' : 'Ku Soo Gal Google (Google Sign-In)'}
        </button>

        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-[#bec9c5]/40" />
          <span className="text-[10px] text-[#645d54] uppercase font-bold">ama (or)</span>
          <div className="flex-1 h-px bg-[#bec9c5]/40" />
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-[#f0eded] p-1 rounded-2xl border border-[#bec9c5]/30">
          <button
            type="button"
            onClick={() => setAuthMode('local')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              authMode === 'local'
                ? 'bg-[#005145] text-white shadow-sm'
                : 'text-[#3f4946] hover:text-[#1b1b1c]'
            }`}
          >
            📝 Direct Auth
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('clerk')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              authMode === 'clerk'
                ? 'bg-[#005145] text-white shadow-sm'
                : 'text-[#3f4946] hover:text-[#1b1b1c]'
            }`}
          >
            🔒 Clerk Auth
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl text-xs font-semibold border border-[#ba1a1a]/20">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#99e8d5]/40 text-[#00201a] rounded-2xl text-xs font-bold border border-[#005145]/20">
            {successMsg}
          </div>
        )}

        {/* LOCAL FORM AUTHENTICATION */}
        {authMode === 'local' && screen === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            <div className="text-center pt-1">
              <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
                Soo Gal (Login)
              </h3>
              <p className="text-xs text-[#3f4946]">
                Geli Gmail-ka aad ku sameysatay koontada iyo Password-ka.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Gmail / Email:
              </label>
              <input
                type="email"
                required
                placeholder="magacaaga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c] border border-[#bec9c5]/30 focus:ring-2 focus:ring-[#005145]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Password:
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c] border border-[#bec9c5]/30 focus:ring-2 focus:ring-[#005145]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#005145] to-[#0f6b5c] hover:brightness-110 text-white font-poppins font-bold text-xs uppercase shadow-md transition-all active:scale-95"
            >
              Soo Gal (Login)
            </button>

            <div className="text-center text-xs text-[#645d54] pt-2">
              Ma lehid koonto?{' '}
              <button 
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setScreen('signup');
                }} 
                className="text-[#005145] font-bold underline"
              >
                Sameey Koonto (Sign Up)
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP SCREEN */}
        {authMode === 'local' && screen === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3 text-left">
            <div className="text-center pt-1">
              <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
                Sameey Koonto Cusub
              </h3>
              <p className="text-xs text-[#3f4946]">
                Geli macluumaadkaaga saxda ah si aad koonto u abuurto.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Magacaaga Buuxa (Full Name):
              </label>
              <input
                type="text"
                required
                placeholder="Qor magacaaga Buuxa"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c] border border-[#bec9c5]/30 focus:ring-2 focus:ring-[#005145]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Gmail / Email Address:
              </label>
              <input
                type="email"
                required
                placeholder="magacaaga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c] border border-[#bec9c5]/30 focus:ring-2 focus:ring-[#005145]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Phone Number (Ethiopia):
              </label>
              <input
                type="text"
                required
                placeholder="+251 9..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c] border border-[#bec9c5]/30 focus:ring-2 focus:ring-[#005145]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Password (Min 6 chars):
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c] border border-[#bec9c5]/30 focus:ring-2 focus:ring-[#005145]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#005145] to-[#0f6b5c] hover:brightness-110 text-white font-poppins font-bold text-xs uppercase shadow-md transition-all active:scale-95"
            >
              Abuur Koonto (Sign Up)
            </button>

            <div className="text-center text-xs text-[#645d54] pt-2">
              Hadaad leedahay koonto?{' '}
              <button 
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setScreen('login');
                }} 
                className="text-[#005145] font-bold underline"
              >
                Soo Gal (Login)
              </button>
            </div>
          </form>
        )}

        {/* CLERK AUTHENTICATION */}
        {authMode === 'clerk' && (
          <div className="py-2 flex flex-col items-center justify-center space-y-4 w-full">
            <div className="w-full overflow-x-auto flex justify-center">
              {screen === 'login' ? (
                <SignIn routing="virtual" appearance={{ elements: { footer: { display: 'none' } } }} />
              ) : (
                <SignUp routing="virtual" appearance={{ elements: { footer: { display: 'none' } } }} />
              )}
            </div>

            <a
              href={screen === 'signup' ? 'https://accounts.capilorix.store/sign-up' : 'https://accounts.capilorix.store/sign-in'}
              target="_self"
              className="text-xs font-bold text-[#005145] hover:underline flex items-center justify-center gap-1 py-2 px-4 rounded-xl bg-[#f0eded]"
            >
              <span>🔗 Open Clerk Hosted Authentication Portal</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
