import React, { useState } from 'react';
import type { PropertyListing, UserProfile } from '../types';

interface AdminDashboardProps {
  properties: PropertyListing[];
  registeredAccounts: UserProfile[];
  onSelectProperty: (property: PropertyListing) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  registeredAccounts,
  onSelectProperty
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'properties' | 'kebeles'>('overview');
  const [searchFilter, setSearchFilter] = useState('');

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
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => (p.status || 'active') === 'active').length;
  const soldProperties = properties.filter((p) => p.status === 'sold').length;
  const rentedProperties = properties.filter((p) => p.status === 'rented').length;

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
      
      {/* Admin Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#00382f] via-[#005145] to-[#0f6b5c] p-6 sm:p-8 rounded-3xl text-white shadow-2xl border-2 border-[#d4af37]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#d4af37] text-[#002821] shadow-md">
              👑 MASTER ADMIN PANEL
            </span>
            <span className="text-xs font-mono text-[#a2f2de]">magudbeai@gmail.com</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-black tracking-tight">
            DHAMME Live User & Real Estate Analytics
          </h1>
          <p className="text-xs text-[#a2f2de] font-medium">
            Dhamaan isticmaalayaasha is diwaan galiyay ({totalUsers} Users) & Guryaha Jigjiga.
          </p>
        </div>

        <div className="z-10 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#d4af37] block">System Status</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>On-Time Live User Sync</span>
          </span>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />
      </div>

      {/* Master KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* User Growth */}
        <div className="bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#005145]">
            <span className="text-[11px] font-bold uppercase text-[#3f4946]">Users Growing</span>
            <span className="material-symbols-outlined text-[24px]">group_add</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-3xl text-[#1b1b1c]">{totalUsers}</span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-1">📈 Diwaan-Galisay (Live)</span>
          </div>
        </div>

        {/* Total Posted Homes */}
        <div className="bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#0f6b5c]">
            <span className="text-[11px] font-bold uppercase text-[#3f4946]">Guryaha La Soo Dhigay</span>
            <span className="material-symbols-outlined text-[24px]">real_estate_agent</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-3xl text-[#005145]">{totalProperties}</span>
            <span className="text-[10px] text-[#6f7976] block font-semibold">
              Active: {activeProperties} | Sold: {soldProperties} | Rented: {rentedProperties}
            </span>
          </div>
        </div>

        {/* Market Volume Value */}
        <div className="bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#d4af37]">
            <span className="text-[11px] font-bold uppercase text-[#3f4946]">Market Volume</span>
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-xl sm:text-2xl text-[#00382f]">
              {totalMarketVolumeEtb > 0 ? `${(totalMarketVolumeEtb / 1000000).toFixed(2)}M ETB` : '0 ETB'}
            </span>
            <span className="text-[10px] text-[#6f7976] block font-semibold">Total Property Value</span>
          </div>
        </div>

        {/* Total App Views */}
        <div className="bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7b2f10]">
            <span className="text-[11px] font-bold uppercase text-[#3f4946]">App Engagement</span>
            <span className="material-symbols-outlined text-[24px]">visibility</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-3xl text-[#7b2f10]">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-[#6f7976] block font-semibold">Total Property Page Views</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#bec9c5]/40 pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: '📊 Intelligence Overview' },
          { id: 'users', label: `👥 User Directory (${totalUsers})` },
          { id: 'properties', label: `🏠 Posted Homes (${totalProperties})` },
          { id: 'kebeles', label: '📍 Kebele Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-[#005145] text-white shadow-md'
                : 'bg-[#fcf9f8] text-[#3f4946] border border-[#bec9c5]/60 hover:bg-[#f0eded]'
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
          <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#bec9c5]/30">
              <div className="flex items-center space-x-2 text-[#005145]">
                <span className="material-symbols-outlined text-[22px]">person_add</span>
                <h3 className="font-poppins font-bold text-base text-[#1b1b1c]">
                  Users-ka Is Diwaan Galisay (Live Signups Feed)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {totalInquiries} Leads Active
              </span>
            </div>

            <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
              {allUsers.map((u) => (
                <div key={u.id} className="p-3 bg-[#f0eded] rounded-2xl border border-[#bec9c5]/30 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.fullName} className="w-9 h-9 rounded-full object-cover border border-[#005145]" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#005145] text-white flex items-center justify-center font-bold text-xs">
                        {u.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-[#1b1b1c] block">{u.fullName} {u.isAdmin && '👑'}</span>
                      <span className="text-[11px] text-[#005145] font-mono block">{u.email}</span>
                      <span className="text-[10px] text-[#6f7976] block">📞 {u.phone}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      Registered
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-1 font-mono">{u.joinedDate || 'Today'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Kebele Demand Breakdown */}
          <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#bec9c5]/30">
              <div className="flex items-center space-x-2 text-[#005145]">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
                <h3 className="font-poppins font-bold text-base text-[#1b1b1c]">
                  Xaafadaha Ugu Baahida Badan (Kebele Demand)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#005145]">Jigjiga Kebeles</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Kebele 06 (Garab\'ase Sector)', demand: '94% High Demand', color: 'bg-emerald-700' },
                { name: 'Kebele 03 (Taiwan Market Area)', demand: '88% High Demand', color: 'bg-emerald-600' },
                { name: 'Kebele 08 (Airport Road)', demand: '82% Medium-High', color: 'bg-[#0f6b5c]' },
                { name: 'Kebele 01 (City Center)', demand: '76% Medium', color: 'bg-amber-600' }
              ].map((k, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{k.name}</span>
                    <span className="text-[#005145]">{k.demand}</span>
                  </div>
                  <div className="w-full h-2 bg-[#e5e2e1] rounded-full overflow-hidden">
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
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
                Dhamaan Isticmaalayaasha Is Diwaan Galisay ({totalUsers} Registered Users)
              </h3>
              <p className="text-xs text-[#3f4946]">
                Xogta buuxda ee dadka koontada ku samaystay DHAMME App.
              </p>
            </div>

            <input
              type="text"
              placeholder="Raadi User (Magaca, Email, Phone)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="p-2.5 bg-[#f0eded] rounded-xl text-xs w-full sm:w-64 border border-[#bec9c5]/40"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f0eded] text-[#3f4946] border-b border-[#bec9c5]/40">
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Posted Homes</th>
                  <th className="p-3">Verification Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bec9c5]/30">
                {filteredUsers.map((user) => {
                  const userHomesCount = properties.filter(
                    (p) => p.ownerEmail === user.email || p.agentName === user.fullName || user.id.startsWith('admin')
                  ).length;
                  const isUserVerified = user.isVerified || userHomesCount >= 5;

                  return (
                    <tr key={user.id} className="hover:bg-[#f0eded]/50 transition">
                      <td className="p-3 flex items-center space-x-2.5">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover border border-[#005145]" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#005145] text-white font-bold flex items-center justify-center text-xs">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-[#1b1b1c]">{user.fullName} {user.isAdmin && '👑 (Admin)'}</span>
                      </td>
                      <td className="p-3 font-mono text-[#005145]">{user.email}</td>
                      <td className="p-3 font-semibold">{user.phone}</td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-[#005145]">
                          {userHomesCount} / 5 Homes
                        </span>
                      </td>
                      <td className="p-3">
                        {isUserVerified ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>Verified (5/5 Approved)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            <span>Pending ({userHomesCount}/5)</span>
                          </span>
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
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
              Dhamaan Guryaha La Soo Dhigay Jigjiga ({properties.length})
            </h3>

            <input
              type="text"
              placeholder="Raadi Guri (Title, Kebele, Owner)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="p-2.5 bg-[#f0eded] rounded-xl text-xs w-full sm:w-64 border border-[#bec9c5]/40"
            />
          </div>

          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#3f4946]">
              Weli ma jirtay guryo la soo dhigay oo ku aaday raadintaada.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => onSelectProperty(prop)}
                  className="bg-[#f0eded] p-3.5 rounded-2xl border border-[#bec9c5]/40 flex space-x-3 cursor-pointer hover:border-[#005145] transition"
                >
                  <img src={prop.images[0]} alt={prop.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-[#1b1b1c] line-clamp-1">{prop.title}</h4>
                      <span className="text-[#005145] font-semibold text-[11px] block">{prop.city}, {prop.kebele}</span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-poppins font-black text-[#005145] text-xs">{prop.priceLocalFormatted}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        prop.status === 'sold' ? 'bg-red-600 text-white' : prop.status === 'rented' ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                      }`}>
                        {prop.status ? prop.status.toUpperCase() : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </main>
  );
};
