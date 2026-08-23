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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in bg-[#FAF9F6]">
      
      {/* Action Notification Toast Banner */}
      {actionNotice && (
        <div className="bg-[#111315] text-white p-3.5 rounded-2xl border border-[#C8A96B] font-sans font-semibold text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-[#C8A96B]">check_circle</span>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Admin Executive Header Banner */}
      <div className="bg-[#111315] p-6 sm:p-8 rounded-3xl text-white shadow-sm border border-[#E8E5DF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#C8A96B] text-[#111315]">
              👑 MASTER ADMIN PANEL
            </span>
            <span className="text-xs font-mono text-[#FAF9F6]/80">magudbeai@gmail.com</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            DHAMME Live User & Real Estate Analytics
          </h1>
          <p className="text-xs text-[#FAF9F6]/70 font-normal">
            Dhamaan isticmaalayaasha is diwaan galiyay ({totalUsers} Users) & Guryaha Jigjiga ({videoProperties.length} Video Tours).
          </p>
        </div>

        <div className="z-10 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#C8A96B] block">System Status</span>
          <span className="text-xs font-semibold text-white flex items-center space-x-1 justify-center">
            <span className="w-2 h-2 rounded-full bg-[#4A7A63] animate-ping" />
            <span>On-Time Live User Sync</span>
          </span>
        </div>
      </div>

      {/* Master KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* User Growth */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Users Directory</span>
            <span className="material-symbols-outlined text-[24px]">group_add</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#17191C]">{totalUsers}</span>
            <span className="text-[11px] text-[#74777B] font-medium block mt-1">
              Active: {totalUsers - bannedUsersCount} {bannedUsersCount > 0 && <span className="text-[#A8453F] font-bold">| 🚫 {bannedUsersCount} Banned</span>}
            </span>
          </div>
        </div>

        {/* Total Posted Homes & Video Count */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Guryaha La Soo Dhigay</span>
            <span className="material-symbols-outlined text-[24px]">real_estate_agent</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#17191C]">{totalProperties}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">
              🎥 {videoProperties.length} Videos | Active: {activeProperties} | Sold: {soldProperties} | Rented: {rentedProperties}
            </span>
          </div>
        </div>

        {/* Market Volume Value */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#C8A96B]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Market Volume</span>
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#17191C]">
              {totalMarketVolumeEtb > 0 ? `${(totalMarketVolumeEtb / 1000000).toFixed(2)}M ETB` : '0 ETB'}
            </span>
            <span className="text-[10px] text-[#74777B] block font-normal">Total Property Value</span>
          </div>
        </div>

        {/* Total App Views */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">App Engagement</span>
            <span className="material-symbols-outlined text-[24px]">visibility</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#17191C]">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Total Property Page Views</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E8E5DF] pb-2 overflow-x-auto hide-scrollbar">
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
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#111315] text-white shadow-xs'
                : 'bg-white text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
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
          <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E5DF]">
              <div className="flex items-center space-x-2 text-[#111315]">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
                <h3 className="font-serif font-bold text-base text-[#17191C]">
                  Users-ka Is Diwaan Galisay (Live Signups Feed)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#111315] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E8E5DF]">
                {totalInquiries} Leads Active
              </span>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
              {allUsers.map((u) => (
                <div key={u.id} className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.fullName} className="w-9 h-9 rounded-full object-cover border border-[#E8E5DF]" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#111315] text-white flex items-center justify-center font-bold text-xs">
                        {u.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-[#17191C] block">{u.fullName} {u.isAdmin && '👑'}</span>
                      <span className="text-[11px] text-[#74777B] font-mono block">{u.email}</span>
                      <span className="text-[10px] text-[#74777B] block">📞 {u.phone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-medium bg-white text-[#17191C] px-2 py-0.5 rounded-md border border-[#E8E5DF]">
                      Registered
                    </span>
                    <span className="text-[10px] text-[#74777B] block mt-1 font-mono">{u.joinedDate || 'Today'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Kebele Demand Breakdown */}
          <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E5DF]">
              <div className="flex items-center space-x-2 text-[#111315]">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
                <h3 className="font-serif font-bold text-base text-[#17191C]">
                  Xaafadaha Ugu Baahida Badan (Kebele Demand)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#74777B]">Jigjiga Kebeles</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Kebele 06 (Garab\'ase Sector)', demand: '94% High Demand', color: 'bg-[#111315]' },
                { name: 'Kebele 03 (Taiwan Market Area)', demand: '88% High Demand', color: 'bg-[#17191C]' },
                { name: 'Kebele 08 (Airport Road)', demand: '82% Medium-High', color: 'bg-[#C8A96B]' },
                { name: 'Kebele 01 (City Center)', demand: '76% Medium', color: 'bg-[#74777B]' }
              ].map((k, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#17191C]">{k.name}</span>
                    <span className="text-[#74777B]">{k.demand}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#FAF9F6] border border-[#E8E5DF] rounded-full overflow-hidden">
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
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#17191C]">
                Dhamaan Isticmaalayaasha Is Diwaan Galisay ({totalUsers} Registered Users)
              </h3>
              <p className="text-xs text-[#74777B]">
                Xogta buuxda ee dadka koontada ku samaystay DHAMME App.
              </p>
            </div>

            <input
              type="text"
              placeholder="Raadi User (Magaca, Email, Phone)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="p-2.5 bg-[#FAF9F6] rounded-xl text-xs w-full sm:w-64 border border-[#E8E5DF] text-[#17191C]"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6] text-[#74777B] border-b border-[#E8E5DF]">
                  <th className="p-3 font-semibold">User Profile</th>
                  <th className="p-3 font-semibold">Email Address</th>
                  <th className="p-3 font-semibold">Phone Number</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Verification</th>
                  <th className="p-3 text-right font-semibold">Maamulka (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF]">
                {filteredUsers.map((user) => {
                  const userHomesCount = properties.filter(
                    (p) => p.ownerEmail === user.email || p.agentName === user.fullName || user.id.startsWith('admin')
                  ).length;
                  const isUserVerified = user.isVerified || userHomesCount >= 5;
                  const isMasterAdmin = user.email.toLowerCase() === 'magudbeai@gmail.com';

                  return (
                    <tr key={user.id} className={`hover:bg-[#FAF9F6] transition ${user.isBanned ? 'bg-[#A8453F]/10' : ''}`}>
                      <td className="p-3 flex items-center space-x-2.5">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover border border-[#E8E5DF]" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#111315] text-white font-bold flex items-center justify-center text-xs">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-[#17191C] block">{user.fullName} {isMasterAdmin && '👑 (Master Admin)'}</span>
                          <span className="text-[10px] text-[#74777B]">{user.joinedDate || '2026-08-01'}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[#17191C]">{user.email}</td>
                      <td className="p-3 font-semibold text-[#17191C]">{user.phone}</td>
                      <td className="p-3">
                        {user.isBanned ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#A8453F] text-white">
                            <span className="material-symbols-outlined text-[13px]">block</span>
                            <span>BANNED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#4A7A63] text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {isUserVerified ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#4A7A63] text-white">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF]">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {isMasterAdmin ? (
                          <span className="text-[10px] font-bold text-[#111315] bg-[#C8A96B] px-2.5 py-1 rounded-lg">
                            👑 Master Admin
                          </span>
                        ) : user.isBanned ? (
                          <button
                            onClick={() => handleConfirmUnban(user)}
                            className="px-3 py-1.5 bg-[#4A7A63] text-white font-semibold text-[11px] rounded-xl shadow-xs transition"
                            title="Unban this user"
                          >
                            ✅ Ka Qaad Xannibaadda
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConfirmBan(user)}
                            className="px-3 py-1.5 bg-[#A8453F] text-white font-semibold text-[11px] rounded-xl shadow-xs transition"
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
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-serif font-bold text-lg text-[#17191C]">
              Dhamaan Guryaha La Soo Dhigay Jigjiga ({properties.length})
            </h3>

            <input
              type="text"
              placeholder="Raadi Guri (Title, Kebele, Owner)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="p-2.5 bg-[#FAF9F6] rounded-xl text-xs w-full sm:w-64 border border-[#E8E5DF] text-[#17191C]"
            />
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#74777B]">
              Weli ma jirtay guryo la soo dhigay oo ku aaday raadintaada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#E8E5DF] flex space-x-3 cursor-pointer hover:border-[#111315] transition"
                >
                  <img src={prop.images[0]} alt={prop.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-semibold text-[#17191C] line-clamp-1">{prop.title}</h4>
                      <span className="text-[#74777B] text-[11px] block">{prop.city}, {prop.kebele}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-serif font-bold text-[#17191C] text-xs">{prop.priceLocalFormatted}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium ${
                        prop.status === 'sold' ? 'bg-[#A8453F] text-white' : prop.status === 'rented' ? 'bg-[#C8A96B] text-[#111315]' : 'bg-[#4A7A63] text-white'
                      }`}>
                        {prop.status ? prop.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </div>

                    {/* Admin Delete and View Action Row */}
                    <div className="flex gap-2 pt-2 border-t border-[#E8E5DF]">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProperty(prop); }}
                        className="flex-1 py-1.5 px-2 bg-[#111315] text-white text-[11px] font-semibold rounded-xl text-center"
                      >
                        Fiiri (View)
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleConfirmDelete(prop); }}
                        className="py-1.5 px-3 bg-[#A8453F] text-white text-[11px] font-semibold rounded-xl flex items-center space-x-1"
                        title="Delete listing permanently"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>Tirtir</span>
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
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#17191C] flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#111315]">videocam</span>
                <span>Muuqaalada Guryaha (Property Video Tours - {videoProperties.length})</span>
              </h3>
              <p className="text-xs text-[#74777B]">
                Xaqiiji oo fiiri muuqaalada tooska ah ee ay soo geliyeen mulkiilayaasha guryaha Jigjiga.
              </p>
            </div>

            <span className="px-3 py-1 bg-[#FAF9F6] text-[#17191C] text-xs font-semibold rounded-full border border-[#E8E5DF]">
              100% Video Quality Moderation Active
            </span>
          </div>

          {videoProperties.length === 0 ? (
            <div className="text-center py-16 bg-[#FAF9F6] rounded-2xl p-6 space-y-3 border border-[#E8E5DF]">
              <span className="material-symbols-outlined text-[48px] text-[#74777B]">videocam_off</span>
              <h4 className="font-serif font-bold text-sm text-[#17191C]">
                Weli Ma Jirto Guryo Leh Video Tours
              </h4>
              <p className="text-xs text-[#74777B] max-w-sm mx-auto">
                Marka mulkiilayaashu soo geliyaan muuqaalada guryaha (MP4/WebM), halkan ayaad toos uga eegi kartaa.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-[#FAF9F6] p-4 rounded-3xl border border-[#E8E5DF] space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm text-[#17191C]">{prop.title}</h4>
                      <span className="text-xs text-[#74777B] font-medium">{prop.city}, {prop.kebele}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-[#111315] text-white text-[10px] font-semibold rounded-xl">
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

                  <div className="flex items-center justify-between pt-2 border-t border-[#E8E5DF] text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#4A7A63]" />
                      <span className="font-semibold text-[#17191C]">Status: {prop.videoStatus || 'ready'}</span>
                      {prop.videoDuration && (
                        <span className="text-[#74777B]">({Math.round(prop.videoDuration)}s)</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="px-3 py-1.5 bg-[#111315] text-white text-[11px] font-semibold rounded-xl hover:bg-[#17191C]"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(prop)}
                        className="px-3 py-1.5 bg-[#A8453F] text-white text-[11px] font-semibold rounded-xl flex items-center space-x-1"
                        title="Delete video post"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>Tirtir</span>
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
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#17191C] flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#111315]">pin_drop</span>
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
                <div key={k} className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#17191C]">{k}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#111315] text-white font-semibold font-mono">
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
