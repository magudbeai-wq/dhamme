import React, { useState } from 'react';

interface AuthModalProps {
  initialScreen: 'login' | 'signup' | 'otp' | 'forgot_password';
  onSuccess: () => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialScreen,
  onSuccess,
  onClose
}) => {
  const [screen, setScreen] = useState<'login' | 'signup' | 'otp' | 'forgot_password'>(initialScreen);
  const [phone, setPhone] = useState('+252 61 ');
  const [otp, setOtp] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcf9f8] max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-5 text-center relative">
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

        {/* LOGIN SCREEN */}
        {screen === 'login' && (
          <div className="space-y-4">
            <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
              Kusoo Dhawaw DHAMME
            </h3>
            <p className="text-xs text-[#3f4946]">
              Geli nambarkaaga telefoonka si aad usoo gasho.
            </p>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3.5 bg-[#f0eded] rounded-2xl text-sm font-mono text-center font-bold text-[#1b1b1c]"
            />

            <button
              onClick={() => setScreen('otp')}
              className="w-full py-3.5 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs uppercase"
            >
              Dir Code-ka OTP (Send OTP)
            </button>

            <div className="text-xs text-[#645d54] pt-2">
              Ma lehid koonto?{' '}
              <button 
                onClick={() => setScreen('signup')} 
                className="text-[#005145] font-bold underline"
              >
                Is-diwaan-gali (Sign Up)
              </button>
            </div>
          </div>
        )}

        {/* SIGN UP SCREEN */}
        {screen === 'signup' && (
          <div className="space-y-4">
            <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
              Sameey Koonto Cusub
            </h3>
            <p className="text-xs text-[#3f4946]">
              Ku kireeyso ama ku iibi guryaha DHAMME.
            </p>

            <input
              type="text"
              placeholder="Magacaaga Buuxa (Full Name)"
              className="w-full p-3.5 bg-[#f0eded] rounded-2xl text-sm font-semibold"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3.5 bg-[#f0eded] rounded-2xl text-sm font-mono text-center font-bold"
            />

            <button
              onClick={() => setScreen('otp')}
              className="w-full py-3.5 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs uppercase"
            >
              Abuur Koonto (Register)
            </button>

            <div className="text-xs text-[#645d54] pt-2">
              Hadaad leedahay koonto?{' '}
              <button 
                onClick={() => setScreen('login')} 
                className="text-[#005145] font-bold underline"
              >
                Soo Gal (Login)
              </button>
            </div>
          </div>
        )}

        {/* OTP SCREEN */}
        {screen === 'otp' && (
          <div className="space-y-4">
            <h3 className="font-poppins font-bold text-xl text-[#1b1b1c]">
              Geli Code-ka OTP
            </h3>
            <p className="text-xs text-[#3f4946]">
              Code 4-digit ah ayaa loo diray nambarkaaga {phone}
            </p>

            <input
              type="text"
              maxLength={4}
              placeholder="••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3.5 bg-[#f0eded] rounded-2xl text-2xl font-mono text-center tracking-widest font-extrabold text-[#005145]"
            />

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs uppercase shadow-md"
            >
              Hubi (Verify & Enter)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
