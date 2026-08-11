import React, { useState } from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import type { ScreenName, UserProfile } from '../types';
import { DhammeLogo } from './DhammeLogo';

interface HeaderNavProps {
  userProfile: UserProfile | null;
  onNavigate: (screen: ScreenName) => void;
  onOpenAI: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ userProfile, onNavigate, onOpenAI }) => {
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#F2E8DC]/95 backdrop-blur-xl shadow-md border-b border-[#bec9c5]/40 transition-all duration-300">
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
          
          {/* Master Admin Panel Trigger (Visible to Admin) */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin_dashboard')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f0cf65] to-[#d4af37] text-[#002b24] text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all border border-[#d4af37]"
              title="Admin Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="hidden sm:inline">👑 Admin Panel</span>
            </button>
          )}

          {/* AI Helper Trigger */}
          <button
            onClick={onOpenAI}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-[#005145] to-[#0f6b5c] text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all"
            title="Dhamme AI Helper"
          >
            <span className="material-symbols-outlined text-[18px] text-[#a2f2de] animate-pulse">auto_awesome</span>
            <span className="hidden sm:inline">AI Helper</span>
          </button>

          {/* Notifications button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full bg-[#f0eded] border border-[#bec9c5]/40 flex items-center justify-center hover:bg-[#e5e2e1] active:scale-95 transition-all relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[#3f4946] text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#7b2f10] ring-2 ring-white animate-ping" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#7b2f10] ring-2 ring-white" />
          </button>

          {/* Clerk User Button / App Profile Avatar */}
          <SignedIn>
            <div className="flex items-center space-x-2">
              <UserButton afterSignOutUrl="/" />
              <button
                onClick={() => onNavigate('profile')}
                className="hidden sm:flex text-xs font-semibold text-[#005145] hover:underline"
              >
                Profile
              </button>
            </div>
          </SignedIn>

          <SignedOut>
            <div 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full border-2 border-[#005145] bg-[#ebe1d5] flex items-center justify-center overflow-hidden active:scale-95 transition-all cursor-pointer shadow-sm hover:ring-2 hover:ring-[#005145]/30 relative"
              title="Sign In / Profile"
            >
              {userProfile?.avatarUrl ? (
                <img 
                  className="w-full h-full object-cover" 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.fullName} 
                />
              ) : (
                <span className="material-symbols-outlined text-[#005145] text-[24px]">
                  person
                </span>
              )}
            </div>
          </SignedOut>

        </div>

      </div>


      {/* Daily Notifications Modal / Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 top-16 w-80 sm:w-96 bg-[#fcf9f8] rounded-3xl shadow-2xl border border-[#bec9c5]/60 p-4 space-y-3 z-50 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-[#bec9c5]/30">
            <div className="flex items-center space-x-1.5 text-[#005145]">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <h3 className="font-poppins font-bold text-sm text-[#1b1b1c]">
                Fariimaha Maalmoolee (Notifications)
              </h3>
            </div>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-[#6f7976] hover:text-[#1b1b1c] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {notificationsList.map((notif) => (
              <div 
                key={notif.id}
                className="p-3 bg-[#f0eded] rounded-2xl border border-[#bec9c5]/30 space-y-1 relative"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-poppins font-bold text-xs text-[#1b1b1c]">{notif.title}</h4>
                  <span className="text-[9px] font-bold text-[#005145] bg-[#005145]/10 px-1.5 py-0.5 rounded-md">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#3f4946] leading-snug">
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
            className="w-full py-2.5 rounded-xl bg-[#005145] text-white font-bold text-xs text-center shadow-xs hover:bg-[#0f6b5c]"
          >
            Angaar Guryaha Jigjiga
          </button>
        </div>
      )}
    </header>
  );
};
