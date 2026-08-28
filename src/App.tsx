import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { ScreenName, PropertyListing, FilterState, UserProfile, ListingStatus, AuditActivityLog } from './types';
import { INITIAL_REGISTERED_ACCOUNTS } from './data/usersData';
import type { RegisteredAccount } from './data/usersData';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { HomeFeed } from './components/HomeFeed';
import { ListingDetails } from './components/ListingDetails';
import { FilterModal } from './components/FilterModal';
import { PostListingWizard } from './components/PostListingWizard';
import { Favorites } from './components/Favorites';
import { MyListings } from './components/MyListings';
import { Profile } from './components/Profile';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/Auth/AuthModal';
import { AuthPage } from './components/Auth/AuthPage';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { DhammeRealEstateAIModal } from './components/DhammeRealEstateAIModal';
import { useInactivityLogout } from './hooks/useInactivityLogout';
import { supabase } from './services/supabaseClient';
import { registerServiceWorker, triggerWebPushNotification } from './utils/pushNotifications';
import { logActivity, fetchAllActivityLogs, downloadFullDatabaseBackup, getLocalActivityLogs } from './services/activityLogger';

const BACKUP_STORAGE_KEYS = [
  'dhamme_user_posted_properties_v1',
  'dhamme_properties_archive_v2',
  'dhamme_all_listings_v3',
  'dhamme_permanent_backup'
];

export function App() {
  // Register Web Push Service Worker on startup
  useEffect(() => {
    registerServiceWorker();
  }, []);

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    const path = window.location.pathname.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    const screenParam = search.get('screen');

    // Read stored user from localStorage for secure pre-hydration checks
    let storedUser: UserProfile | null = null;
    try {
      const saved = localStorage.getItem('dhamme_active_user');
      if (saved) {
        storedUser = JSON.parse(saved);
      }
    } catch (e) {}

    const isMasterAdmin = Boolean(
      storedUser && (storedUser.isAdmin || storedUser.email?.toLowerCase() === 'magudbeai@gmail.com')
    );

    if (path.includes('login') || screenParam === 'login') return 'login';
    if (path.includes('signup') || screenParam === 'signup') return 'signup';
    if (path.includes('privacy') || screenParam === 'privacy') return 'privacy';
    if (path.includes('terms') || screenParam === 'terms') return 'terms';
    if (path.includes('profile') || screenParam === 'profile') return 'profile';

    // 🔒 STRICT SECURITY: Never expose admin dashboard to unauthenticated or non-admin visitors
    if (path.includes('admin') || screenParam === 'admin') {
      if (isMasterAdmin) return 'admin_dashboard';
      try { window.history.replaceState({}, '', '/login'); } catch (e) {}
      return 'login';
    }

    // 🔒 STRICT SECURITY: Guard landlord posting and listings
    if (path.includes('post') || screenParam?.startsWith('post') || path.includes('my_listings') || screenParam === 'my_listings') {
      if (storedUser) return 'my_listings';
      try { window.history.replaceState({}, '', '/login'); } catch (e) {}
      return 'login';
    }

    return 'splash';
  });

  // Real Properties inventory (filter out any legacy mock placeholder IDs)
  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    const fakePropertyIds = [
      'jigjiga-villa-garabase-01',
      'jigjiga-house-taiwan-02',
      'jigjiga-sale-villa-airport-03',
      'jigjiga-studio-univ-04',
      'jigjiga-house-citycenter-05',
      'jigjiga-sale-plot-garabase-06'
    ];
    let loaded: PropertyListing[] = [];
    BACKUP_STORAGE_KEYS.forEach((key) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: PropertyListing) => {
              if (
                item &&
                item.id &&
                !fakePropertyIds.includes(item.id) &&
                !loaded.some((existing) => existing.id === item.id)
              ) {
                loaded.push(item);
              }
            });
          }
        } catch (e) {
          console.error(`Error loading properties from ${key}:`, e);
        }
      }
    });

    return loaded;
  });

  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activityLogs, setActivityLogs] = useState<AuditActivityLog[]>(() => getLocalActivityLogs());

  // Registered accounts (purges any legacy fake placeholder test accounts)
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const fakeEmails = [
      'cabdiqaadir.xasan@dhamme.app',
      'fartuun.axmed@dhamme.app',
      'khadar.jaamac@dhamme.app',
      'nimco.cumar@dhamme.app',
      'mustafe.cali@gmail.com',
      'hamda.xassan@gmail.com'
    ];
    const savedV1 = localStorage.getItem('dhamme_registered_accounts');
    const savedV2 = localStorage.getItem('dhamme_accounts_backup');
    let loadedAccounts: RegisteredAccount[] = [];

    [savedV1, savedV2].forEach((s) => {
      if (s) {
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) {
            parsed.forEach((acc: RegisteredAccount) => {
              if (
                acc &&
                acc.email &&
                !fakeEmails.includes(acc.email) &&
                !acc.email.endsWith('@dhamme.app') &&
                !loadedAccounts.some((existing) => existing.email === acc.email)
              ) {
                loadedAccounts.push(acc);
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    const merged = [...loadedAccounts];
    INITIAL_REGISTERED_ACCOUNTS.forEach((initialAcc) => {
      if (!merged.some((acc) => acc.email === initialAcc.email)) {
        merged.push(initialAcc);
      }
    });
    return merged;
  });

  // Current logged in profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dhamme_active_user');
    return saved ? JSON.parse(saved) : null;
  });


  // Sync Supabase Google OAuth callback from URL hash
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        if (accessToken) {
          fetch('https://lbmsdvnqtabwwspeobch.supabase.co/auth/v1/user', {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'apikey': 'sb_publishable_tT5p5zHePZae6Ek7COXSyw_AB9KpZRv'
            }
          })
            .then((res) => res.json())
            .then((userData) => {
              if (userData && userData.email) {
                const email = userData.email;
                const fullName = userData.user_metadata?.full_name || userData.user_metadata?.name || email.split('@')[0];
                const avatarUrl = userData.user_metadata?.avatar_url || userData.user_metadata?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                const updatedProfile: UserProfile = {
                  id: userData.id || `user-supa-${Date.now()}`,
                  fullName,
                  email,
                  phone: userData.user_metadata?.phone || '',
                  avatarUrl,
                  bio: 'DHAMME Verified User (Supabase Google Auth)',
                  joinedDate: new Date().toISOString().split('T')[0],
                  isAdmin: email === 'magudbeai@gmail.com',
                  isVerified: true
                };
                setUserProfile(updatedProfile);
                setCurrentScreen('home');
                try { window.history.replaceState({}, document.title, window.location.pathname); } catch (e) {}
              }
            })
            .catch((e) => console.warn('Supabase OAuth notice:', e));
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authScreen] = useState<'login' | 'signup' | 'forgot_password'>('signup');
  const [showAIModal, setShowAIModal] = useState(false);

  const [activeFilter, setActiveFilter] = useState<FilterState>({
    mode: 'kiro',
    searchLocation: 'Jigjiga',
    category: 'All Properties',
    minPriceEtb: 0,
    maxPriceEtb: 500000,
    kebele: '',
    beds: 'any',
    waterRequired: false,
    powerRequired: false
  });

  // Save user-posted properties state across ALL local storage backup keys for indestructible persistence
  useEffect(() => {
    try {
      const json = JSON.stringify(properties);
      BACKUP_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, json));
    } catch (e) {
      console.error('Failed to backup properties to local storage:', e);
    }
  }, [properties]);

  // Full Database Sync Handler (Reconciles Supabase Cloud + LocalStorage for all users)
  const syncDatabaseFull = useCallback(async () => {
    try {
      // 1. Fetch Cloud Properties (Ordered latest first)
      const { data: propData, error: propError } = await supabase.from('properties').select('*');
      if (propData && !propError && Array.isArray(propData) && propData.length > 0) {
        setProperties((prev) => {
          const fakePropertyIds = [
            'jigjiga-villa-garabase-01',
            'jigjiga-house-taiwan-02',
            'jigjiga-sale-villa-airport-03',
            'jigjiga-studio-univ-04',
            'jigjiga-house-citycenter-05',
            'jigjiga-sale-plot-garabase-06'
          ];
          const cloudProps: PropertyListing[] = propData
            .filter((dbProp: any) => dbProp && dbProp.id && !fakePropertyIds.includes(dbProp.id))
            .map((dbProp: any) => ({
              id: dbProp.id || `prop-db-${Date.now()}`,
              title: dbProp.title || 'Guri Jigjiga',
              priceEtb: Number(dbProp.price_etb) || 0,
              priceLocalFormatted: `${Number(dbProp.price_etb || 0).toLocaleString()} ETB`,
              mode: dbProp.mode || 'kiro',
              category: dbProp.category || 'Family House',
              city: dbProp.city || 'Jigjiga',
              kebele: dbProp.kebele || 'Kebele 06',
              beds: Number(dbProp.beds) || 3,
              baths: Number(dbProp.baths) || 2,
              areaSqm: Number(dbProp.area_sqm) || 180,
              water: dbProp.water ?? 'Yes',
              electricity: dbProp.electricity ?? '24h',
              pool: dbProp.pool ?? 'No',
              isFeatured: dbProp.is_featured ?? true,
              images: Array.isArray(dbProp.images) && dbProp.images.length > 0 ? dbProp.images : ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'],
              videoUrl: dbProp.video_url || undefined,
              videoThumbnail: dbProp.video_thumbnail || undefined,
              videoDuration: dbProp.video_duration ? Number(dbProp.video_duration) : undefined,
              videoStatus: dbProp.video_status || (dbProp.video_url ? 'ready' : undefined),
              description: dbProp.description || '',
              agentName: dbProp.agent_name || 'Landlord',
              agentPhone: dbProp.agent_phone || '+251 91 000 0000',
              agentAvatar: dbProp.agent_avatar || '',
              ownerEmail: dbProp.owner_email || undefined,
              postedDate: dbProp.created_at ? new Date(dbProp.created_at).toISOString().split('T')[0] : '2026-08-01',
              gpsCoords: dbProp.gps_coords || undefined,
              nearDistance: dbProp.near_distance || undefined,
              lat: dbProp.lat ? Number(dbProp.lat) : undefined,
              lng: dbProp.lng ? Number(dbProp.lng) : undefined,
              status: dbProp.status || 'active',
              viewsCount: dbProp.views_count ? Number(dbProp.views_count) : 1,
              inquiriesCount: dbProp.inquiries_count ? Number(dbProp.inquiries_count) : 0
            }));

          // Merge cloud properties with any local-only drafts
          const mergedMap = new Map<string, PropertyListing>();
          cloudProps.forEach((p) => mergedMap.set(p.id, p));
          prev.forEach((p) => {
            if (!fakePropertyIds.includes(p.id) && !mergedMap.has(p.id)) {
              mergedMap.set(p.id, p);
            }
          });

          return Array.from(mergedMap.values());
        });
      }

      // 2. Fetch Cloud Activity Logs
      const loadedLogs = await fetchAllActivityLogs();
      if (loadedLogs.length > 0) {
        setActivityLogs(loadedLogs);
      }
    } catch (err) {
      console.warn('Supabase properties sync notice:', err);
    }
  }, []);

  // Real-Time Live Feed Sync: WebSockets + 4s Instant Polling + Focus Refetch
  useEffect(() => {
    // 1. Initial Sync on load
    syncDatabaseFull();

    // 2. Fast 4-second live poll for instantaneous updates worldwide
    const liveInterval = setInterval(() => {
      syncDatabaseFull();
    }, 4000);

    // 3. Cross-tab & Multi-window instant BroadcastChannel sync
    let broadcast: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      broadcast = new BroadcastChannel('dhamme_live_feed');
      broadcast.onmessage = (msg) => {
        if (msg.data === 'NEW_PROPERTY_POSTED' || msg.data === 'PROPERTY_UPDATED') {
          syncDatabaseFull();
        }
      };
    }

    // 4. Refetch on Window Focus & Tab Visibility
    const handleFocus = () => syncDatabaseFull();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncDatabaseFull();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(liveInterval);
      if (broadcast) {
        broadcast.close();
      }
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncDatabaseFull]);


  // Save registered accounts to LocalStorage & Supabase
  useEffect(() => {
    try {
      const json = JSON.stringify(registeredAccounts);
      localStorage.setItem('dhamme_registered_accounts', json);
      localStorage.setItem('dhamme_accounts_backup', json);
    } catch (e) {
      console.error(e);
    }
  }, [registeredAccounts]);

  // Save active logged-in user to LocalStorage & Sync with Supabase Database
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('dhamme_active_user', JSON.stringify(userProfile));
      
      // Async sync user profile to Supabase user_profiles table
      supabase.from('user_profiles').upsert([{
        id: userProfile.id,
        full_name: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phone || '',
        avatar_url: userProfile.avatarUrl || '',
        bio: userProfile.bio || 'DHAMME User',
        role: userProfile.isAdmin ? 'admin' : 'user',
        is_verified: userProfile.isVerified
      }], 'id');

      // Fetch user's saved favorites from Supabase
      supabase.from('favorites').select('*')
        .then(({ data }) => {
          if (data && Array.isArray(data)) {
            const userFavs = data
              .filter((f: any) => f.user_email === userProfile.email)
              .map((f: any) => f.property_id);
            if (userFavs.length > 0) {
              setFavorites((prev) => Array.from(new Set([...prev, ...userFavs])));
            }
          }
        })
        .catch((err) => console.warn('Supabase favorites fetch error:', err));
    } else {
      localStorage.removeItem('dhamme_active_user');
    }
  }, [userProfile]);

  const handleToggleFavorite = async (id: string) => {
    const isFav = favorites.includes(id);
    setFavorites((prev) =>
      isFav ? prev.filter((item) => item !== id) : [...prev, id]
    );

    // Sync to Supabase cloud favorites database if user is logged in
    if (userProfile?.email) {
      try {
        if (isFav) {
          await supabase.from('favorites').delete(`user_email=eq.${encodeURIComponent(userProfile.email)}&property_id=eq.${encodeURIComponent(id)}`);
        } else {
          await supabase.from('favorites').insert([{
            user_email: userProfile.email,
            property_id: id
          }]);
        }
      } catch (err) {
        console.warn('Supabase favorite toggle error:', err);
      }
    }
  };

  const handleSelectProperty = (prop: PropertyListing) => {
    const updatedProp = {
      ...prop,
      viewsCount: (prop.viewsCount || 45) + 1
    };

    setProperties((prev) =>
      prev.map((p) => (p.id === prop.id ? updatedProp : p))
    );

    setSelectedProperty(updatedProp);
    setCurrentScreen('details');
  };

  // Property Update & Status Change Handler with Audit Logging & Supabase sync
  const handleUpdateProperty = async (updatedProp: PropertyListing) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProp.id ? updatedProp : p))
    );
    if (selectedProperty && selectedProperty.id === updatedProp.id) {
      setSelectedProperty(updatedProp);
    }

    // Record Audit Log
    const newLog = await logActivity({
      action: 'PROPERTY_UPDATED',
      entityType: 'property',
      entityId: updatedProp.id,
      entityTitle: updatedProp.title,
      actorEmail: userProfile?.email || 'admin@dhamme.app',
      actorName: userProfile?.fullName || 'Administrator',
      details: `Updated details/status (${updatedProp.status || 'active'}) for property "${updatedProp.title}" in ${updatedProp.kebele} (${updatedProp.priceLocalFormatted}).`,
      metadata: { priceEtb: updatedProp.priceEtb, status: updatedProp.status, kebele: updatedProp.kebele }
    });
    setActivityLogs((prev) => [newLog, ...prev]);

    // Upsert into Supabase
    try {
      await supabase.from('properties').upsert([{
        id: updatedProp.id,
        title: updatedProp.title,
        price_etb: updatedProp.priceEtb,
        mode: updatedProp.mode,
        category: updatedProp.category,
        city: updatedProp.city,
        kebele: updatedProp.kebele,
        beds: updatedProp.beds,
        baths: updatedProp.baths,
        area_sqm: updatedProp.areaSqm,
        water: String(updatedProp.water),
        electricity: String(updatedProp.electricity),
        pool: String(updatedProp.pool),
        is_featured: updatedProp.isFeatured ?? true,
        images: updatedProp.images,
        video_url: updatedProp.videoUrl || null,
        video_duration: updatedProp.videoDuration || 0,
        video_status: updatedProp.videoStatus || 'active',
        description: updatedProp.description,
        gps_coords: updatedProp.gpsCoords || null,
        near_distance: updatedProp.nearDistance || null,
        lat: updatedProp.lat || 9.3524,
        lng: updatedProp.lng || 42.7961,
        status: updatedProp.status || 'active',
        views_count: updatedProp.viewsCount || 1,
        inquiries_count: updatedProp.inquiriesCount || 0,
        updated_at: new Date().toISOString()
      }], 'id');
    } catch (err) {
      console.warn('Supabase property update error:', err);
    }
  };

  const handleUpdatePropertyStatus = (id: string, newStatus: ListingStatus) => {
    const target = properties.find((p) => p.id === id);
    if (target) {
      handleUpdateProperty({ ...target, status: newStatus });
    }
  };

  const handleAddProperty = async (newProp: PropertyListing) => {
    const updatedProp: PropertyListing = {
      ...newProp,
      agentName: userProfile?.fullName || 'Landlord',
      agentPhone: userProfile?.phone || '+251 91 500 0000',
      agentAvatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ownerEmail: userProfile?.email || 'user@dhamme.app',
      videoUrl: newProp.videoUrl,
      videoDuration: newProp.videoDuration,
      videoStatus: newProp.videoUrl ? 'ready' : undefined,
      status: 'active',
      viewsCount: 1,
      inquiriesCount: 0
    };

    setProperties((prev) => [updatedProp, ...prev]);

    // Record Audit Activity
    const newLog = await logActivity({
      action: 'PROPERTY_POSTED',
      entityType: 'property',
      entityId: updatedProp.id,
      entityTitle: updatedProp.title,
      actorEmail: userProfile?.email || 'user@dhamme.app',
      actorName: userProfile?.fullName || 'Owner',
      details: `New property "${updatedProp.title}" posted in Jigjiga (${updatedProp.kebele}) for ${updatedProp.priceLocalFormatted}.`,
      metadata: { priceEtb: updatedProp.priceEtb, category: updatedProp.category, mode: updatedProp.mode }
    });
    setActivityLogs((prev) => [newLog, ...prev]);

    // Save asynchronously to Supabase cloud DB for all users (logged-in & logged-out)
    try {
      await supabase.from('properties').insert([
        {
          id: updatedProp.id,
          title: updatedProp.title,
          price_etb: updatedProp.priceEtb,
          mode: updatedProp.mode,
          category: updatedProp.category,
          city: updatedProp.city,
          kebele: updatedProp.kebele,
          beds: updatedProp.beds,
          baths: updatedProp.baths,
          area_sqm: updatedProp.areaSqm,
          water: String(updatedProp.water),
          electricity: String(updatedProp.electricity),
          pool: String(updatedProp.pool),
          is_featured: updatedProp.isFeatured ?? true,
          images: updatedProp.images,
          video_url: updatedProp.videoUrl || null,
          video_duration: updatedProp.videoDuration || 0,
          video_status: updatedProp.videoStatus || 'active',
          description: updatedProp.description,
          agent_name: updatedProp.agentName,
          agent_phone: updatedProp.agentPhone,
          agent_avatar: updatedProp.agentAvatar,
          owner_email: updatedProp.ownerEmail,
          gps_coords: updatedProp.gpsCoords || null,
          near_distance: updatedProp.nearDistance || null,
          lat: updatedProp.lat || 9.3524,
          lng: updatedProp.lng || 42.7961,
          status: 'active',
          views_count: 1,
          inquiries_count: 0,
          created_at: new Date().toISOString()
        }
      ]);

      // Broadcast to all open tabs and devices
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('dhamme_live_feed');
        bc.postMessage('NEW_PROPERTY_POSTED');
        bc.close();
      }
    } catch (err) {
      console.error('Failed to sync new property to Supabase:', err);
    }

    setSelectedProperty(updatedProp);
    setCurrentScreen('details');
  };

  // Delete Property Handler with Deletion Reason, Audit Logging, and LocalStorage Cleanup
  const handleDeleteProperty = async (id: string, reason = 'Deleted by Admin') => {
    const deletedProp = properties.find((p) => p.id === id);
    const title = deletedProp?.title || id;

    // 1. Remove from React State
    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(null);
    }

    // 2. Clean from all LocalStorage backup keys so it never resurrects
    BACKUP_STORAGE_KEYS.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter((p: any) => p.id !== id);
            localStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      } catch (e) {
        console.error(`Error cleaning deleted prop from ${key}:`, e);
      }
    });

    // 3. Record Audit Log for Admin Review
    const newLog = await logActivity({
      action: 'PROPERTY_DELETED',
      entityType: 'property',
      entityId: id,
      entityTitle: title,
      actorEmail: userProfile?.email || 'admin@dhamme.app',
      actorName: userProfile?.fullName || 'Administrator',
      details: `Property "${title}" permanently deleted. Reason: ${reason}`,
      metadata: { deletionReason: reason, deletedPropertyId: id }
    });
    setActivityLogs((prev) => [newLog, ...prev]);

    // 4. Delete from Supabase cloud database
    try {
      await supabase.from('properties').delete(`id=eq.${encodeURIComponent(id)}`);
    } catch (err) {
      console.error('Failed to delete property from Supabase:', err);
    }
  };

  const handleBanUser = async (userId: string, reason = 'Banned by Administrator') => {
    const targetUser = registeredAccounts.find((u) => u.id === userId);
    setRegisteredAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userId
          ? {
              ...acc,
              isBanned: true,
              bannedReason: reason,
              bannedAt: new Date().toISOString()
            }
          : acc
      )
    );
    if (userProfile && userProfile.id === userId) {
      setUserProfile((prev) =>
        prev
          ? { ...prev, isBanned: true, bannedReason: reason }
          : null
      );
    }

    // Log Action
    const newLog = await logActivity({
      action: 'USER_BANNED',
      entityType: 'user',
      entityId: userId,
      entityTitle: targetUser?.fullName || userId,
      actorEmail: userProfile?.email || 'admin@dhamme.app',
      actorName: userProfile?.fullName || 'Administrator',
      details: `User ${targetUser?.fullName} (${targetUser?.email}) was banned. Reason: ${reason}`
    });
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleUnbanUser = async (userId: string) => {
    const targetUser = registeredAccounts.find((u) => u.id === userId);
    setRegisteredAccounts((prev) =>
      prev.map((acc) =>
        acc.id === userId
          ? {
              ...acc,
              isBanned: false,
              bannedReason: undefined,
              bannedAt: undefined
            }
          : acc
      )
    );
    if (userProfile && userProfile.id === userId) {
      setUserProfile((prev) =>
        prev ? { ...prev, isBanned: false, bannedReason: undefined } : null
      );
    }

    // Log Action
    const newLog = await logActivity({
      action: 'USER_UNBANNED',
      entityType: 'user',
      entityId: userId,
      entityTitle: targetUser?.fullName || userId,
      actorEmail: userProfile?.email || 'admin@dhamme.app',
      actorName: userProfile?.fullName || 'Administrator',
      details: `User ${targetUser?.fullName} (${targetUser?.email}) was unbanned.`
    });
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleToggleUserVerification = async (userId: string) => {
    const targetUser = registeredAccounts.find((u) => u.id === userId);
    if (!targetUser) return;
    const newStatus = !targetUser.isVerified;

    setRegisteredAccounts((prev) =>
      prev.map((acc) => (acc.id === userId ? { ...acc, isVerified: newStatus } : acc))
    );

    if (userProfile && userProfile.id === userId) {
      setUserProfile((prev) => (prev ? { ...prev, isVerified: newStatus } : null));
    }

    // Update Supabase
    supabase.from('user_profiles').upsert([{
      id: targetUser.id,
      is_verified: newStatus
    }], 'id');

    // Log Action
    const newLog = await logActivity({
      action: 'VERIFICATION_TOGGLED',
      entityType: 'user',
      entityId: userId,
      entityTitle: targetUser.fullName,
      actorEmail: userProfile?.email || 'admin@dhamme.app',
      actorName: userProfile?.fullName || 'Administrator',
      details: `Landlord verification ${newStatus ? 'GRANTED' : 'REVOKED'} for ${targetUser.fullName} (${targetUser.email}).`
    });
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleNavigateScreen = (screen: ScreenName) => {
    if ((screen.startsWith('post_step') || screen === 'my_listings') && !userProfile) {
      setCurrentScreen('login');
      try { window.history.pushState({}, '', '/login'); } catch (e) {}
      return;
    }

    // Banned user blocking
    if (screen.startsWith('post_step') && userProfile?.isBanned) {
      alert(`Akoonkaaga waa la xannibay: ${userProfile.bannedReason || 'Ma soo gelin kartid guryo cusub.'}`);
      return;
    }

    // Strict Admin route protection
    if (screen === 'admin_dashboard') {
      if (!userProfile) {
        setCurrentScreen('login');
        try { window.history.pushState({}, '', '/login'); } catch (e) {}
        return;
      }
      const isMasterAdmin = Boolean(
        userProfile.isAdmin || userProfile.email?.toLowerCase() === 'magudbeai@gmail.com'
      );
      if (!isMasterAdmin) {
        alert('Awood uma lihid boggan maamulka (Access Denied: Master Admin Only).');
        setCurrentScreen('home');
        try { window.history.pushState({}, '', '/'); } catch (e) {}
        return;
      }
    }

    setCurrentScreen(screen);

    try {
      let targetPath = '/';
      if (screen === 'login') targetPath = '/login';
      else if (screen === 'signup') targetPath = '/signup';
      else if (screen === 'admin_dashboard') targetPath = '/admin';
      else if (screen === 'profile') targetPath = '/profile';
      else if (screen === 'favorites') targetPath = '/favorites';
      else if (screen === 'my_listings') targetPath = '/my_listings';
      else if (screen === 'privacy') targetPath = '/privacy';
      else if (screen === 'terms') targetPath = '/terms';
      window.history.pushState({}, '', targetPath);
    } catch (e) {}
  };


  const handleRegisterAccount = async (newAccount: RegisteredAccount) => {
    setRegisteredAccounts((prev) => [...prev, newAccount]);

    // Log User Registration
    const newLog = await logActivity({
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: newAccount.id,
      entityTitle: newAccount.fullName,
      actorEmail: newAccount.email,
      actorName: newAccount.fullName,
      details: `New user "${newAccount.fullName}" registered with email ${newAccount.email}.`
    });
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    if (profile.isBanned) {
      alert(`Akoonkaaga waa la xannibay: ${profile.bannedReason || 'La xiriir Maamulka.'}`);
      return;
    }
    setUserProfile(profile);
    if (profile.isAdmin || profile.email === 'magudbeai@gmail.com') {
      setCurrentScreen('admin_dashboard');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setCurrentScreen('home');
  };

  const handleIdleLogout = () => {
    setUserProfile(null);
    setCurrentScreen('login'); // Direct navigation to Login page on Idle timeout

    // Send System Web Push Notification Alert
    triggerWebPushNotification({
      title: 'DHAMME - Idle Session Expired ⏱️',
      body: 'Waxaad ka baxday app-ka ka dib 10 daqiiqo oo bilaash ah. Fadlan dib ugu soo gal koontadaada.'
    });
  };

  // 10-Minute User Inactivity & Background Abandonment Logout Tracker
  const { isLoggedOutDueToInactivity, clearInactivityNotice } = useInactivityLogout({
    enabled: Boolean(userProfile),
    onLogout: handleIdleLogout
  });

  const userListings = properties.filter((p) => 
    (userProfile?.email && p.ownerEmail === userProfile.email) ||
    p.agentName === (userProfile?.fullName || 'Landlord') ||
    p.ownerEmail === 'user@dhamme.app' ||
    p.id.startsWith('prop-')
  );

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'signup';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#17191C] font-sans">
      
      {/* 1. Splash Screen */}
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SplashScreen onStart={() => setCurrentScreen('onboarding')} />
          </motion.div>
        )}

        {/* 2. Onboarding Flow */}
        {currentScreen === 'onboarding' && (
          <motion.div
            key="onboarding-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Onboarding onComplete={() => setCurrentScreen('home')} />
          </motion.div>
        )}

        {/* 3. Dedicated Authentication Full Page */}
        {isAuthScreen && (
          <motion.div
            key="auth-page-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPage
              initialScreen={currentScreen === 'signup' ? 'signup' : 'login'}
              registeredAccounts={registeredAccounts}
              onRegisterAccount={handleRegisterAccount}
              onLoginSuccess={handleLoginSuccess}
              onBackToHome={() => setCurrentScreen('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Header */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && !isAuthScreen && (
        <HeaderNav 
          userProfile={userProfile}
          onNavigate={handleNavigateScreen} 
          onOpenAI={() => setShowAIModal(true)}
        />
      )}

      {/* Main View Area with Smooth Page Navigation Transitions */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && !isAuthScreen && (
        <main className="w-full">
          <AnimatePresence mode="wait">
            
            {/* HOME FEED */}
            {currentScreen === 'home' && (
              <motion.div
                key="screen-home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <HomeFeed
                  properties={properties}
                  onSelectProperty={handleSelectProperty}
                  onOpenFilter={() => setShowFilterModal(true)}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onStartPostListing={() => handleNavigateScreen('post_step1')}
                  activeFilter={activeFilter}
                  onUpdateFilter={(newFilter) => setActiveFilter(newFilter)}
                />
              </motion.div>
            )}

            {/* LISTING DETAILS */}
            {currentScreen === 'details' && selectedProperty && (
              <motion.div
                key={`screen-details-${selectedProperty.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <ListingDetails
                  property={selectedProperty}
                  userProfile={userProfile}
                  onBack={() => setCurrentScreen('home')}
                  isFav={favorites.includes(selectedProperty.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            )}

            {/* POST LISTING 5-STEP WIZARD (Requires Authentication) */}
            {currentScreen.startsWith('post_step') && (
              <motion.div
                key={`screen-post-${currentScreen}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {userProfile ? (
                  <PostListingWizard
                    currentStep={parseInt(currentScreen.replace('post_step', ''), 10) || 1}
                    onNavigateStep={(step) => setCurrentScreen(`post_step${step}` as ScreenName)}
                    onAddProperty={handleAddProperty}
                    onCancel={() => setCurrentScreen('home')}
                  />
                ) : (
                  <AuthPage
                    initialScreen="login"
                    registeredAccounts={registeredAccounts}
                    onRegisterAccount={handleRegisterAccount}
                    onLoginSuccess={handleLoginSuccess}
                    onBackToHome={() => setCurrentScreen('home')}
                  />
                )}
              </motion.div>
            )}

            {/* FAVORITES */}
            {currentScreen === 'favorites' && (
              <motion.div
                key="screen-favorites"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <Favorites
                  favoriteIds={favorites}
                  allProperties={properties}
                  onSelectProperty={handleSelectProperty}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            )}

            {/* MY LISTINGS & LANDLORD ANALYTICS DASHBOARD (Requires Authentication) */}
            {currentScreen === 'my_listings' && (
              <motion.div
                key="screen-my-listings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {userProfile ? (
                  <MyListings
                    userListings={userListings}
                    onSelectProperty={handleSelectProperty}
                    onStartNewListing={() => handleNavigateScreen('post_step1')}
                    onUpdateStatus={handleUpdatePropertyStatus}
                  />
                ) : (
                  <AuthPage
                    initialScreen="login"
                    registeredAccounts={registeredAccounts}
                    onRegisterAccount={handleRegisterAccount}
                    onLoginSuccess={handleLoginSuccess}
                    onBackToHome={() => setCurrentScreen('home')}
                  />
                )}
              </motion.div>
            )}

            {/* MASTER ADMIN DASHBOARD (Strict Master Admin Authorization Gate) */}
            {currentScreen === 'admin_dashboard' && (
              <motion.div
                key="screen-admin-dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {(userProfile && (userProfile.isAdmin || userProfile.email?.toLowerCase() === 'magudbeai@gmail.com')) ? (
                  <AdminDashboard
                    properties={properties}
                    registeredAccounts={registeredAccounts}
                    activityLogs={activityLogs}
                    currentUser={userProfile}
                    onSelectProperty={handleSelectProperty}
                    onDeleteProperty={handleDeleteProperty}
                    onUpdateProperty={handleUpdateProperty}
                    onBanUser={handleBanUser}
                    onUnbanUser={handleUnbanUser}
                    onToggleUserVerification={handleToggleUserVerification}
                    onRefreshData={syncDatabaseFull}
                    onExportBackup={() => downloadFullDatabaseBackup({
                      properties,
                      users: registeredAccounts,
                      activityLogs
                    })}
                    onBackToHome={() => setCurrentScreen('home')}
                  />
                ) : (
                  <AuthPage
                    initialScreen="login"
                    registeredAccounts={registeredAccounts}
                    onRegisterAccount={handleRegisterAccount}
                    onLoginSuccess={handleLoginSuccess}
                    onBackToHome={() => setCurrentScreen('home')}
                  />
                )}
              </motion.div>
            )}

            {/* PROFILE */}
            {currentScreen === 'profile' && (
              <motion.div
                key="screen-profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <Profile
                  userProfile={userProfile}
                  userListingsCount={userListings.length}
                  onNavigate={handleNavigateScreen}
                  onUpdateProfile={(updated) => {
                    setUserProfile(updated);
                    setRegisteredAccounts((prev) =>
                      prev.map((acc) => (acc.email === updated.email ? { ...acc, ...updated } : acc))
                    );
                  }}
                  onOpenAuth={() => setCurrentScreen('login')}
                  onLogout={handleLogout}
                  onOpenAI={() => setShowAIModal(true)}
                />
              </motion.div>
            )}

            {/* PRIVACY POLICY */}
            {currentScreen === 'privacy' && (
              <motion.div
                key="screen-privacy"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <PrivacyPolicy onBack={() => handleNavigateScreen('home')} />
              </motion.div>
            )}

            {/* TERMS OF SERVICE */}
            {currentScreen === 'terms' && (
              <motion.div
                key="screen-terms"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <TermsOfService onBack={() => handleNavigateScreen('home')} />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      )}

      {/* Bottom Navigation */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && !isAuthScreen && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={handleNavigateScreen}
        />
      )}

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <FilterModal
            initialFilter={activeFilter}
            onApply={(f) => setActiveFilter(f)}
            onClose={() => setShowFilterModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal (Fallback Popup) */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            initialScreen={authScreen}
            registeredAccounts={registeredAccounts}
            onRegisterAccount={handleRegisterAccount}
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Real Estate AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <DhammeRealEstateAIModal onClose={() => setShowAIModal(false)} />
        )}
      </AnimatePresence>

      {/* 10-Minute Session Expiry Notification Modal */}
      <AnimatePresence>
        {isLoggedOutDueToInactivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => clearInactivityNotice()}
              className="fixed inset-0 bg-[#111315]/65 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E8E5DF] text-center z-10"
            >
              <div className="w-16 h-16 bg-[#FAF9F6] border border-[#E8E5DF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111315]">
                <span className="material-symbols-outlined text-3xl">timer_off</span>
              </div>
              
              <h3 className="text-xl font-bold font-serif text-[#111315] mb-2">
                Session Auto-Logged Out
              </h3>
              
              <p className="text-sm text-[#74777B] mb-6 leading-relaxed">
                You were logged out after 10 minutes of inactivity or leaving the app to keep your Dhamme account and property listings secure.
              </p>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    clearInactivityNotice();
                    handleNavigateScreen('login');
                  }}
                  className="w-full py-3.5 px-6 bg-[#111315] hover:bg-[#22272B] text-white font-semibold rounded-xl transition-all shadow-xs text-sm cursor-pointer"
                >
                  Sign Back In
                </motion.button>
                <button
                  onClick={() => clearInactivityNotice()}
                  className="w-full py-3 px-6 bg-[#FAF9F6] border border-[#E8E5DF] text-[#74777B] font-medium rounded-xl hover:border-[#111315] transition-all text-sm cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
