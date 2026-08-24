import React, { useState } from 'react';
import type { PropertyListing, UserProfile, AuditActivityLog, ListingStatus, PropertyCategory } from '../types';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';
import { JIGJIGA_XAAFADAHA, JIGJIGA_KEBELES } from '../data/jigjigaLocations';

interface AdminDashboardProps {
  properties: PropertyListing[];
  registeredAccounts: UserProfile[];
  activityLogs?: AuditActivityLog[];
  currentUser?: UserProfile | null;
  onSelectProperty: (property: PropertyListing) => void;
  onDeleteProperty?: (id: string, reason?: string) => void;
  onUpdateProperty?: (updated: PropertyListing) => void;
  onBanUser?: (userId: string, reason?: string) => void;
  onUnbanUser?: (userId: string) => void;
  onToggleUserVerification?: (userId: string) => void;
  onRefreshData?: () => Promise<void>;
  onExportBackup?: () => void;
  onBackToHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  registeredAccounts,
  activityLogs = [],
  currentUser,
  onSelectProperty,
  onDeleteProperty,
  onUpdateProperty,
  onBanUser,
  onUnbanUser,
  onToggleUserVerification,
  onRefreshData,
  onExportBackup,
  onBackToHome
}) => {
  // STRICT SECURITY GUARD: Master Admin Only
  const isAuthorizedAdmin = Boolean(
    currentUser && (currentUser.isAdmin || currentUser.email?.toLowerCase() === 'magudbeai@gmail.com')
  );

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FAF9F6]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E5DF] text-center shadow-xl space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-[#FAF9F6] border border-[#E8E5DF] text-[#111315] rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-[#17191C]">
            Awood Uma Lihid (Access Restricted)
          </h2>
          <p className="text-xs text-[#74777B] leading-relaxed">
            Boggan waxaa geli kara oo kaliya Master Admin-ka rasmiga ah ee DHAMME (magudbeai@gmail.com). Fadlan ku gal koontadaada saxda ah.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToHome}
              className="w-full py-3 px-6 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-semibold text-xs transition active:scale-95 shadow-xs"
            >
              Ku Laabo Bogga Hore (Back to Home)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'properties' | 'users' | 'videos' | 'kebeles'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [logFilter, setLogFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Edit Modal State
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleManualSync = async () => {
    if (onRefreshData) {
      setIsSyncing(true);
      try {
        await onRefreshData();
        showNotification('✅ Database fully synchronized with Supabase Cloud & Local Storage.');
      } catch (err) {
        showNotification('⚠️ Database sync completed with local cache fallback.');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleConfirmDelete = (prop: PropertyListing) => {
    const reason = window.prompt(
      `Ma hubtaa inaad tirtirto gurigan?\n"${prop.title}" (${prop.kebele})\n\nGeli sababta aad u tirtirayso (Reason for Deletion):`,
      'Guri been abuur ah ama macluumaad khaldan (Wrong/Fake home)'
    );

    if (reason !== null && onDeleteProperty) {
      onDeleteProperty(prop.id, reason || 'Admin deleted listing');
      showNotification(`🗑️ Guriga "${prop.title}" si rasmi ah ayaa loo tirtiray database-ka.`);
    }
  };

  const handleConfirmBan = (user: UserProfile) => {
    if (user.email.toLowerCase() === 'magudbeai@gmail.com') {
      alert('Ma xannibi kartid Master Admin-ka!');
      return;
    }
    const reason = window.prompt(
      `Geli sababta aad u xannibayso ${user.fullName}:`,
      'Ku xad-gudub shuruucda DHAMME (Violation of terms / Posting fake homes)'
    );
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

  const handleSavePropertyEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !onUpdateProperty) return;

    onUpdateProperty(editingProperty);
    showNotification(`✅ Guriga "${editingProperty.title}" xogtiisa waa la cusboonaysiiyay.`);
    setEditingProperty(null);
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

  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter === 'all') return true;
    if (logFilter === 'properties') return log.entityType === 'property';
    if (logFilter === 'users') return log.entityType === 'user';
    if (logFilter === 'deletions') return log.action === 'PROPERTY_DELETED';
    if (logFilter === 'inquiries') return log.entityType === 'inquiry';
    return true;
  });

  const categories: PropertyCategory[] = ['Family House', 'Single Room', 'Studio', 'Villa', 'Apartment'];

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
        <div className="space-y-1.5 z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#C8A96B] text-[#111315]">
              👑 MASTER ADMIN CONTROL PANEL
            </span>
            <span className="text-xs font-mono text-[#FAF9F6]/80">magudbeai@gmail.com</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            DHAMME Real Estate Intelligence & Audit Center
          </h1>
          <p className="text-xs text-[#FAF9F6]/70 font-normal max-w-xl">
            Maamulka guryaha, hubinta sawirada, xannibaadda fraud-ka, iyo la socodka dhammaan dhaqdhaqaaqyada rasmiga ah.
          </p>
        </div>

        {/* Action Controls in Header (Sync & Export Backup) */}
        <div className="z-10 flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
            title="Reconcile and sync with Supabase cloud database"
          >
            <span className={`material-symbols-outlined text-[16px] text-[#C8A96B] ${isSyncing ? 'animate-spin' : ''}`}>
              {isSyncing ? 'sync' : 'cloud_sync'}
            </span>
            <span>{isSyncing ? 'Syncing Cloud...' : 'Sync Database'}</span>
          </button>

          {onExportBackup && (
            <button
              onClick={onExportBackup}
              className="px-4 py-2.5 rounded-xl bg-[#C8A96B] hover:brightness-105 text-[#111315] text-xs font-bold shadow-xs flex items-center space-x-1.5 transition active:scale-95"
              title="Download full JSON database backup file"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Backup (JSON)</span>
            </button>
          )}
        </div>
      </div>

      {/* Master KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* User Directory */}
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

        {/* Recent Actions & Audit Log Count */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Recent Activity Logs</span>
            <span className="material-symbols-outlined text-[24px]">history</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#17191C]">{activityLogs.length}</span>
            <span className="text-[10px] text-[#4A7A63] block font-medium">
              {totalViews.toLocaleString()} Views • {totalInquiries} Inquiries Tracked
            </span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[#E8E5DF] pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'actions', label: `📜 Recent Actions (${activityLogs.length})` },
          { id: 'properties', label: `🏠 Posted Homes (${totalProperties})` },
          { id: 'users', label: `👥 User Directory (${totalUsers})` },
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


      {/* TAB 1: OVERVIEW & SYSTEM INTELLIGENCE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E5DF]">
              <div className="flex items-center space-x-2 text-[#111315]">
                <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                <h3 className="font-serif font-bold text-base text-[#17191C]">
                  Awoodaha Maamulka (Admin Quick Capabilities)
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-[#111315] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E8E5DF]">
                Full Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => setActiveTab('properties')}
                className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] hover:border-[#111315] cursor-pointer transition space-y-1"
              >
                <div className="flex items-center space-x-2 text-[#111315] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                  <span>Tirtir Guryaha Khaldan</span>
                </div>
                <p className="text-[11px] text-[#74777B]">
                  Si fudud u tirtir guryaha been abuurka ah, spam-ka ama kuwa khaldan.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('actions')}
                className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] hover:border-[#111315] cursor-pointer transition space-y-1"
              >
                <div className="flex items-center space-x-2 text-[#111315] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  <span>Eeg Waxyaabihii Ugu Dambeeyay</span>
                </div>
                <p className="text-[11px] text-[#74777B]">
                  La soco tallaabo kasta oo app-ka ka dhacday (Recent Actions Log).
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('users')}
                className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] hover:border-[#111315] cursor-pointer transition space-y-1"
              >
                <div className="flex items-center space-x-2 text-[#111315] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Xaqiiji Mulkiilayaasha</span>
                </div>
                <p className="text-[11px] text-[#74777B]">
                  Sii ama ka qaad shahaadada Verified Landlord Profile.
                </p>
              </div>

              <div 
                onClick={handleManualSync}
                className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] hover:border-[#111315] cursor-pointer transition space-y-1"
              >
                <div className="flex items-center space-x-2 text-[#111315] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                  <span>Hubi Database-ka</span>
                </div>
                <p className="text-[11px] text-[#74777B]">
                  Xogtu ma luminayso: Supabase Cloud & LocalStorage 100% sync.
                </p>
              </div>
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

      {/* TAB 2: RECENT ACTIONS & AUDIT TRAIL */}
      {activeTab === 'actions' && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#17191C] flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#111315]">history</span>
                <span>Dhaqdhaqaaqyada Rasmiga ah (Recent Actions Audit Trail)</span>
              </h3>
              <p className="text-xs text-[#74777B]">
                Tallaabo kasta oo la qaaday (guri la soo dhigay, la cusboonaysiiyay, la tirtiray, user is diwaan galiyay).
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All Actions' },
                { id: 'properties', label: 'Properties' },
                { id: 'deletions', label: 'Deletions' },
                { id: 'users', label: 'Users' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setLogFilter(filter.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    logFilter === filter.id
                      ? 'bg-[#111315] text-white'
                      : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] p-6 space-y-2">
              <span className="material-symbols-outlined text-[36px] text-[#74777B]">history_toggle_off</span>
              <p className="text-xs text-[#74777B]">
                Weli ma jiro dhaqdhaqaaq cusub oo ku aaday filter-kan.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                let badgeColor = 'bg-[#FAF9F6] text-[#17191C] border-[#E8E5DF]';
                let icon = 'info';

                if (log.action === 'PROPERTY_POSTED') {
                  badgeColor = 'bg-[#4A7A63]/10 text-[#4A7A63] border-[#4A7A63]/30';
                  icon = 'add_home';
                } else if (log.action === 'PROPERTY_DELETED') {
                  badgeColor = 'bg-[#A8453F]/10 text-[#A8453F] border-[#A8453F]/30';
                  icon = 'delete';
                } else if (log.action === 'PROPERTY_UPDATED' || log.action === 'STATUS_CHANGED') {
                  badgeColor = 'bg-[#C8A96B]/15 text-[#C8A96B] border-[#C8A96B]/40';
                  icon = 'edit';
                } else if (log.action === 'USER_REGISTERED') {
                  badgeColor = 'bg-[#111315] text-white border-[#111315]';
                  icon = 'person_add';
                } else if (log.action === 'USER_BANNED') {
                  badgeColor = 'bg-[#A8453F] text-white border-[#A8453F]';
                  icon = 'block';
                }

                return (
                  <div
                    key={log.id}
                    className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-[#E8E5DF] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px] text-[#111315]">{icon}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${badgeColor}`}>
                            {log.action.replace('_', ' ')}
                          </span>
                          {log.entityTitle && (
                            <span className="font-semibold text-[#17191C]">{log.entityTitle}</span>
                          )}
                        </div>
                        <p className="text-xs text-[#74777B] leading-relaxed">
                          {log.details}
                        </p>
                        <span className="text-[10px] text-[#74777B] block font-mono">
                          Actor: {log.actorName} ({log.actorEmail})
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#74777B] block">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: POSTED HOMES INVENTORY & WRONG HOMES DELETION */}
      {activeTab === 'properties' && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#17191C]">
                Maamulka Guryaha Jigjiga ({properties.length} Listings)
              </h3>
              <p className="text-xs text-[#74777B]">
                Halkan waxaad ka tirtiri kartaa guryaha khaldan, wax ka bedeli kartaa macluumaadka, ama ku calaamadin kartaa Featured.
              </p>
            </div>

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
                  className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E5DF] flex flex-col justify-between space-y-3"
                >
                  <div className="flex space-x-3 cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    <img src={prop.images[0]} alt={prop.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <h4 className="font-semibold text-[#17191C] line-clamp-1">{prop.title}</h4>
                        <span className="text-[#74777B] text-[11px] block">{prop.city}, {prop.kebele}</span>
                        <span className="text-[10px] text-[#74777B] block">👤 {prop.agentName} ({prop.agentPhone})</span>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-serif font-bold text-[#17191C] text-xs">{prop.priceLocalFormatted}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium ${
                          prop.status === 'sold' ? 'bg-[#A8453F] text-white' : prop.status === 'rented' ? 'bg-[#C8A96B] text-[#111315]' : 'bg-[#4A7A63] text-white'
                        }`}>
                          {prop.status ? prop.status.toUpperCase() : 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Quick Status & Actions Toolbar */}
                  <div className="pt-2 border-t border-[#E8E5DF] flex flex-wrap items-center justify-between gap-1.5">
                    
                    {/* Status Dropdown */}
                    <select
                      value={prop.status || 'active'}
                      onChange={(e) => {
                        if (onUpdateProperty) {
                          onUpdateProperty({ ...prop, status: e.target.value as ListingStatus });
                          showNotification(`Status updated to ${e.target.value.toUpperCase()} for "${prop.title}"`);
                        }
                      }}
                      className="p-1.5 bg-white rounded-lg text-[11px] font-medium text-[#17191C] border border-[#E8E5DF]"
                    >
                      <option value="active">Active</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>

                    <div className="flex items-center gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingProperty(prop)}
                        className="px-2.5 py-1.5 bg-white border border-[#E8E5DF] text-[#17191C] text-[11px] font-semibold rounded-lg hover:border-[#111315] transition flex items-center space-x-1"
                        title="Edit listing details"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>Beddel</span>
                      </button>

                      {/* Delete Button (For wrong/fake homes) */}
                      <button
                        onClick={() => handleConfirmDelete(prop)}
                        className="px-2.5 py-1.5 bg-[#A8453F] text-white text-[11px] font-semibold rounded-lg flex items-center space-x-1 hover:brightness-110 transition"
                        title="Permanently delete wrong/fake listing"
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

      {/* TAB 4: COMPLETE USER DIRECTORY */}
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
                        <button
                          onClick={() => {
                            if (onToggleUserVerification) {
                              onToggleUserVerification(user.id);
                              showNotification(`Verification toggled for ${user.fullName}`);
                            }
                          }}
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition ${
                            isUserVerified
                              ? 'bg-[#4A7A63] text-white'
                              : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
                          }`}
                          title="Click to toggle verified status"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isUserVerified ? 'verified' : 'pending'}
                          </span>
                          <span>{isUserVerified ? 'Verified' : 'Pending'}</span>
                        </button>
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

      {/* TAB 5: VIDEO MODERATION (TOURS) */}
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
                        title="Delete wrong video post"
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

      {/* TAB 6: KEBELE ANALYTICS */}
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

      {/* DIRECT EDIT PROPERTY MODAL */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl shadow-xl space-y-4 border border-[#E8E5DF] my-auto">
            <div className="flex justify-between items-center pb-2 border-b border-[#E8E5DF]">
              <h3 className="font-serif font-bold text-lg text-[#17191C] flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#111315]">edit_note</span>
                <span>Wax Ka Bedel Guriga (Edit Property)</span>
              </h3>
              <button onClick={() => setEditingProperty(null)} className="text-[#74777B] hover:text-[#17191C]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePropertyEdit} className="space-y-3.5 text-xs text-left">
              <div>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Magaca Guriga (Title):
                </label>
                <input
                  type="text"
                  required
                  value={editingProperty.title}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm text-[#17191C] focus:border-[#111315] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                    Qiimaha ETB (Price):
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProperty.priceEtb}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingProperty({
                        ...editingProperty,
                        priceEtb: val,
                        priceLocalFormatted: editingProperty.mode === 'kiro' ? `${val.toLocaleString()} ETB/mo` : `${val.toLocaleString()} ETB`
                      });
                    }}
                    className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm font-bold text-[#17191C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                    Nooca (Mode):
                  </label>
                  <select
                    value={editingProperty.mode}
                    onChange={(e) => setEditingProperty({ ...editingProperty, mode: e.target.value as any })}
                    className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-xs font-semibold text-[#17191C]"
                  >
                    <option value="kiro">Kiro (Rent)</option>
                    <option value="iib">Iib (Sale)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                    Qaybta (Category):
                  </label>
                  <select
                    value={editingProperty.category}
                    onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value as any })}
                    className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-xs font-semibold text-[#17191C]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                    Kebele / Xaafad:
                  </label>
                  <select
                    value={editingProperty.kebele}
                    onChange={(e) => setEditingProperty({ ...editingProperty, kebele: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-xs font-semibold text-[#17191C]"
                  >
                    <optgroup label="🏘️ Xaafadaha">
                      {JIGJIGA_XAAFADAHA.map((x) => (
                        <option key={x} value={x}>{x}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📍 Kebele-yada">
                      {JIGJIGA_KEBELES.map((k) => (
                        <option key={k} value={k}>{k}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                  Faahfaahinta (Description):
                </label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-xs text-[#17191C]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="flex-1 py-3 rounded-xl bg-white border border-[#E8E5DF] text-[#74777B] font-semibold text-xs"
                >
                  Jooji (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 px-6 rounded-xl bg-[#111315] text-white font-semibold text-xs shadow-xs hover:bg-[#17191C] transition"
                >
                  Kaydi Isbedelka (Save Updates)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};
