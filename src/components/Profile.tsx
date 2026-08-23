import React, { useState } from 'react';
import type { UserProfile, ScreenName } from '../types';

interface ProfileProps {
  userProfile: UserProfile | null;
  userListingsCount?: number;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAI: () => void;
  onNavigate?: (screen: ScreenName) => void;
}

export const Profile: React.FC<ProfileProps> = ({
  userProfile,
  userListingsCount = 5,
  onUpdateProfile,
  onOpenAuth,
  onLogout,
  onOpenAI,
  onNavigate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');

  const isAdmin = userProfile?.isAdmin || userProfile?.email === 'magudbeai@gmail.com';
  const isVerified = userProfile?.isVerified || userListingsCount >= 5;

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
        <div className="bg-white p-8 rounded-3xl listing-card-shadow space-y-4 border border-slate-200">
          <span className="material-symbols-outlined text-[64px] text-rose-600">account_circle</span>
          <h2 className="font-poppins text-2xl font-bold text-slate-900">
            Weli Ma Soo Galin (Not Logged In)
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            Qof aan samaysan koonto ma soo gali karo. Fadlan kowaad ku sameey koonto Gmail ama ku soo gal.
          </p>
          <button
            onClick={onOpenAuth}
            className="px-8 py-3.5 rounded-2xl bg-rose-600 text-white font-poppins font-bold text-xs uppercase shadow-md hover:bg-rose-700 transition"
          >
            Sameey Koonto / Soo Gal (Sign Up / Login)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 animate-fade-in">
      
      {/* Profile Info Header */}
      <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-4 border border-slate-200">
        <div className="flex items-center space-x-4">
          
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-rose-600 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-rose-600 flex flex-col items-center justify-center text-rose-600">
                <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
                <span className="text-[9px] font-bold mt-0.5">Sawir Geli</span>
              </div>
            )}

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
            <h2 className="font-poppins text-xl font-bold text-slate-900 flex items-center space-x-2 flex-wrap gap-1">
              <span>{userProfile.fullName}</span>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 border border-amber-300">
                  👑 MASTER ADMIN
                </span>
              )}
            </h2>
            <span className="text-xs text-rose-600 font-semibold block">
              {userProfile.email}
            </span>
            <span className="text-xs text-slate-600 font-medium block">
              {userProfile.phone}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              {isVerified ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Verified Landlord Profile</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="material-symbols-outlined text-[14px]">pending</span>
                  <span>Pending 5 Homes Verification ({userListingsCount}/5)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* VERIFICATION PROGRESS / BADGE CARD */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-rose-600">verified_user</span>
              <span>Verification Status (5 Guri Requirement)</span>
            </span>
            <span className="font-mono font-bold text-rose-600">
              {userListingsCount >= 5 ? '5 / 5 (Completed)' : `${userListingsCount} / 5 Homes`}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 to-rose-700 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (userListingsCount / 5) * 100)}%` }} 
            />
          </div>

          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            {isVerified 
              ? '✅ Koontadaada waa la xaqiijiyay! Waxaad soo dhigtay 5+ guri oo sax ah, macaamiishuna waxay si toos ah u aaminayaan profile-kaaga.'
              : `Akauntigaaga wuxuu noqonayaa Verified mar haddii aad soo dhigto 5 guri oo sax ah (${5 - userListingsCount} guri oo kale ayaa kaa dhiman).`}
          </p>
        </div>

        {bio && (
          <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
            "{bio}"
          </p>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-bold text-rose-600 underline flex items-center space-x-1"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>{isEditing ? 'Jooji Wax-ka-bedelka' : 'Wax ka bedel Profile-ka (Edit Profile)'}</span>
        </button>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <form onSubmit={handleSave} className="pt-4 border-t border-slate-200 space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Upload Sawirkaaga (Profile Photo):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-rose-600 file:text-white file:font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Magaca Buuxa (Full Name):
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Phone Number (Ethiopia):
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-900 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Qoraal ku saabsan adiga (Bio):
              </label>
              <textarea
                rows={2}
                placeholder="Qor macluumaad ku saabsan adiga..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl text-xs text-slate-900 border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-rose-600 text-white font-poppins font-bold text-xs uppercase shadow-md hover:bg-rose-700 transition"
            >
              Kaydi Profile-ka (Save Profile)
            </button>
          </form>
        )}
      </div>

      {/* Settings Options */}
      <div className="bg-white rounded-3xl listing-card-shadow overflow-hidden divide-y divide-slate-100 text-xs border border-slate-200">
        
        {/* Master Admin Panel Direct Access Option */}
        {isAdmin && onNavigate && (
          <div 
            onClick={() => onNavigate('admin_dashboard')}
            className="p-4 bg-amber-50 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition border-b border-amber-200"
          >
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-slate-900">admin_panel_settings</span>
              <div>
                <span className="font-bold text-slate-900 block text-sm">👑 Master Admin Dashboard</span>
                <span className="text-[10px] text-slate-600 font-semibold block">Full App Analytics, User Directory & Property Monitoring</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-900">chevron_right</span>
          </div>
        )}

        <div 
          onClick={onOpenAI}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-rose-600">auto_awesome</span>
            <span className="font-bold text-slate-900">DHAMME Real Estate AI Helper</span>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

        {/* Customer Support Contact Info */}
        <div className="p-4 space-y-2 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-rose-600">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            <span className="font-bold text-slate-900">Customer Support & Help</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <a href="tel:0915752826" className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-rose-600 font-bold hover:bg-rose-50 transition">
              <span>📞 0915752826</span>
              <span className="text-[10px] font-sans font-normal text-slate-500">Wac Hada</span>
            </a>
            <a href="mailto:magudbeai@gmail.com" className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-rose-600 font-bold hover:bg-rose-50 transition truncate">
              <span className="truncate">✉️ magudbeai@gmail.com</span>
              <span className="text-[10px] font-sans font-normal text-slate-500 shrink-0">Email</span>
            </a>
          </div>
        </div>

        {/* Anti-Fraud Terms & Policy Trigger */}
        <div
          onClick={() => onNavigate && onNavigate('privacy')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-rose-600">privacy_tip</span>
            <div>
              <span className="font-bold text-slate-900 block">Privacy Policy</span>
              <span className="text-[10px] text-slate-500 block font-medium">Siyaasadda Khaaska ah & Ilaalinta Xogta</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

        <div
          onClick={() => onNavigate && onNavigate('terms')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-rose-600">description</span>
            <div>
              <span className="font-bold text-slate-900 block">Terms of Service</span>
              <span className="text-[10px] text-slate-500 block font-medium">Shuruudaha Isticmaalka Platform-ka</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

        <div 
          onClick={() => setShowPolicyModal(true)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-amber-600">gavel</span>
            <div>
              <span className="font-bold text-slate-900 block">Sharciyada & Siyaasadda (Anti-Fraud Policy)</span>
              <span className="text-[10px] text-amber-800 font-semibold block">Mamnuucista Sawirada Been Abuurka ah & Fraud</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

      </div>

      <button
        onClick={onLogout}
        className="w-full py-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-poppins font-bold text-xs hover:bg-red-100 transition flex items-center justify-center space-x-2"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span>Ka Bax Koontada (Logout)</span>
      </button>

      {/* Anti-Fraud Terms & Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4 border border-slate-200 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
                <h3 className="font-poppins font-bold text-base text-slate-900">
                  Sharciyada DHAMME (Anti-Fraud Policy)
                </h3>
              </div>
              <button onClick={() => setShowPolicyModal(false)} className="text-slate-400 p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-red-900 font-bold space-y-1">
                <h4>⚠️ Mamnuucista Sawirada Been Abuurka ah (No Fake Listings):</h4>
                <p className="font-normal text-[11px]">
                  Waa strictly mamnuuc in DHAMME Real Estate lagu soo dhigo sawiro been ah, guryo aan jirin, ama qiimo been abuur ah.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">1. Xaqiijinta Guryaha:</h4>
                <p>Guri kasta oo lagu soo dhigo DHAMME waa inuu yahay guri dhab ah oo ku yaala magaalada Jigjiga.</p>

                <h4 className="font-bold text-slate-900">2. Sawirada Rasmiga ah:</h4>
                <p>Sawirada guriga waa in ay yihiin kuwii dhabta ahaa ee guriga, laguma ogola sawiro Google laga soo min-guuriyay oo aan guriga khuseyn.</p>

                <h4 className="font-bold text-slate-900">3. Taageerada & Support Contact:</h4>
                <p>Wixii cabasho ama fraud ah fadlan si degdeg ah ugu soo dir Customer Support:</p>
                <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-xs font-bold text-rose-600 border border-slate-200">
                  📞 Phone: 0915752826<br/>
                  ✉️ Email: magudbeai@gmail.com
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPolicyModal(false)}
              className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-xs uppercase shadow-md hover:bg-rose-700 transition"
            >
              Waan Fahmay Sharciyada (I Agree)
            </button>
          </div>
        </div>
      )}

    </main>
  );
};
