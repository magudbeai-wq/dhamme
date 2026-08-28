import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 text-center bg-[#FAF9F6]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl listing-card-shadow space-y-4 border border-[#E8E5DF]"
        >
          <span className="material-symbols-outlined text-[64px] text-[#74777B]">account_circle</span>
          <h2 className="font-serif text-2xl font-bold text-[#111315]">
            Weli Ma Soo Galin (Not Logged In)
          </h2>
          <p className="text-xs text-[#74777B] max-w-xs mx-auto">
            Qof aan samaysan koonto ma soo gali karo. Fadlan kowaad ku sameey koonto Gmail ama ku soo gal.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenAuth}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#111315] to-[#22272B] text-white font-sans font-semibold text-xs uppercase shadow-md hover:bg-[#17191C] transition cursor-pointer"
          >
            Sameey Koonto / Soo Gal (Sign Up / Login)
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 bg-[#FAF9F6]">
      
      {/* Profile Info Header */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl listing-card-shadow space-y-4 border border-[#E8E5DF]"
      >
        <div className="flex items-center space-x-4">
          
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={avatarUrl}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#C8A96B] shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#FAF9F6] border border-dashed border-[#E8E5DF] flex flex-col items-center justify-center text-[#74777B]">
                <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                <span className="text-[9px] font-medium mt-0.5">Sawir Geli</span>
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
            <h2 className="font-serif text-xl font-bold text-[#111315] flex items-center space-x-2 flex-wrap gap-1">
              <span>{userProfile.fullName}</span>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C8A96B] text-[#111315] shadow-xs">
                  👑 MASTER ADMIN
                </span>
              )}
            </h2>
            <span className="text-xs text-[#74777B] font-medium block">
              {userProfile.email}
            </span>
            <span className="text-xs text-[#74777B] font-medium block">
              {userProfile.phone}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              {isVerified ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4A7A63] text-white shadow-2xs">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Verified Landlord</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF]">
                  <span className="material-symbols-outlined text-[14px]">pending</span>
                  <span>Pending ({userListingsCount}/5)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* VERIFICATION PROGRESS / BADGE CARD */}
        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#111315] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#4A7A63]">verified_user</span>
              <span>Verification Status (5 Guri Requirement)</span>
            </span>
            <span className="font-mono font-bold text-[#111315]">
              {userListingsCount >= 5 ? '5 / 5 (Completed)' : `${userListingsCount} / 5 Homes`}
            </span>
          </div>

          <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#E8E5DF]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#111315] to-[#4A7A63] rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (userListingsCount / 5) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <p className="text-[11px] text-[#74777B] leading-relaxed">
            {isVerified 
              ? '✅ Koontadaada waa la xaqiijiyay! Waxaad soo dhigtay 5+ guri oo sax ah, macaamiishuna waxay si toos ah u aaminayaan profile-kaaga.'
              : `Akauntigaaga wuxuu noqonayaa Verified mar haddii aad soo dhigto 5 guri oo sax ah (${5 - userListingsCount} guri oo kale ayaa kaa dhiman).`}
          </p>
        </div>

        {bio && (
          <p className="text-xs text-[#74777B] italic pt-1 border-t border-[#E8E5DF]">
            "{bio}"
          </p>
        )}

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-[#111315] hover:text-[#C8A96B] underline flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>{isEditing ? 'Jooji Wax-ka-bedelka' : 'Wax ka bedel Profile-ka (Edit Profile)'}</span>
        </button>

        {/* EDIT PROFILE FORM */}
        <AnimatePresence>
          {isEditing && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSave} 
              className="pt-4 border-t border-[#E8E5DF] space-y-3 text-left overflow-hidden"
            >
              <div>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Upload Sawirkaaga (Profile Photo):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full text-xs text-[#74777B] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#111315] file:text-white file:font-semibold cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Magaca Buuxa (Full Name):
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Phone Number (Ethiopia):
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Qoraal ku saabsan adiga (Bio):
                </label>
                <textarea
                  rows={2}
                  placeholder="Qor macluumaad ku saabsan adiga..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs text-[#111315] border border-[#E8E5DF] focus:border-[#C8A96B]"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-[#111315] hover:bg-[#22272B] text-white font-sans font-semibold text-xs uppercase shadow-xs transition cursor-pointer"
              >
                Kaydi Profile-ka (Save Profile)
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Options */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl listing-card-shadow overflow-hidden divide-y divide-[#E8E5DF] text-xs border border-[#E8E5DF]"
      >
        
        {/* Master Admin Panel Direct Access Option */}
        {isAdmin && onNavigate && (
          <div 
            onClick={() => onNavigate('admin_dashboard')}
            className="p-4 bg-[#FAF9F6] flex items-center justify-between cursor-pointer hover:bg-white transition border-b border-[#E8E5DF]"
          >
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-[#C8A96B]">admin_panel_settings</span>
              <div>
                <span className="font-semibold text-[#111315] block text-sm">👑 Master Admin Dashboard</span>
                <span className="text-[10px] text-[#74777B] font-normal block">Full App Analytics, User Directory & Property Monitoring</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#74777B]">chevron_right</span>
          </div>
        )}

        <div 
          onClick={onOpenAI}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F6] transition"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#C8A96B]">auto_awesome</span>
            <span className="font-semibold text-[#111315]">DHAMME Real Estate AI Helper</span>
          </div>
          <span className="material-symbols-outlined text-[#74777B]">chevron_right</span>
        </div>

        {/* Customer Support Contact Info */}
        <div className="p-4 space-y-2 bg-[#FAF9F6]">
          <div className="flex items-center space-x-2 text-[#111315]">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
            <span className="font-semibold text-[#111315]">Customer Support & Help</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="tel:0915752826" 
              className="p-2.5 bg-white rounded-xl border border-[#E8E5DF] flex items-center justify-between text-[#111315] font-semibold hover:border-[#111315] transition cursor-pointer"
            >
              <span>📞 0915752826</span>
              <span className="text-[10px] font-sans font-normal text-[#74777B]">Wac Hada</span>
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:magudbeai@gmail.com" 
              className="p-2.5 bg-white rounded-xl border border-[#E8E5DF] flex items-center justify-between text-[#111315] font-semibold hover:border-[#111315] transition truncate cursor-pointer"
            >
              <span className="truncate">✉️ magudbeai@gmail.com</span>
              <span className="text-[10px] font-sans font-normal text-[#74777B] shrink-0">Email</span>
            </motion.a>
          </div>
        </div>

        {/* Anti-Fraud Terms & Policy Trigger */}
        <div
          onClick={() => onNavigate && onNavigate('privacy')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F6] transition border-b border-[#E8E5DF]"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#111315]">privacy_tip</span>
            <div>
              <span className="font-semibold text-[#111315] block">Privacy Policy</span>
              <span className="text-[10px] text-[#74777B] block font-normal">Siyaasadda Khaaska ah & Ilaalinta Xogta</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#74777B]">chevron_right</span>
        </div>

        <div
          onClick={() => onNavigate && onNavigate('terms')}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F6] transition border-b border-[#E8E5DF]"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#111315]">description</span>
            <div>
              <span className="font-semibold text-[#111315] block">Terms of Service</span>
              <span className="text-[10px] text-[#74777B] block font-normal">Shuruudaha Isticmaalka Platform-ka</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#74777B]">chevron_right</span>
        </div>

        <div 
          onClick={() => setShowPolicyModal(true)}
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F6] transition"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-[#C8A96B]">gavel</span>
            <div>
              <span className="font-semibold text-[#111315] block">Sharciyada & Siyaasadda (Anti-Fraud Policy)</span>
              <span className="text-[10px] text-[#74777B] font-normal block">Mamnuucista Sawirada Been Abuurka ah & Fraud</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#74777B]">chevron_right</span>
        </div>

      </motion.div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full py-4 rounded-2xl bg-white text-red-600 border border-red-200 font-sans font-semibold text-xs hover:bg-red-50 transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span>Ka Bax Koontada (Logout)</span>
      </motion.button>

      {/* Anti-Fraud Terms & Policy Modal */}
      <AnimatePresence>
        {showPolicyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPolicyModal(false)}
              className="fixed inset-0 bg-[#111315]/65 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4 border border-[#E8E5DF] text-left max-h-[85vh] overflow-y-auto z-10"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E5DF]">
                <div className="flex items-center space-x-2 text-[#111315]">
                  <span className="material-symbols-outlined text-[24px] text-[#C8A96B]">verified_user</span>
                  <h3 className="font-serif font-bold text-base text-[#111315]">
                    Sharciyada DHAMME (Anti-Fraud Policy)
                  </h3>
                </div>
                <button onClick={() => setShowPolicyModal(false)} className="text-[#74777B] p-1 cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#74777B] leading-relaxed">
                <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] text-[#111315] font-semibold space-y-1">
                  <h4>⚠️ Mamnuucista Sawirada Been Abuurka ah (No Fake Listings):</h4>
                  <p className="font-normal text-[11px] text-[#74777B]">
                    Waa strictly mamnuuc in DHAMME Real Estate lagu soo dhigo sawiro been ah, guryo aan jirin, ama qiimo been abuur ah.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-[#111315]">1. Xaqiijinta Guryaha:</h4>
                  <p>Guri kasta oo lagu soo dhigo DHAMME waa inuu yahay guri dhab ah oo ku yaala magaalada Jigjiga.</p>

                  <h4 className="font-semibold text-[#111315]">2. Sawirada Rasmiga ah:</h4>
                  <p>Sawirada guriga waa in ay yihiin kuwii dhabta ahaa ee guriga, laguma ogola sawiro Google laga soo min-guuriyay oo aan guriga khuseyn.</p>

                  <h4 className="font-semibold text-[#111315]">3. Taageerada & Support Contact:</h4>
                  <p>Wixii cabasho ama fraud ah fadlan si degdeg ah ugu soo dir Customer Support:</p>
                  <div className="p-2.5 bg-[#FAF9F6] rounded-xl font-mono text-xs font-semibold text-[#111315] border border-[#E8E5DF]">
                    📞 Phone: 0915752826<br/>
                    ✉️ Email: magudbeai@gmail.com
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPolicyModal(false)}
                className="w-full py-3.5 rounded-xl bg-[#111315] text-white font-semibold text-xs uppercase shadow-xs hover:bg-[#22272B] transition cursor-pointer"
              >
                Waan Fahmay Sharciyada (I Agree)
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
};
