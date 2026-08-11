import React, { useState } from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';
import type { UserProfile } from '../../types';
import type { RegisteredAccount } from '../../data/usersData';
import { DhammeLogo } from '../DhammeLogo';

interface AuthPageProps {
  initialScreen: 'login' | 'signup' | 'forgot_password';
  registeredAccounts: RegisteredAccount[];
  onRegisterAccount: (account: RegisteredAccount) => void;
  onLoginSuccess: (profile: UserProfile) => void;
  onBackToHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialScreen,
  registeredAccounts,
  onRegisterAccount,
  onLoginSuccess,
  onBackToHome
}) => {
  const clerk = useClerk();
  const [screen, setScreen] = useState<'login' | 'signup' | 'forgot_password'>(initialScreen);
  const [authMode, setAuthMode] = useState<'clerk' | 'local'>('clerk');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');

      if ((clerk as any).authenticateWithRedirect) {
        await (clerk as any).authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: window.location.origin,
          redirectUrlComplete: window.location.origin,
        });
      } else {
        clerk.redirectToSignIn({
          signInForceRedirectUrl: window.location.origin
        });
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setIsGoogleLoading(false);
      clerk.redirectToSignIn({
        signInForceRedirectUrl: window.location.origin
      });
    }
  };

  // SIGN UP HANDLER
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
      avatarUrl: '',
      bio: '',
      isVerified: true,
      passwordHash: password,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    onRegisterAccount(newAccount);
    setSuccessMsg('Koontadaada waa la sameeyay! Hada waad soo geli kartaa.');
    setScreen('login');
    setPassword('');
  };

  // LOGIN HANDLER
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
      onBackToHome();
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
    onBackToHome();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcf9f8] via-[#f7f3ee] to-[#ece5dd] pb-16 pt-4 px-4 sm:px-6">
      
      {/* TOP BAR */}
      <div className="max-w-lg mx-auto flex items-center justify-between py-4 mb-4 border-b border-[#bec9c5]/30">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-2 text-sm font-bold text-[#005145] hover:text-[#0f6b5c] transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>U noqo Guriga (Home)</span>
        </button>

        <DhammeLogo variant="sm" animated={false} showSubtitle={false} />
      </div>

      {/* DEDICATED AUTH CARD */}
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#bec9c5]/40 space-y-6 text-center">
        
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-[#1b1b1c]">
            {screen === 'login' ? 'Soo Gal Koontadaada' : screen === 'signup' ? 'Sameey Koonto Cusub' : 'Dib u hel Password-ka'}
          </h1>
          <p className="text-xs text-[#645d54]">
            DHAMME Real Estate • Jigjiga Somali Region
          </p>
        </div>

        {/* Google OAuth Direct Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border border-[#bec9c5]/60 text-gray-800 font-poppins font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <span>{isGoogleLoading ? 'Waa la fasaxayaa...' : 'Ku Soo Gal Google (Google Sign-In)'}</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-[#645d54] uppercase tracking-wider">AMA (OR)</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-[#f0eded] p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setAuthMode('clerk')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
              authMode === 'clerk' ? 'bg-[#005145] text-white shadow' : 'text-[#3f4946]'
            }`}
          >
            <span>🔒 Clerk Auth</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('local')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
              authMode === 'local' ? 'bg-[#005145] text-white shadow' : 'text-[#3f4946]'
            }`}
          >
            <span>📝 Form Auth</span>
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold">
            {successMsg}
          </div>
        )}

        {/* CLERK AUTHENTICATION */}
        {authMode === 'clerk' && (
          <div className="py-2 flex justify-center overflow-x-auto w-full">
            {screen === 'login' ? (
              <SignIn routing="virtual" appearance={{ elements: { footer: { display: 'none' } } }} />
            ) : (
              <SignUp routing="virtual" appearance={{ elements: { footer: { display: 'none' } } }} />
            )}
          </div>
        )}

        {/* DIRECT FORM AUTHENTICATION */}
        {authMode === 'local' && (
          <div>
            {screen === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Gmail / Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="magacaaga@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Password-ka:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setScreen('forgot_password')}
                    className="text-xs text-[#005145] font-semibold hover:underline"
                  >
                    Ma harawday Password-ka?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-sm shadow-md hover:bg-[#0f6b5c] transition"
                >
                  Soo Gal (Login)
                </button>
              </form>
            )}

            {screen === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Magacaaga Buuxa:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Axmed Cali Maxamed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Gmail / Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="magacaaga@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Telefoonka:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +251 91 500 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Password Cusub:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-sm shadow-md hover:bg-[#0f6b5c] transition"
                >
                  Sameey Koonto (Sign Up)
                </button>
              </form>
            )}

            {screen === 'forgot_password' && (
              <div className="space-y-4 text-left">
                <p className="text-xs text-[#3f4946]">
                  Soo gali Gmail-kaaga si aan kuugu soo dirno nambar ama link aad ku badasho password-ka.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#3f4946] mb-1">
                    Gmail / Email:
                  </label>
                  <input
                    type="email"
                    placeholder="magacaaga@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 bg-[#f0eded] rounded-xl text-sm font-semibold text-[#1b1b1c] border border-[#bec9c5]/40 focus:outline-none focus:ring-2 focus:ring-[#005145]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!validateEmail(email)) {
                      setErrorMsg('Fadlan qor Gmail sax ah.');
                      return;
                    }
                    setSuccessMsg('Fariin waa loo diray Gmail-kaaga. Fadlan eeg inbox-kaaga.');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-sm shadow-md hover:bg-[#0f6b5c] transition"
                >
                  Soo Dir Link-ga (Reset Password)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer Toggle links */}
        <div className="pt-2 border-t border-[#bec9c5]/40 text-xs text-[#3f4946]">
          {screen === 'login' ? (
            <p>
              Miyaanad lahayn koonto?{' '}
              <button
                type="button"
                onClick={() => {
                  setScreen('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-[#005145] hover:underline"
              >
                Sameey Koonto (Sign Up)
              </button>
            </p>
          ) : (
            <p>
              Horay ma u lahayd koonto?{' '}
              <button
                type="button"
                onClick={() => {
                  setScreen('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="font-bold text-[#005145] hover:underline"
              >
                Soo Gal (Login)
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
