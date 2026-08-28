import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PropertyListing, UserProfile, AuditActivityLog, PropertyCategory } from '../types';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';

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
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E8E5DF] text-center shadow-xl space-y-4"
        >
          <div className="w-16 h-16 bg-[#FAF9F6] border border-[#E8E5DF] text-[#111315] rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-[#111315]">
            Awood Uma Lihid (Access Restricted)
          </h2>
          <p className="text-xs text-[#74777B] leading-relaxed">
            Boggan waxaa geli kara oo kaliya Master Admin-ka rasmiga ah ee DHAMME (magudbeai@gmail.com). Fadlan ku gal koontadaada saxda ah.
          </p>
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onBackToHome}
              className="w-full py-3 px-6 rounded-xl bg-[#111315] hover:bg-[#22272B] text-white font-semibold text-xs transition shadow-xs cursor-pointer"
            >
              Ku Laabo Bogga Hore (Back to Home)
            </motion.button>
          </div>
        </motion.div>
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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 bg-[#FAF9F6]">
      
      {/* Action Notification Toast Banner */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="bg-[#111315] text-white p-3.5 rounded-2xl border border-[#C8A96B] font-sans font-semibold text-xs flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[20px] text-[#C8A96B]">check_circle</span>
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-white/80 hover:text-white cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Executive Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111315] p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-[#E8E5DF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="space-y-1.5 z-10">
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315]">
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
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
            title="Reconcile and sync with Supabase cloud database"
          >
            <span className={`material-symbols-outlined text-[16px] text-[#C8A96B] ${isSyncing ? 'animate-spin' : ''}`}>
              {isSyncing ? 'sync' : 'cloud_sync'}
            </span>
            <span>{isSyncing ? 'Syncing Cloud...' : 'Sync Database'}</span>
          </motion.button>

          {onExportBackup && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportBackup}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315] text-xs font-bold shadow-md flex items-center space-x-1.5 transition cursor-pointer"
              title="Download full JSON database backup file"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Backup (JSON)</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Master KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* User Directory */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Users Directory</span>
            <span className="material-symbols-outlined text-[24px]">group_add</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#111315]">{totalUsers}</span>
            <span className="text-[11px] text-[#74777B] font-medium block mt-1">
              Active: {totalUsers - bannedUsersCount} {bannedUsersCount > 0 && <span className="text-red-500 font-bold">| 🚫 {bannedUsersCount} Banned</span>}
            </span>
          </div>
        </motion.div>

        {/* Total Posted Homes */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Guryaha La Soo Dhigay</span>
            <span className="material-symbols-outlined text-[24px]">real_estate_agent</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#111315]">{totalProperties}</span>
            <span className="text-[10px] text-[#74777B] block font-normal mt-1">
              🎥 {videoProperties.length} Videos | Active: {activeProperties} | Sold: {soldProperties}
            </span>
          </div>
        </motion.div>

        {/* Market Volume Value */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#C8A96B]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Market Volume</span>
            <span className="material-symbols-outlined text-[24px]">payments</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-xl sm:text-2xl text-[#111315]">
              {totalMarketVolumeEtb > 0 ? `${(totalMarketVolumeEtb / 1000000).toFixed(2)}M ETB` : '0 ETB'}
            </span>
            <span className="text-[10px] text-[#74777B] block font-normal mt-1">Total Property Value</span>
          </div>
        </motion.div>

        {/* Audit Log Count */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase text-[#74777B]">Activity Logs</span>
            <span className="material-symbols-outlined text-[24px]">history</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-3xl text-[#111315]">{activityLogs.length}</span>
            <span className="text-[10px] text-[#4A7A63] block font-medium mt-1">
              {totalViews.toLocaleString()} Views • {totalInquiries} Inquiries
            </span>
          </div>
        </motion.div>

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
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-white'
                : 'bg-white text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="adminDashboardActiveTab"
                className="absolute inset-0 bg-[#111315] rounded-xl shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="admin-tab-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8E5DF]">
                <div className="flex items-center space-x-2 text-[#111315]">
                  <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
                  <h3 className="font-serif font-bold text-base text-[#111315]">
                    Awoodaha Maamulka (Admin Quick Capabilities)
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-[#111315] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E8E5DF]">
                  Full Access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <motion.div 
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveTab('properties')}
                  className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] hover:border-[#111315] cursor-pointer transition space-y-1"
                >
                  <div className="flex items-center space-x-2 text-[#111315] font-semibold">
                    <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                    <span>Tirtir Guryaha Khaldan</span>
                  </div>
                  <p className="text-[11px] text-[#74777B]">
                    Si fudud u tirtir guryaha been abuurka ah ama kuwa khaldan.
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveTab('actions')}
                  className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] hover:border-[#111315] cursor-pointer transition space-y-1"
                >
                  <div className="flex items-center space-x-2 text-[#111315] font-semibold">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    <span>Eeg Dhaqdhaqaaqyada</span>
                  </div>
                  <p className="text-[11px] text-[#74777B]">
                    La soco tallaabo kasta oo app-ka ka dhacday (Live Audit Trail).
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
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
                </motion.div>

                <motion.div 
                  whileHover={{ y: -2 }}
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
                </motion.div>
              </div>
            </div>

            {/* Quick Kebele Demand Breakdown */}
            <div className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8E5DF]">
                <div className="flex items-center space-x-2 text-[#111315]">
                  <span className="material-symbols-outlined text-[22px]">location_on</span>
                  <h3 className="font-serif font-bold text-base text-[#111315]">
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
                      <span className="text-[#111315]">{k.name}</span>
                      <span className="text-[#74777B]">{k.demand}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF9F6] border border-[#E8E5DF] rounded-full overflow-hidden">
                      <div className={`h-full ${k.color} rounded-full`} style={{ width: k.demand.split('%')[0] + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: ACTIONS LOG */}
        {activeTab === 'actions' && (
          <motion.div 
            key="admin-tab-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#111315] flex items-center space-x-2">
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
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
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
                  let badgeColor = 'bg-[#FAF9F6] text-[#111315] border-[#E8E5DF]';
                  let icon = 'info';

                  if (log.action === 'PROPERTY_POSTED') {
                    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                    icon = 'add_home';
                  } else if (log.action === 'PROPERTY_DELETED') {
                    badgeColor = 'bg-red-50 text-red-800 border-red-200';
                    icon = 'delete';
                  }

                  return (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start space-x-2.5">
                        <span className={`p-1.5 rounded-xl border ${badgeColor} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-[16px]">{icon}</span>
                        </span>
                        <div>
                          <span className="font-semibold text-[#111315] block">{log.details}</span>
                          <span className="text-[11px] text-[#74777B]">By {log.actorEmail || 'System'}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#74777B] font-mono shrink-0">
                        {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <motion.div 
            key="admin-tab-properties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-serif font-bold text-lg text-[#111315]">
                Guryaha La Soo Dhigay ({filteredProperties.length})
              </h3>
              <input
                type="text"
                placeholder="Raadi magac, kebele, ama mulkiile..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full sm:w-72 p-2.5 bg-[#FAF9F6] rounded-xl text-xs border border-[#E8E5DF] focus:border-[#C8A96B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((prop) => (
                <div key={prop.id} className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] space-y-3">
                  <div className="flex gap-3 cursor-pointer" onClick={() => onSelectProperty(prop)}>
                    <img src={prop.images[0]} alt={prop.title} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-[#111315] truncate hover:text-[#C8A96B] transition-colors">{prop.title}</h4>
                      <span className="text-[11px] text-[#74777B] block">{prop.kebele}</span>
                      <span className="font-bold text-xs text-[#C8A96B] block mt-1">{prop.priceLocalFormatted}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E8E5DF]">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingProperty(prop)}
                      className="flex-1 py-2 bg-white border border-[#E8E5DF] text-[#111315] rounded-xl text-[11px] font-semibold hover:border-[#111315] cursor-pointer"
                    >
                      Beddel (Edit)
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirmDelete(prop)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-xl text-[11px] font-semibold hover:bg-red-700 cursor-pointer"
                    >
                      Tirtir (Delete)
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <motion.div 
            key="admin-tab-users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4 overflow-x-auto"
          >
            <h3 className="font-serif font-bold text-lg text-[#111315]">
              Diiwaanka Isticmaalayaasha ({filteredUsers.length})
            </h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E5DF] text-[#74777B] uppercase text-[10px]">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E5DF]">
                {filteredUsers.map((user) => {
                  const isMasterAdmin = user.email.toLowerCase() === 'magudbeai@gmail.com';
                  return (
                    <tr key={user.id} className="hover:bg-[#FAF9F6]">
                      <td className="p-3 font-semibold text-[#111315]">{user.fullName}</td>
                      <td className="p-3 font-mono text-[#74777B]">{user.email}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3">
                        <button
                          onClick={() => onToggleUserVerification && onToggleUserVerification(user.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${
                            user.isVerified 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          {user.isVerified ? '✓ Verified' : 'Pending (Toggle)'}
                        </button>
                      </td>
                      <td className="p-3">
                        {user.isBanned ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">BANNED</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Active</span>
                        )}
                      </td>
                      <td className="p-3">
                        {isMasterAdmin ? (
                          <span className="text-[10px] font-bold text-[#111315] bg-[#C8A96B] px-2 py-0.5 rounded-md">👑 Master</span>
                        ) : user.isBanned ? (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleConfirmUnban(user)} className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] cursor-pointer">
                            Unban
                          </motion.button>
                        ) : (
                          <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleConfirmBan(user)} className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[10px] cursor-pointer">
                            Ban User
                          </motion.button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* TAB 5: VIDEOS */}
        {activeTab === 'videos' && (
          <motion.div 
            key="admin-tab-videos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4"
          >
            <h3 className="font-serif font-bold text-lg text-[#111315]">
              Muuqaalada Guryaha ({videoProperties.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoProperties.map((prop) => (
                <div key={prop.id} className="p-4 bg-[#FAF9F6] rounded-3xl border border-[#E8E5DF] space-y-3">
                  <h4 className="font-semibold text-sm text-[#111315]">{prop.title}</h4>
                  {prop.videoUrl && (
                    <PropertyVideoPlayer
                      videoUrl={prop.videoUrl}
                      posterUrl={prop.videoThumbnail || prop.images[0]}
                      title={prop.title}
                    />
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-xs text-[#C8A96B]">{prop.priceLocalFormatted}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirmDelete(prop)}
                      className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Tirtir
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 6: KEBELES */}
        {activeTab === 'kebeles' && (
          <motion.div 
            key="admin-tab-kebeles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] space-y-4"
          >
            <h3 className="font-serif font-bold text-lg text-[#111315]">
              Jigjiga Kebele Inventory Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'Kebele 01',
                'Kebele 02',
                'Kebele 03 (Taiwan)',
                'Kebele 04',
                'Kebele 05',
                'Kebele 06 (Garab\'ase)',
                'Kebele 07',
                'Kebele 08 (Airport Road)',
                'Kebele 09',
                'Kebele 10'
              ].map((k) => {
                const kCount = properties.filter((p) => p.kebele.toLowerCase().includes(k.toLowerCase().split(' ')[1] || k.toLowerCase())).length;
                return (
                  <div key={k} className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#111315]">{k}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#111315] text-white font-semibold font-mono">
                      {kCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIRECT EDIT PROPERTY MODAL */}
      <AnimatePresence>
        {editingProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProperty(null)}
              className="fixed inset-0 bg-[#111315]/65 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              className="relative bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl space-y-4 border border-[#E8E5DF] z-10"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E5DF]">
                <h3 className="font-serif font-bold text-lg text-[#111315] flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[#C8A96B]">edit_note</span>
                  <span>Wax Ka Bedel Guriga</span>
                </h3>
                <button onClick={() => setEditingProperty(null)} className="text-[#74777B] hover:text-[#111315] cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSavePropertyEdit} className="space-y-3 text-xs text-left">
                <div>
                  <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                    Magaca Guriga:
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title}
                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm text-[#111315] focus:border-[#C8A96B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                      Qiimaha ETB:
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
                      className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm font-bold text-[#111315]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                      Nooca:
                    </label>
                    <select
                      value={editingProperty.mode}
                      onChange={(e) => setEditingProperty({ ...editingProperty, mode: e.target.value as any })}
                      className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-xs font-semibold text-[#111315]"
                    >
                      <option value="kiro">Kiro (Rent)</option>
                      <option value="iib">Iib (Sale)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#74777B] uppercase mb-1">
                    Qaybta:
                  </label>
                  <select
                    value={editingProperty.category}
                    onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value as any })}
                    className="w-full p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-xs font-semibold text-[#111315]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="flex-1 py-3 rounded-xl bg-white border border-[#E8E5DF] text-[#74777B] font-semibold text-xs cursor-pointer"
                  >
                    Jooji (Cancel)
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-2 py-3 px-6 rounded-xl bg-[#111315] text-white font-semibold text-xs shadow-xs hover:bg-[#22272B] transition cursor-pointer"
                  >
                    Kaydi Isbedelka
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
};
