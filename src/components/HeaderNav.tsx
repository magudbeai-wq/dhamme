import React, { useState, useEffect } from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80 transition-all duration-300">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16 w-full max-w-screen-xl mx-auto">
        
        {/* Animated Brand Logo */}
        <DhammeLogo 
          variant="sm"
          animated={true}
          showSubtitle={true}
          onClick={() => onNavigate('home')}
        />

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Multi-Language Switcher Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-200 active:scale-95 transition-all shadow-xs"
              title="Change Language"
            >
              <span>{lang === 'so' ? '🇸🇴 SO' : lang === 'en' ? '🇬🇧 EN' : '🇪🇹 AM'}</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 top-10 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fade-in space-y-1">
                <button
                  onClick={() => handleSelectLang('so')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    lang === 'so' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>🇸🇴 Af-Somali</span>
                  {lang === 'so' && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
                <button
                  onClick={() => handleSelectLang('en')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    lang === 'en' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {lang === 'en' && <span className="material-symbols-outlined text-[16px]">check</span>}
                </button>
                <button
                  onClick={() => handleSelectLang('am')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    lang === 'am' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition-all border border-amber-300"
              title="Admin Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="hidden sm:inline">👑 Admin Panel</span>
            </button>
          )}

          {/* AI Helper Trigger */}
          <button
            onClick={onOpenAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 text-white text-xs font-bold shadow-md hover:shadow-rose-500/20 active:scale-95 transition-all"
            title="Dhamme AI Helper"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-300 animate-pulse">auto_awesome</span>
            <span className="hidden sm:inline">AI Helper</span>
          </button>

          {/* Notifications & Web Push button */}
          <button 
            onClick={handleToggleNotifications}
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all relative"
            title="Notifications & Web Push"
          >
            <span className={`material-symbols-outlined text-[20px] ${pushStatus === 'granted' ? 'text-rose-600' : 'text-slate-600'}`}>
              {pushStatus === 'granted' ? 'notifications_active' : 'notifications'}
            </span>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white animate-ping" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-white" />
          </button>

          {/* Clerk User Button / App Profile Avatar */}
          <SignedIn>
            <div className="flex items-center space-x-2">
              <UserButton afterSignOutUrl="/" />
              <button
                onClick={() => onNavigate('profile')}
                className="hidden sm:flex text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                Profile
              </button>
            </div>
          </SignedIn>

          <SignedOut>
            <div 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full border-2 border-rose-600 bg-rose-50 flex items-center justify-center overflow-hidden active:scale-95 transition-all cursor-pointer shadow-sm hover:ring-4 hover:ring-rose-500/20 relative"
              title="Sign In / Profile"
            >
              {userProfile?.avatarUrl ? (
                <img 
                  className="w-full h-full object-cover" 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName} 
                />
              ) : (
                <span className="material-symbols-outlined text-rose-600 text-[24px]">
                  person
                </span>
              )}
            </div>
          </SignedOut>

        </div>

      </div>

      {/* Daily Notifications Modal / Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-16 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 space-y-3 z-50 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-1.5 text-rose-600">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <h3 className="font-poppins font-bold text-sm text-slate-900">
                Fariimaha Maalmoolee (Notifications)
              </h3>
            </div>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {notificationsList.map((notif) => (
              <div 
                key={notif.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 relative"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-poppins font-bold text-xs text-slate-900">{notif.title}</h4>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
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
            className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs text-center shadow-xs hover:bg-rose-700 transition-colors"
          >
            Angaar Guryaha Jigjiga
          </button>
        </div>
      )}
    </header>
  );
};
