import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { ScreenName, UserProfile } from '../types';
import { DhammeLogo } from './DhammeLogo';
import type { Language } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';
import { requestPushPermission, getPushPermissionStatus, triggerWebPushNotification } from '../utils/pushNotifications';

interface HeaderNavProps {
  userProfile: UserProfile | null;
  onNavigate: (screen: ScreenName) => void;
  onOpenAI: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ 
  userProfile, 
  onNavigate, 
  onOpenAI
}) => {
  const { lang, setLang } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [pushStatus, setPushStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPushStatus(getPushPermissionStatus());
  }, []);

  const handleToggleNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (getPushPermissionStatus() !== 'granted') {
      const granted = await requestPushPermission();
      if (granted) {
        setPushStatus('granted');
        triggerWebPushNotification({
          title: 'DHAMME Web Push Active 🔔',
          body: 'Bogaadin! Ogolaanshaha Web Push Notifications-ka waa la shaqaysiiyey.'
        });
      }
    }
  };

  const handleSelectLang = (selected: Language) => {
    setLang(selected);
    setShowLangMenu(false);
  };

  const isAdmin = userProfile?.isAdmin || userProfile?.email === 'magudbeai@gmail.com';

  const notificationsList = [
    {
      id: 'n1',
      title: '🔔 Fariin Maalmoolee (Daily Alert)',
      body: 'Si fudud ku hel guri oo kirayso ama iibso hadda ee Jigjiga!',
      time: 'Hada',
      isNew: true
    },
    {
      id: 'n2',
      title: '🏡 Guryo Cusub oo Kebele 06 Garab\'ase',
      body: 'Villa casri ah oo 2,000,000 ETB ah ayaa dhawaan la soo dhigay Jigjiga.',
      time: '1 saac horteed',
      isNew: true
    },
    {
      id: 'n3',
      title: '📍 Live GPS Distance Tracker Enabled',
      body: 'Waxaad hada arki kartaa fogaanta guri kasta u jiro telefoonkaaga.',
      time: 'Shalay',
      isNew: false
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-[#E8E5DF]/80 shadow-2xs transition-all">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-screen-xl mx-auto">
        
        {/* Animated Brand Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <DhammeLogo 
            variant="sm"
            animated={false}
            showSubtitle={true}
            onClick={() => onNavigate('home')}
          />
        </motion.div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Multi-Language Switcher Dropdown Pill */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.04, borderColor: '#C8A96B' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white border border-[#E8E5DF] text-xs font-semibold text-[#111315] shadow-xs cursor-pointer"
              title="Change Language"
            >
              <span>{lang === 'so' ? '🇸🇴 SO' : lang === 'en' ? '🇬🇧 EN' : '🇪🇹 AM'}</span>
              <motion.span 
                animate={{ rotate: showLangMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="material-symbols-outlined text-[16px] text-[#74777B]"
              >
                expand_more
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-11 w-36 bg-white rounded-2xl shadow-xl border border-[#E8E5DF] p-1.5 z-50 space-y-1"
                >
                  <button
                    onClick={() => handleSelectLang('so')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      lang === 'so' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#111315] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>🇸🇴 Af-Somali</span>
                    {lang === 'so' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  <button
                    onClick={() => handleSelectLang('en')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      lang === 'en' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#111315] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>🇬🇧 English</span>
                    {lang === 'en' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                  <button
                    onClick={() => handleSelectLang('am')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      lang === 'am' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#111315] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <span>🇪🇹 አማርኛ</span>
                    {lang === 'am' && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Master Admin Panel Trigger */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(200, 169, 107, 0.35)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('admin_dashboard')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315] text-xs font-bold shadow-xs cursor-pointer"
              title="Admin Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="hidden sm:inline">👑 Admin</span>
            </motion.button>
          )}

          {/* AI Helper Trigger */}
          <motion.button
            whileHover={{ scale: 1.05, borderColor: '#C8A96B' }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white border border-[#E8E5DF] text-[#111315] text-xs font-semibold shadow-xs cursor-pointer group"
            title="Dhamme AI Assistant"
          >
            <motion.span 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="material-symbols-outlined text-[18px] text-[#C8A96B]"
            >
              auto_awesome
            </motion.span>
            <span className="hidden sm:inline">AI Helper</span>
          </motion.button>

          {/* Notifications & Web Push button */}
          <motion.button 
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleToggleNotifications}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E5DF] hover:border-[#C8A96B] flex items-center justify-center transition-colors relative cursor-pointer shadow-xs"
            title="Notifications & Web Push"
          >
            <span className={`material-symbols-outlined text-[20px] ${pushStatus === 'granted' ? 'text-[#111315]' : 'text-[#74777B]'}`}>
              {pushStatus === 'granted' ? 'notifications_active' : 'notifications'}
            </span>
            <motion.span 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8A96B]" 
            />
          </motion.button>

          {/* User Profile Avatar / Sign In */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-2 cursor-pointer group"
            title={userProfile ? `Profile (${userProfile.fullName})` : 'Sign In / Profile'}
          >
            <div className="w-9 h-9 rounded-full border-2 border-[#E8E5DF] group-hover:border-[#C8A96B] bg-white flex items-center justify-center overflow-hidden shadow-xs transition-colors relative">
              {userProfile?.avatarUrl ? (
                <img 
                  className="w-full h-full object-cover" 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName} 
                />
              ) : (
                <span className="material-symbols-outlined text-[#111315] text-[20px]">
                  person
                </span>
              )}
            </div>
            {userProfile && (
              <span className="hidden md:inline text-xs font-semibold text-[#111315] group-hover:text-[#C8A96B] max-w-[100px] truncate transition-colors">
                {userProfile.fullName.split(' ')[0]}
              </span>
            )}
          </motion.button>

        </div>

      </div>

      {/* Daily Notifications Modal / Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-4 top-16 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#E8E5DF] p-4 space-y-3 z-50"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E5DF]">
              <div className="flex items-center space-x-1.5 text-[#111315]">
                <span className="material-symbols-outlined text-[20px] text-[#C8A96B]">notifications_active</span>
                <h3 className="font-serif font-bold text-sm text-[#111315]">
                  Fariimaha Maalmoolee (Alerts)
                </h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(false)}
                className="text-[#74777B] hover:text-[#111315] p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </motion.button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {notificationsList.map((notif, index) => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-1 relative"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-sans font-semibold text-xs text-[#111315]">{notif.title}</h4>
                    <span className="text-[9px] font-bold text-[#C8A96B] bg-white px-1.5 py-0.5 rounded-md border border-[#E8E5DF]">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#74777B] leading-snug">
                    {notif.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onNavigate('home');
                setShowNotifications(false);
              }}
              className="w-full py-3 rounded-xl bg-[#111315] text-white font-semibold text-xs text-center shadow-xs hover:bg-[#22272B] transition-colors cursor-pointer"
            >
              Angaar Guryaha Jigjiga
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
