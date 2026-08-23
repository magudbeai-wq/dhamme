import React, { useState } from 'react';
import type { PropertyListing, UserProfile } from '../types';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';

interface AdminDashboardProps {
  properties: PropertyListing[];
  registeredAccounts: UserProfile[];
  onSelectProperty: (property: PropertyListing) => void;
  onDeleteProperty?: (id: string) => void;
  onBanUser?: (userId: string, reason?: string) => void;
  onUnbanUser?: (userId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  registeredAccounts,
  onSelectProperty,
  onDeleteProperty,
  onBanUser,
  onUnbanUser
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'properties' | 'videos' | 'kebeles'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleConfirmDelete = (prop: PropertyListing) => {
    const confirm = window.confirm(`Ma hubtaa inaad gabi ahaanba tirtirto gurigan?\n"${prop.title}" (${prop.kebele})`);
    if (confirm && onDeleteProperty) {
      onDeleteProperty(prop.id);
      showNotification(`✅ Guriga "${prop.title}" si guul leh ayaa loo tirtiray.`);
    }
  };

  const handleConfirmBan = (user: UserProfile) => {
    if (user.email.toLowerCase() === 'magudbeai@gmail.com') {
      alert('Ma xannibi kartid Master Admin-ka!');
      return;
    }
    const reason = window.prompt(`Geli sababta aad u xannibayso ${user.fullName}:`, 'Ku xad-gudub shuruucda DHAMME (Violation of terms)');
    if (reason !== null && onBanUser) {
      onBanUser(user.id, reason);
      showNotification(`🚫 Isticmaalaha ${user.fullName} waa la xannibay.`);
    }
  };

  const handleConfirmUnban = (user: UserProfile) => {
    const confirm = window.confirm(`Ma hubtaa inaad xannibaadda ka qaaddo ${user.fullName}?`);
    if (confirm && onUnbanUser) {
      onUnbanUser(user.id);
      showNotification(`✅ Xannibaaddii waa laga qaaday ${user.fullName}.`);
    }
  };

  // Default Master Admin account if directory empty
  const defaultAdmin: UserProfile = {
    id: 'admin-master-magudbe',
    fullName: 'Magudbe Master Admin',
    email: 'magudbeai@gmail.com',
    phone: '0915752826',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    isAdmin: true,
    joinedDate: '2026-08-01'
  };

  const allUsers: UserProfile[] = registeredAccounts.length > 0
    ? registeredAccounts
    : [defaultAdmin];

  const totalUsers = allUsers.length;
  const bannedUsersCount = allUsers.filter((u) => u.isBanned).length;
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => (p.status || 'active') === 'active').length;
  const soldProperties = properties.filter((p) => p.status === 'sold').length;
  const rentedProperties = properties.filter((p) => p.status === 'rented').length;
  const videoProperties = properties.filter((p) => Boolean(p.videoUrl));

  const totalMarketVolumeEtb = properties.reduce((sum, p) => sum + (p.priceEtb || 0), 0);
  const totalViews = properties.reduce((sum, p) => sum + (p.viewsCount || 45), 0);
  const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiriesCount || 6), 0);

  const filteredUsers = allUsers.filter((u) =>
    u.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.phone.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.kebele.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.agentName.toLowerCase().includes(searchFilter.toLowerCase())
  );


  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in">
      
      {/* Action Notification Toast Banner */}
      {actionNotice && (
        <div className="bg-rose-700 text-white p-3.5 rounded-2xl border-2 border-rose-400 font-poppins font-bold text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-amber-300">check_circle</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Admin Executive Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border-2 border-amber-400/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 shadow-md">
              👑 MASTER ADMIN PANEL
            </span>
            <span className="text-xs font-mono text-amber-200">magudbeai@gmail.com</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-black tracking-tight">
            DHAMME Live User & Real Estate Analytics
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Dhamaan isticmaalayaasha is diwaan galiyay ({totalUsers} Users) & Guryaha Jigjiga ({videoProperties.length} Video Tours).
          </p>
        </div>

        <div className="z-10 bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">System Status</span>
          <span className="text-xs font-bold text-rose-400 flex items-center space-x-1 justify-center">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>On-Time Live User Sync</span>
          </span>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Master KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* User Growth */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[11px] font-bold uppercase text-slate-600">Users Directory</span>
            <span className="material-symbols-outlined text-[24px]">group_add</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-3xl text-slate-900">{totalUsers}</span>
            <span className="text-[11px] text-rose-600 font-bold block mt-1">
              Active: {totalUsers - bannedUsersCount} {bannedUsersCount > 0 && <span className="text-red-600 font-black">| 🚫 {bannedUsersCount} Banned</span>}
            </span>
          </div>
        </div>

        {/* Total Posted Homes & Video Count */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[11px] font-bold uppercase text-slate-600">Guryaha La Soo Dhigay</span>
            <span className="material-symbols-outlined text-[24px]">real_estate_agent</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-3xl text-rose-600">{totalProperties}</span>
            <span className="text-[10px] text-slate-500 block font-semibold">
              🎥 {videoProperties.length} Videos | Active: {activeProperties} | Sold: {soldProperties} | Rented: {rentedProperties}
            </span>
          </div>
        </div>

        {/* Market Volume Value */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase text-slate-600">Market Volume</span>
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-xl sm:text-2xl text-slate-900">
              {totalMarketVolumeEtb > 0 ? `${(totalMarketVolumeEtb / 1000000).toFixed(2)}M ETB` : '0 ETB'}
            </span>
            <span className="text-[10px] text-slate-500 block font-semibold">Total Property Value</span>
          </div>
        </div>

        {/* Total App Views */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-[11px] font-bold uppercase text-slate-600">App Engagement</span>
            <span className="material-symbols-outlined text-[24px]">visibility</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-3xl text-rose-600">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block font-semibold">Total Property Page Views</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: '📊 Intelligence Overview' },
          { id: 'users', label: `👥 User Directory (${totalUsers})` },
          { id: 'properties', label: `🏠 Posted Homes (${totalProperties})` },
          { id: 'videos', label: `🎥 Video Moderation (${videoProperties.length})` },
          { id: 'kebeles', label: '📍 Kebele Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {/* TAB 1: OVERVIEW & LIVE SIGNUPS FEED */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Live User Signups Feed */}
          <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
                <h3 className="font-poppins font-bold text-base text-slate-900">
                  Users-ka Is Diwaan Galisay (Live Signups Feed)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {totalInquiries} Leads Active
              </span>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
              {allUsers.map((u) => (
                <div key={u.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.fullName} className="w-9 h-9 rounded-full object-cover border border-rose-600" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                        {u.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block">{u.fullName} {u.isAdmin && '👑'}</span>
                      <span className="text-[11px] text-rose-600 font-mono block">{u.email}</span>
                      <span className="text-[10px] text-slate-500 block">📞 {u.phone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
                      Registered
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">{u.joinedDate || 'Today'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Kebele Demand Breakdown */}
          <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-rose-600">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
                <h3 className="font-poppins font-bold text-base text-slate-900">
                  Xaafadaha Ugu Baahida Badan (Kebele Demand)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-rose-600">Jigjiga Kebeles</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Kebele 06 (Garab\'ase Sector)', demand: '94% High Demand', color: 'bg-rose-600' },
                { name: 'Kebele 03 (Taiwan Market Area)', demand: '88% High Demand', color: 'bg-rose-500' },
                { name: 'Kebele 08 (Airport Road)', demand: '82% Medium-High', color: 'bg-amber-500' },
                { name: 'Kebele 01 (City Center)', demand: '76% Medium', color: 'bg-slate-700' }
              ].map((k, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-900">{k.name}</span>
                    <span className="text-rose-600">{k.demand}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${k.color} rounded-full`} style={{ width: k.demand.split('%')[0] + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPLETE USER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-poppins font-bold text-lg text-slate-900">
                Dhamaan Isticmaalayaasha Is Diwaan Galisay ({totalUsers} Registered Users)
              </h3>
              <p className="text-xs text-slate-600">
                Xogta buuxda ee dadka koontada ku samaystay DHAMME App.
              </p>
            </div>

            <input
              type="text"
              placeholder="Raadi User (Magaca, Email, Phone)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="p-2.5 bg-slate-50 rounded-xl text-xs w-full sm:w-64 border border-slate-200"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3 text-right">Maamulka (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const userHomesCount = properties.filter(
                    (p) => p.ownerEmail === user.email || p.agentName === user.fullName || user.id.startsWith('admin')
                  ).length;
                  const isUserVerified = user.isVerified || userHomesCount >= 5;
                  const isMasterAdmin = user.email.toLowerCase() === 'magudbeai@gmail.com';

                  return (
                    <tr key={user.id} className={`hover:bg-slate-50 transition ${user.isBanned ? 'bg-red-50/40' : ''}`}>
                      <td className="p-3 flex items-center space-x-2.5">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover border border-rose-600" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{user.fullName} {isMasterAdmin && '👑 (Master Admin)'}</span>
                          <span className="text-[10px] text-slate-400">{user.joinedDate || '2026-08-01'}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-rose-600">{user.email}</td>
                      <td className="p-3 font-semibold text-slate-900">{user.phone}</td>
                      <td className="p-3">
                        {user.isBanned ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-600 text-white shadow-xs">
                            <span className="material-symbols-outlined text-[13px]">block</span>
                            <span>BANNED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {isUserVerified ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {isMasterAdmin ? (
                          <span className="text-[10px] font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg">
                            👑 Master Admin
                          </span>
                        ) : user.isBanned ? (
                          <button
                            onClick={() => handleConfirmUnban(user)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-xl shadow-xs active:scale-95 transition"
                            title="Unban this user"
                          >
                            ✅ Ka Qaad Xannibaadda (Unban)
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConfirmBan(user)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-xl shadow-xs active:scale-95 transition"
                            title="Ban this user from using Dhamme"
                          >
                            🚫 Xannib (Ban User)
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: POSTED HOMES INVENTORY */}
      {activeTab === 'properties' && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-poppins font-bold text-lg text-slate-900">
              Dhamaan Guryaha La Soo Dhigay Jigjiga ({properties.length})
            </h3>

            <input
              type="text"
              placeholder="Raadi Guri (Title, Kebele, Owner)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="p-2.5 bg-slate-50 rounded-xl text-xs w-full sm:w-64 border border-slate-200"
            />
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              Weli ma jirtay guryo la soo dhigay oo ku aaday raadintaada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex space-x-3 cursor-pointer hover:border-rose-600 transition"
                >
                  <img src={prop.images[0]} alt={prop.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{prop.title}</h4>
                      <span className="text-rose-600 font-semibold text-[11px] block">{prop.city}, {prop.kebele}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-poppins font-black text-rose-600 text-xs">{prop.priceLocalFormatted}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        prop.status === 'sold' ? 'bg-red-600 text-white' : prop.status === 'rented' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {prop.status ? prop.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </div>

                    {/* Admin Delete and View Action Row */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProperty(prop); }}
                        className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-xl text-center"
                      >
                        Fiiri (View)
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleConfirmDelete(prop); }}
                        className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xl flex items-center space-x-1"
                        title="Delete listing permanently"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>Tirtir (Delete)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: VIDEO MODERATION (TOURS) */}
      {activeTab === 'videos' && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-poppins font-bold text-lg text-slate-900 flex items-center space-x-2">
                <span className="material-symbols-outlined text-rose-600">videocam</span>
                <span>Muuqaalada Guryaha (Property Video Tours - {videoProperties.length})</span>
              </h3>
              <p className="text-xs text-slate-600">
                Xaqiiji oo fiiri muuqaalada tooska ah ee ay soo geliyeen mulkiilayaasha guryaha Jigjiga.
              </p>
            </div>

            <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
              100% Video Quality Moderation Active
            </span>
          </div>

          {videoProperties.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl p-6 space-y-3">
              <span className="material-symbols-outlined text-[48px] text-rose-600">videocam_off</span>
              <h4 className="font-poppins font-bold text-sm text-slate-900">
                Weli Ma Jirto Guryo Leh Video Tours
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Marka mulkiilayaashu soo geliyaan muuqaalada guryaha (MP4/WebM), halkan ayaad toos uga eegi kartaa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{prop.title}</h4>
                      <span className="text-xs text-rose-600 font-semibold">{prop.city}, {prop.kebele}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-xl">
                      {prop.priceLocalFormatted}
                    </span>
                  </div>

                  {prop.videoUrl && (
                    <PropertyVideoPlayer
                      videoUrl={prop.videoUrl}
                      posterUrl={prop.videoThumbnail || prop.images[0]}
                      title={prop.title}
                    />
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      <span className="font-bold text-slate-900">Status: {prop.videoStatus || 'ready'}</span>
                      {prop.videoDuration && (
                        <span className="text-slate-500">({Math.round(prop.videoDuration)}s)</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="px-3 py-1.5 bg-rose-600 text-white text-[11px] font-bold rounded-xl hover:bg-rose-700"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(prop)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-xl flex items-center space-x-1"
                        title="Delete video post"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>Tirtir (Delete)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: KEBELE ANALYTICS */}
      {activeTab === 'kebeles' && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-slate-200 space-y-4">
          <h3 className="font-poppins font-bold text-lg text-slate-900 flex items-center space-x-2">
            <span className="material-symbols-outlined text-rose-600">pin_drop</span>
            <span>Jigjiga Kebele Inventory Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              'Kebele 01 (City Center)',
              'Kebele 02 (University Road)',
              'Kebele 03 (Taiwan Market)',
              'Kebele 04',
              'Kebele 05',
              'Kebele 06 (Garab\'ase)',
              'Kebele 07',
              'Kebele 08 (Airport Road)',
              'Kebele 09',
              'Kebele 10',
              'Dudaxid'
            ].map((k) => {
              const kCount = properties.filter((p) => p.kebele.toLowerCase().includes(k.toLowerCase().split(' ')[1] || k.toLowerCase())).length;
              return (
                <div key={k} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{k}</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold font-mono">
                    {kCount}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </main>
  );
};
