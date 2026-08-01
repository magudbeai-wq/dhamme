import React from 'react';

interface ProfileProps {
  onOpenAuth: () => void;
  onOpenAI: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onOpenAuth, onOpenAI }) => {
  return (
    <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 animate-fade-in">
      
      {/* User Info Header matching Stitch Profile design */}
      <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow flex items-center space-x-4">
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
          alt="Profile Avatar"
          className="w-16 h-16 rounded-full object-cover border-2 border-[#005145]"
        />
        <div className="flex-1">
          <h2 className="font-poppins text-xl font-bold text-[#1b1b1c]">
            Guled Ali
          </h2>
          <span className="text-xs text-[#005145] font-semibold block">
            +252 61 555 9812
          </span>
          <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-bold bg-[#005145]/10 text-[#005145]">
            Verified User
          </span>
        </div>
      </div>

      {/* Profile Settings Options */}
      <div className="bg-[#fcf9f8] rounded-3xl listing-card-shadow overflow-hidden divide-y divide-[#bec9c5]/30 text-xs">
        
        <div 
          onClick={onOpenAI}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f0eded] transition"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#005145]">auto_awesome</span>
            <span className="font-bold text-[#1b1b1c]">DHAMME Real Estate AI Helper</span>
          </div>
          <span className="material-symbols-outlined text-[#645d54]">chevron_right</span>
        </div>

        <div 
          onClick={onOpenAuth}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f0eded] transition"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#005145]">lock</span>
            <span className="font-bold text-[#1b1b1c]">Security & OTP Verification</span>
          </div>
          <span className="material-symbols-outlined text-[#645d54]">chevron_right</span>
        </div>

        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f0eded] transition">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#005145]">translate</span>
            <span className="font-bold text-[#1b1b1c]">Luqadda / Language (Somali / English)</span>
          </div>
          <span className="text-xs font-bold text-[#005145]">Af-Soomaali</span>
        </div>

        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f0eded] transition">
          <div className="flex items-center space-x-[#005145]">
            <span className="material-symbols-outlined text-[#005145]">help</span>
            <span className="font-bold text-[#1b1b1c] ml-3">Customer Support Helpline</span>
          </div>
          <span className="text-xs font-mono text-[#005145]">+252 61 000 8888</span>
        </div>

      </div>

      <button
        onClick={onOpenAuth}
        className="w-full py-4 rounded-2xl bg-[#e5e2e1] text-[#ba1a1a] font-poppins font-bold text-xs hover:bg-[#ffdad6] transition flex items-center justify-center space-x-2"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span>Ka Bax (Logout)</span>
      </button>

    </main>
  );
};
