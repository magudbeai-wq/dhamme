import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  const stepsData = [
    {
      id: 1,
      title: 'Find Homes in Jigjiga',
      titleSo: 'Hel Guriga Kiro & Iibka Jigjiga',
      desc: 'Discover verified houses, apartments, and villas across all Kebeles in Jigjiga, Somali Region, Ethiopia.',
      descSo: 'Ka raadi guryaha Kiro iyo Iibka ah ee Kebele 01 ilaa Kebele 10, Garab\'ase iyo Taiwan Area ee Jigjiga.',
      icon: 'search_hands_free',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Water & 24h Electricity Specs',
      titleSo: 'Laydhka & Biyaha Wakaallada',
      desc: 'Filter properties by 24h solar power, city water connection, and private swimming pool availability in Jigjiga.',
      descSo: 'Kala miix guryaha leh laydhka 24h solar-ka, biyaha wakaallada Jigjiga iyo meelaha amniga ah.',
      icon: 'electric_bolt',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Post & Contact Direct',
      titleSo: 'Direct Landlord Contact',
      desc: 'Post your Jigjiga property listing in 5 quick steps and connect directly with buyers and renters.',
      descSo: 'Soo dhig gurigaaga Jigjiga 5 Tallaabo oo kaliya si degdeg ah.',
      icon: 'real_estate_agent',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const current = stepsData[step - 1];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#F2E8DC] p-6 max-w-md mx-auto shadow-2xl animate-fade-in">
      
      {/* Top Header Skip */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex space-x-1.5">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-[#005145]' : 'w-2 bg-[#bec9c5]'
              }`}
            />
          ))}
        </div>
        <button 
          onClick={onComplete}
          className="text-xs font-semibold text-[#645d54] hover:text-[#005145]"
        >
          Kaftan (Skip)
        </button>
      </div>

      {/* Hero Image Card */}
      <div className="my-auto space-y-6">
        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-lg border border-[#bec9c5]/40">
          <img 
            src={current.image} 
            alt={current.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-[#005145] text-white flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[28px]">{current.icon}</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-poppins text-2xl font-bold text-[#1b1b1c]">
            {current.titleSo}
          </h2>
          <p className="text-xs text-[#3f4946] leading-relaxed max-w-xs mx-auto">
            {current.descSo}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3 pb-4">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-sm shadow-md transition flex items-center justify-center space-x-2"
        >
          <span>{step === 3 ? 'Biloow (Get Started)' : 'Sii Soco (Next)'}</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>

    </div>
  );
};
