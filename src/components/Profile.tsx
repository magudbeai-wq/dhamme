import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
  userProfile: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAI: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  userProfile,
  onUpdateProfile,
  onOpenAuth,
  onLogout,
  onOpenAI
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [bio, setBio] = useState(userProfile?.bio || 'User in Jigjiga, Somali Region, Ethiopia');
  const [avatarUrl, setAvatarUrl] = useState(
    userProfile?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const updated: UserProfile = {
      ...userProfile,
      fullName: fullName.trim() || userProfile.fullName,
      phone: phone.trim() || userProfile.phone,
      bio: bio.trim(),
      avatarUrl
    };

    onUpdateProfile(updated);
    setIsEditing(false);
  };

  if (!userProfile) {
    return (
      <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 animate-fade-in text-center">
        <div className="bg-[#fcf9f8] p-8 rounded-3xl listing-card-shadow space-y-4 border border-[#bec9c5]/40">
          <span className="material-symbols-outlined text-[64px] text-[#005145]">account_circle</span>
          <h2 className="font-poppins text-2xl font-bold text-[#1b1b1c]">
            Weli Ma Soo Galin (Not Logged In)
          </h2>
          <p className="text-xs text-[#3f4946] max-w-xs mx-auto">
            Fadlan ku sameey koonto Gmail ama ku soo gal si aad u maamusho profile-kaaga iyo guryahaaga Jigjiga.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-8 py-3.5 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs uppercase shadow-md hover:bg-[#0f6b5c]"
          >
            Soo Gal / Sameey Koonto (Login / Sign Up)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 animate-fade-in">
      
      {/* Profile Info Header */}
      <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-4 border border-[#bec9c5]/40">
        <div className="flex items-center space-x-4">
          
          {/* Avatar with Upload overlay */}
          <div className="relative group shrink-0">
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#005145] shadow-md"
            />
            <label className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <h2 className="font-poppins text-xl font-bold text-[#1b1b1c]">
              {userProfile.fullName}
            </h2>
            <span className="text-xs text-[#005145] font-semibold block">
              {userProfile.email}
            </span>
            <span className="text-xs text-[#3f4946] font-medium block">
              {userProfile.phone}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#005145]/10 text-[#005145]">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Bio / Description */}
        <p className="text-xs text-[#3f4946] italic pt-1 border-t border-[#bec9c5]/30">
          "{bio}"
        </p>

        {/* Toggle Edit Form */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-bold text-[#005145] underline flex items-center space-x-1"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>{isEditing ? 'Jooji Wax-ka-bedelka' : 'Wax ka bedel Profile-ka (Edit Profile)'}</span>
        </button>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <form onSubmit={handleSave} className="pt-4 border-t border-[#bec9c5]/40 space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Upload Sawir Cusub (Profile Photo):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full text-xs text-[#3f4946] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#005145] file:text-white file:font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Magaca Buuxa (Full Name):
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Phone Number (Ethiopia):
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs font-semibold text-[#1b1b1c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3f4946] uppercase mb-1">
                Qoraal ku saabsan adiga (Bio):
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-xs text-[#1b1b1c]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs uppercase shadow-md"
            >
              Kaydi Profile-ka (Save Profile)
            </button>
          </form>
        )}
      </div>

      {/* Profile Settings Options */}
      <div className="bg-[#fcf9f8] rounded-3xl listing-card-shadow overflow-hidden divide-y divide-[#bec9c5]/30 text-xs border border-[#bec9c5]/40">
        
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

        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f0eded] transition">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#005145]">translate</span>
            <span className="font-bold text-[#1b1b1c]">Luqadda / Language (Somali / English)</span>
          </div>
          <span className="text-xs font-bold text-[#005145]">Af-Soomaali</span>
        </div>

        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#f0eded] transition">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#005145]">help</span>
            <span className="font-bold text-[#1b1b1c]">Customer Support Helpline</span>
          </div>
          <span className="text-xs font-mono text-[#005145]">+251 91 000 8888</span>
        </div>

      </div>

      <button
        onClick={onLogout}
        className="w-full py-4 rounded-2xl bg-[#e5e2e1] text-[#ba1a1a] font-poppins font-bold text-xs hover:bg-[#ffdad6] transition flex items-center justify-center space-x-2"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span>Ka Bax Koontada (Logout)</span>
      </button>

    </main>
  );
};
