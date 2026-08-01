import React, { useState } from 'react';
import type { UserProfile } from '../../types';

interface AuthModalProps {
  initialScreen: 'login' | 'signup' | 'forgot_password';
  onSuccess: (profile: UserProfile) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialScreen,
  onSuccess,
  onClose
}) => {
  const [screen, setScreen] = useState<'login' | 'signup' | 'forgot_password'>(initialScreen);
  
  // Registration & Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Fadlan qor magacaaga buuxa.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Fadlan qor Gmail ama Email sax ah (e.g. magac@gmail.com).');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password-ku waa inuu ka badan yahay 6 xaraf/nambar.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMsg('Fadlan qor nambarkaaga telefoonka oo sax ah.');
      return;
    }

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'User in Jigjiga, Somali Region, Ethiopia',
      isVerified: true
    };

    onSuccess(newProfile);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Fadlan qor Gmail ama Email sax ah.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password-ku waa inuu ka badan yahay 6 xaraf.');
      return;
    }

    const loginProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      fullName: email.split('@')[0].toUpperCase(),
      phone: phone.trim() || '+251 91 000 0000',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      bio: 'Verified User',
      isVerified: true
    };

    onSuccess(loginProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcf9f8] max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-5 text-center relative border border-[#bec9c5]/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#645d54] hover:text-[#1b1b1c]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header Logo */}
        <div className="w-14 h-14 rounded-2xl bg-[#005145] text-white flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-[32px]">home_work</span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* LOGIN SCREEN */}
        {screen === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            <div className="text-center">
              <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
                Kusoo Dhawaw DHAMME
              </h3>
              <p className="text-xs text-[#3f4946]">
                Geli Gmail-kaaga iyo Password-ka si aad usoo gasho.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Gmail / Email:
              </label>
              <input
                type="email"
                required
                placeholder="magacaga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
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
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-xs uppercase shadow-md transition"
            >
              Soo Gal (Login)
            </button>

            <div className="text-center text-xs text-[#645d54] pt-2">
              Ma lehid koonto?{' '}
              <button 
                type="button"
                onClick={() => setScreen('signup')} 
                className="text-[#005145] font-bold underline"
              >
                Sameey Koonto (Sign Up)
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP SCREEN */}
        {screen === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 text-left">
            <div className="text-center">
              <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
                Sameey Koonto Cusub
              </h3>
              <p className="text-xs text-[#3f4946]">
                Ku kireeyso ama ku iibi guryaha Jigjiga.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Magacaaga Buuxa (Full Name):
              </label>
              <input
                type="text"
                required
                placeholder="Magaca Iyo Aabaha"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Gmail / Email Address:
              </label>
              <input
                type="email"
                required
                placeholder="magacaga@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
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
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
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
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-xs uppercase shadow-md transition"
            >
              Abuur Koonto (Register Account)
            </button>

            <div className="text-center text-xs text-[#645d54] pt-2">
              Hadaad leedahay koonto?{' '}
              <button 
                type="button"
                onClick={() => setScreen('login')} 
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
