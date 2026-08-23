import React, { useState } from 'react';
import { DhammeLogo } from './DhammeLogo';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);

  const stepsData = [
    {
      id: 1,
      title: 'Rent or Lease Homes in Jigjiga',
      titleSo: 'Kirayso Guryo ama Kiree',
      desc: 'Discover or post rental houses and apartments across Kebele 01 to Kebele 10, Garab\'ase, and Taiwan Market in Jigjiga.',
      descSo: 'Ka raadi ama soo dhig guryaha Kiro ee Kebele 01 ilaa Kebele 10, Garab\'ase iyo Taiwan Area ee Jigjiga.',
      icon: 'key',
      image: '/jigjiga-house-1.jpg'
    },
    {
      id: 2,
      title: 'Buy Affordable Homes or Sell Property',
      titleSo: 'Iibso Guryo Qiimo Jaban ama Iibi',
      desc: 'Find affordable properties for sale (e.g. 2,000,000 ETB) or sell your property fast in Jigjiga.',
      descSo: 'Ka hel guryaha iibka ah ee qiimaha jaban (e.g. 2,000,000 ETB) ama iibi gurigaaga Jigjiga si degdeg ah.',
      icon: 'sell',
      image: '/jigjiga-house-2.jpg'
    },
    {
      id: 3,
      title: 'Post Photos & Get Direct Clients Fast',
      titleSo: 'Soo Dhig Sawirka Gurigaaga Kadibna Hel Macaamiil',
      desc: 'Post your property in Jigjiga in 5 easy steps and connect with direct buyers and tenants fast.',
      descSo: 'Soo dhig gurigaaga Jigjiga 5 Tallaabo oo kaliya si aad macaamiil toos ah ugu hesho degdeg.',
      icon: 'add_a_photo',
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
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#FAF9F6] p-6 max-w-lg mx-auto shadow-2xl animate-fade-in overflow-y-auto">
      
      {/* Top Header with Animated Logo & Skip */}
      <div className="flex justify-between items-center pt-2">
        <DhammeLogo variant="sm" animated={true} showSubtitle={false} />

        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-[#111315]' : 'w-1.5 bg-[#E8E5DF]'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={onComplete}
            className="text-xs font-semibold text-[#74777B] hover:text-[#17191C]"
          >
            Kaftan (Skip)
          </button>
        </div>
      </div>

      {/* Hero Image Card */}
      <div className="my-auto py-4 space-y-6">
        <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xs border border-[#E8E5DF] group">
          <img 
            src={current.image} 
            alt={current.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/60 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#111315] text-[#C8A96B] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[22px]">{current.icon}</span>
          </div>
        </div>

        <div className="text-center space-y-2 px-2">
          <h2 className="font-serif text-2xl font-bold text-[#17191C]">
            {current.titleSo}
          </h2>
          <p className="text-xs text-[#74777B] leading-relaxed max-w-sm mx-auto font-normal">
            {current.descSo}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3 pb-4">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-sans font-semibold text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>{step === 3 ? 'Biloow (Get Started)' : 'Sii Soco (Next)'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

    </div>
  );
};
