import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

const formVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: { duration: 0.18, ease: 'easeIn' as const }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' as const }
  }
};

export const AuthModal: React.FC<AuthModalProps> = ({
  initialScreen,
  registeredAccounts,
  onRegisterAccount,
  onLoginSuccess,
  onClose
}) => {
  const [screen, setScreen] = useState<'login' | 'signup' | 'forgot_password'>(initialScreen);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#111315]/65 backdrop-blur-md"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative bg-white max-w-sm w-full p-6 sm:p-7 rounded-[28px] shadow-2xl space-y-4 text-center border border-[#E8E5DF] my-auto z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute right-4 top-4 text-[#74777B] hover:text-[#111315] p-1.5 rounded-full hover:bg-[#FAF9F6] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </motion.button>

        {/* Header Logo */}
        <div className="pt-1 flex justify-center">
          <DhammeLogo variant="md" animated={true} showSubtitle={true} />
        </div>

        {/* Tab Switcher */}
        <div className="relative flex p-1 bg-[#FAF9F6] border border-[#E8E5DF] rounded-xl">
          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setScreen('login');
            }}
            className={`relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer z-10 ${
              screen === 'login' ? 'text-[#111315]' : 'text-[#74777B] hover:text-[#111315]'
            }`}
          >
            {screen === 'login' && (
              <motion.div
                layoutId="authModalTabIndicator"
                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#E8E5DF]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-20">Soo Gal (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMsg('');
              setSuccessMsg('');
              setScreen('signup');
            }}
            className={`relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer z-10 ${
              screen === 'signup' ? 'text-[#111315]' : 'text-[#74777B] hover:text-[#111315]'
            }`}
          >
            {screen === 'signup' && (
              <motion.div
                layoutId="authModalTabIndicator"
                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#E8E5DF]"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-20">Sameey Koonto</span>
          </button>
        </div>

        {/* Google OAuth Direct Button */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E8E5DF] hover:border-[#C8A96B] text-[#111315] font-sans font-semibold text-xs flex items-center justify-center gap-2.5 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>{isGoogleLoading ? 'Connecting Google...' : 'Ku Soo Gal Google'}</span>
        </motion.button>

        <div className="flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-[#E8E5DF]" />
          <span className="text-[10px] text-[#74777B] uppercase font-semibold">ama (or)</span>
          <div className="flex-1 h-px bg-[#E8E5DF]" />
        </div>

        {/* Error & Success Messages */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              key="modal-error"
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200 text-left flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px] text-red-500 shrink-0">error</span>
              <span>{errorMsg}</span>
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              key="modal-success"
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 text-left flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">check_circle</span>
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Screens */}
        <AnimatePresence mode="wait">
          {screen === 'login' && (
            <motion.form
              key="modal-login-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleLogin}
              className="space-y-3 text-left"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Gmail / Email:
                </label>
                <input
                  type="email"
                  required
                  placeholder="magacaaga@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-1">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#111315] to-[#22272B] hover:from-[#000000] hover:to-[#17191C] text-white font-sans font-semibold text-xs uppercase shadow-xs transition-all cursor-pointer"
                >
                  Soo Gal (Login)
                </motion.button>
              </motion.div>
            </motion.form>
          )}

          {screen === 'signup' && (
            <motion.form
              key="modal-signup-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSignUp}
              className="space-y-2.5 text-left"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-[10px] font-semibold text-[#74777B] uppercase mb-0.5">
                  Magacaaga Buuxa:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Magacaaga Buuxa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[10px] font-semibold text-[#74777B] uppercase mb-0.5">
                  Gmail / Email:
                </label>
                <input
                  type="email"
                  required
                  placeholder="magacaaga@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[10px] font-semibold text-[#74777B] uppercase mb-0.5">
                  Telefoonka (Phone):
                </label>
                <input
                  type="text"
                  required
                  placeholder="+251 9..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[10px] font-semibold text-[#74777B] uppercase mb-0.5">
                  Password (Min 6 chars):
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/20 transition-all outline-none"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-1">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#B69656] hover:from-[#B69656] text-white font-sans font-semibold text-xs uppercase shadow-xs transition-all cursor-pointer"
                >
                  Abuur Koonto (Sign Up)
                </motion.button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
