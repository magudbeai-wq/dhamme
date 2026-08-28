import React, { useState } from 'react';
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
  const [screen, setScreen] = useState<'login' | 'signup' | 'forgot_password'>(initialScreen);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');
      supabase.auth.signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMsg('Google Sign-In connection failed. Please try Email Login.');
      setIsGoogleLoading(false);
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

    if (account.isBanned) {
      setErrorMsg(`Akoonkaaga waa la xannibay (Your account is banned): ${account.bannedReason || 'Ku xad-gudub shuruucda DHAMME'}`);
      return;
    }

    if (account.passwordHash !== password) {
      setErrorMsg('Password-ka aad gelisay waa ku khaldan yahay.');
      return;
    }

    const { passwordHash: _hash, ...userProfile } = account;
    onLoginSuccess(userProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-xl space-y-4 text-center relative border border-[#E8E5DF] my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#74777B] hover:text-[#17191C] p-1 rounded-full"
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
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E8E5DF] text-[#17191C] font-sans font-semibold text-xs flex items-center justify-center gap-3 shadow-xs hover:border-[#111315] transition-all active:scale-95 disabled:opacity-50"
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
          <div className="flex-1 h-px bg-[#E8E5DF]" />
          <span className="text-[10px] text-[#74777B] uppercase font-medium">ama (or)</span>
          <div className="flex-1 h-px bg-[#E8E5DF]" />
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#A8453F]/10 text-[#A8453F] rounded-xl text-xs font-medium border border-[#A8453F]/30">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#4A7A63]/10 text-[#4A7A63] rounded-xl text-xs font-semibold border border-[#4A7A63]/30">
            {successMsg}
          </div>
        )}

        {/* LOGIN SCREEN */}
        {screen === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            <div className="text-center pt-1">
              <h3 className="font-serif font-bold text-xl text-[#17191C]">
                Soo Gal (Login)
              </h3>
              <p className="text-xs text-[#74777B]">
                Geli Gmail-ka aad ku sameysatay koontada iyo Password-ka.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                Gmail / Email:
              </label>
              <input
                type="email"
                required
                placeholder="magacaaga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                Password:
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-sans font-semibold text-xs uppercase shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Soo Gal (Login)
            </button>

            <div className="text-center text-xs text-[#74777B] pt-2">
              Ma lehid koonto?{' '}
              <button 
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setScreen('signup');
                }} 
                className="text-[#111315] font-semibold underline cursor-pointer"
              >
                Sameey Koonto (Sign Up)
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP SCREEN */}
        {screen === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3 text-left">
            <div className="text-center pt-1">
              <h3 className="font-serif font-bold text-xl text-[#17191C]">
                Sameey Koonto Cusub
              </h3>
              <p className="text-xs text-[#74777B]">
                Geli macluumaadkaaga saxda ah si aad koonto u abuurto.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                Magacaaga Buuxa (Full Name):
              </label>
              <input
                type="text"
                required
                placeholder="Qor magacaaga Buuxa"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                Gmail / Email Address:
              </label>
              <input
                type="email"
                required
                placeholder="magacaaga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                Phone Number (Ethiopia):
              </label>
              <input
                type="text"
                required
                placeholder="+251 9..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                Password (Min 6 chars):
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-sans font-semibold text-xs uppercase shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Abuur Koonto (Sign Up)
            </button>

            <div className="text-center text-xs text-[#74777B] pt-2">
              Hadaad leedahay koonto?{' '}
              <button 
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setScreen('login');
                }} 
                className="text-[#111315] font-semibold underline cursor-pointer"
              >
                Soo Gal (Login)
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
