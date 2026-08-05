import React, { useState } from 'react';
import type { UserProfile } from '../../types';
import type { RegisteredAccount } from '../../data/usersData';
import { DhammeLogo } from '../DhammeLogo';

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

        {/* LOGIN SCREEN */}
        {screen === 'login' && (
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
        {screen === 'signup' && (
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

      </div>
    </div>
  );
};
