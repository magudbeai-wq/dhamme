import React, { useState, useEffect } from 'react';
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
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E5DF] transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-screen-xl mx-auto">
        
        {/* Animated Brand Logo */}
        <DhammeLogo 
          variant="sm"
          animated={false}
          showSubtitle={true}
          onClick={() => onNavigate('home')}
        />

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Multi-Language Switcher Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white border border-[#E8E5DF] text-xs font-semibold text-[#17191C] hover:border-[#111315] active:scale-95 transition-all shadow-xs"
              title="Change Language"
            >
              <span>{lang === 'so' ? '🇸🇴 SO' : lang === 'en' ? '🇬🇧 EN' : '🇪🇹 AM'}</span>
              <span className="material-symbols-outlined text-[16px] text-[#74777B]">expand_more</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-10 w-36 bg-white rounded-2xl shadow-xl border border-[#E8E5DF] p-1.5 z-50 animate-fade-in space-y-1">
                <button
                  onClick={() => handleSelectLang('so')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    lang === 'so' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#17191C] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <span>🇸🇴 Af-Somali</span>
                  {lang === 'so' && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
                <button
                  onClick={() => handleSelectLang('en')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    lang === 'en' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#17191C] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {lang === 'en' && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
                <button
                  onClick={() => handleSelectLang('am')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    lang === 'am' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#17191C] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <span>🇪🇹 አማርኛ</span>
                  {lang === 'am' && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
              </div>
            )}
          </div>

          {/* Master Admin Panel Trigger (Visible to Admin) */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin_dashboard')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#C8A96B] text-[#111315] text-xs font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all"
              title="Admin Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="hidden sm:inline">👑 Admin Panel</span>
            </button>
          )}

          {/* AI Helper Trigger */}
          <button
            onClick={onOpenAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white border border-[#E8E5DF] text-[#111315] text-xs font-semibold hover:border-[#111315] active:scale-95 transition-all shadow-xs"
            title="Dhamme AI Helper"
          >
            <span className="material-symbols-outlined text-[18px] text-[#C8A96B]">auto_awesome</span>
            <span className="hidden sm:inline">AI Helper</span>
          </button>

          {/* Notifications & Web Push button */}
          <button 
            onClick={handleToggleNotifications}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E5DF] flex items-center justify-center hover:border-[#111315] active:scale-95 transition-all relative"
            title="Notifications & Web Push"
          >
            <span className={`material-symbols-outlined text-[20px] ${pushStatus === 'granted' ? 'text-[#111315]' : 'text-[#74777B]'}`}>
              {pushStatus === 'granted' ? 'notifications_active' : 'notifications'}
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8A96B]" />
          </button>

          {/* User Profile Avatar / Sign In */}
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center space-x-2 active:scale-95 transition-all cursor-pointer group"
            title={userProfile ? `Profile (${userProfile.fullName})` : 'Sign In / Profile'}
          >
            <div className="w-9 h-9 rounded-full border border-[#E8E5DF] bg-white flex items-center justify-center overflow-hidden shadow-xs group-hover:border-[#111315] transition-colors relative">
              {userProfile?.avatarUrl ? (
                <img 
                  className="w-full h-full object-cover" 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName} 
                />
              ) : (
                <span className="material-symbols-outlined text-[#111315] text-[22px]">
                  person
                </span>
              )}
            </div>
            {userProfile && (
              <span className="hidden md:inline text-xs font-semibold text-[#111315] group-hover:underline max-w-[100px] truncate">
                {userProfile.fullName.split(' ')[0]}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Daily Notifications Modal / Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-16 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-[#E8E5DF] p-4 space-y-3 z-50 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E5DF]">
            <div className="flex items-center space-x-1.5 text-[#111315]">
              <span className="material-symbols-outlined text-[20px] text-[#C8A96B]">notifications_active</span>
              <h3 className="font-serif font-bold text-sm text-[#17191C]">
                Fariimaha Maalmoolee (Notifications)
              </h3>
            </div>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-[#74777B] hover:text-[#17191C] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {notificationsList.map((notif) => (
              <div 
                key={notif.id}
                className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-1 relative"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-sans font-semibold text-xs text-[#17191C]">{notif.title}</h4>
                  <span className="text-[9px] font-bold text-[#C8A96B] bg-[#FAF9F6] px-1.5 py-0.5 rounded-md border border-[#E8E5DF]">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#74777B] leading-snug">
                  {notif.body}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              onNavigate('home');
              setShowNotifications(false);
            }}
            className="w-full py-2.5 rounded-xl bg-[#111315] text-white font-semibold text-xs text-center shadow-xs hover:bg-[#17191C] transition-colors"
          >
            Angaar Guryaha Jigjiga
          </button>
        </div>
      )}
    </header>
  );
};
