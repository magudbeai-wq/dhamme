import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
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
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  // Register Web Push Service Worker on startup
  useEffect(() => {
    registerServiceWorker();
  }, []);

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    const path = window.location.pathname.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    const screenParam = search.get('screen');

    if (path.includes('login') || screenParam === 'login') return 'login';
    if (path.includes('signup') || screenParam === 'signup') return 'signup';
    if (path.includes('admin') || screenParam === 'admin') return 'admin_dashboard';
    if (path.includes('profile') || screenParam === 'profile') return 'profile';
    if (path.includes('privacy') || screenParam === 'privacy') return 'privacy';
    if (path.includes('terms') || screenParam === 'terms') return 'terms';
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

  // Sync Clerk User state into userProfile
  useEffect(() => {
    if (isClerkLoaded && isClerkSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || '';
      const fullName = clerkUser.fullName || clerkUser.firstName || email.split('@')[0] || 'Dhamme User';
      const avatarUrl = clerkUser.imageUrl || '';
      const phone = clerkUser.primaryPhoneNumber?.phoneNumber || '';
      const isAdmin = email.toLowerCase() === 'magudbeai@gmail.com';

      const updatedProfile: UserProfile = {
        id: clerkUser.id,
        fullName,
        email,
        phone,
        avatarUrl,
        bio: 'Dhamme Verified User (Clerk Auth)',
        joinedDate: new Date(clerkUser.createdAt || Date.now()).toISOString().split('T')[0],
        isAdmin,
        isVerified: true
      };
      setUserProfile(updatedProfile);
    }
  }, [isClerkLoaded, isClerkSignedIn, clerkUser]);


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

  // Full Database Sync Handler (Reconciles Supabase Cloud + LocalStorage)
  const syncDatabaseFull = useCallback(async () => {
    try {
      // 1. Fetch Cloud Properties
      const { data: propData, error: propError } = await supabase.from('properties').select('*');
      if (propData && !propError && Array.isArray(propData) && propData.length > 0) {
        setProperties((prev) => {
          const merged = [...prev];
          propData.forEach((dbProp: any) => {
            const formatted: PropertyListing = {
              id: dbProp.id || `prop-db-${Date.now()}`,
              title: dbProp.title,
              priceEtb: Number(dbProp.price_etb),
              priceLocalFormatted: `${Number(dbProp.price_etb).toLocaleString()} ETB`,
              mode: dbProp.mode || 'kiro',
              category: dbProp.category || 'Family House',
              city: dbProp.city || 'Jigjiga',
              kebele: dbProp.kebele || 'Kebele 06',
              beds: dbProp.beds || 3,
              baths: dbProp.baths || 2,
              areaSqm: dbProp.area_sqm || 180,
              water: dbProp.water || 'Yes',
              electricity: dbProp.electricity || '24h',
              pool: dbProp.pool || 'No',
              images: dbProp.images?.length > 0 ? dbProp.images : ['/jigjiga-house-1.jpg'],
              videoUrl: dbProp.video_url || undefined,
              videoThumbnail: dbProp.video_thumbnail || undefined,
              videoDuration: dbProp.video_duration ? Number(dbProp.video_duration) : undefined,
              videoStatus: dbProp.video_status || (dbProp.video_url ? 'ready' : undefined),
              description: dbProp.description || '',
              agentName: dbProp.agent_name || 'Landlord',
              agentPhone: dbProp.agent_phone || '+251 91 000 0000',
              agentAvatar: dbProp.agent_avatar || '',
              postedDate: dbProp.created_at ? new Date(dbProp.created_at).toISOString().split('T')[0] : '2026-08-01',
              status: dbProp.status || 'active'
            };
            const existingIndex = merged.findIndex((p) => p.id === formatted.id);
            if (existingIndex >= 0) {
              merged[existingIndex] = { ...merged[existingIndex], ...formatted };
            } else {
              merged.unshift(formatted);
            }
          });
          return merged;
        });
      }

      // 2. Fetch Cloud Activity Logs
      const loadedLogs = await fetchAllActivityLogs();
      if (loadedLogs.length > 0) {
        setActivityLogs(loadedLogs);
      }
    } catch (err) {
      console.error('Supabase properties sync error:', err);
    }
  }, []);

  // Fetch properties & audit logs on startup
  useEffect(() => {
    syncDatabaseFull();
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
        description: updatedProp.description,
        status: updatedProp.status,
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

    // Save asynchronously to Supabase cloud DB
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
          description: updatedProp.description,
          images: updatedProp.images,
          video_url: updatedProp.videoUrl,
          video_duration: updatedProp.videoDuration,
          video_status: updatedProp.videoStatus,
          agent_name: updatedProp.agentName,
          agent_phone: updatedProp.agentPhone,
          agent_avatar: updatedProp.agentAvatar,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ]);
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
    if (screen === 'login' || screen === 'signup') {
      clearInactivityNotice();
    }

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
    if (screen === 'admin_dashboard' && (!userProfile?.isAdmin && userProfile?.email?.toLowerCase() !== 'magudbeai@gmail.com')) {
      setCurrentScreen('login');
      try { window.history.pushState({}, '', '/login'); } catch (e) {}
      return;
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
    clearInactivityNotice();
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
    clearInactivityNotice();
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
    clearInactivityNotice();
    if (isClerkSignedIn) {
      clerkSignOut();
    }
    setUserProfile(null);
    setCurrentScreen('home');
  };

  const handleIdleLogout = () => {
    if (isClerkSignedIn) {
      clerkSignOut();
    }
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
    enabled: Boolean(userProfile || isClerkSignedIn),
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
      {currentScreen === 'splash' && (
        <SplashScreen onStart={() => setCurrentScreen('onboarding')} />
      )}

      {/* 2. Onboarding Flow */}
      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={() => setCurrentScreen('home')} />
      )}

      {/* 3. Dedicated Authentication Full Page */}
      {isAuthScreen && (
        <AuthPage
          initialScreen={currentScreen === 'signup' ? 'signup' : 'login'}
          registeredAccounts={registeredAccounts}
          onRegisterAccount={handleRegisterAccount}
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={() => setCurrentScreen('home')}
        />
      )}

      {/* Main Layout Header */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && !isAuthScreen && (
        <HeaderNav 
          userProfile={userProfile}
          onNavigate={handleNavigateScreen} 
          onOpenAI={() => setShowAIModal(true)}
        />
      )}

      {/* Main View Area */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && !isAuthScreen && (
        <main className="w-full">
          
          {/* HOME FEED */}
          {currentScreen === 'home' && (
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
          )}

          {/* LISTING DETAILS */}
          {currentScreen === 'details' && selectedProperty && (
            <ListingDetails
              property={selectedProperty}
              userProfile={userProfile}
              onBack={() => setCurrentScreen('home')}
              isFav={favorites.includes(selectedProperty.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {/* POST LISTING 5-STEP WIZARD */}
          {currentScreen.startsWith('post_step') && (
            <PostListingWizard
              currentStep={parseInt(currentScreen.replace('post_step', ''), 10) || 1}
              onNavigateStep={(step) => setCurrentScreen(`post_step${step}` as ScreenName)}
              onAddProperty={handleAddProperty}
              onCancel={() => setCurrentScreen('home')}
            />
          )}

          {/* FAVORITES */}
          {currentScreen === 'favorites' && (
            <Favorites
              favoriteIds={favorites}
              allProperties={properties}
              onSelectProperty={handleSelectProperty}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {/* MY LISTINGS & LANDLORD ANALYTICS DASHBOARD */}
          {currentScreen === 'my_listings' && (
            <MyListings
              userListings={userListings}
              onSelectProperty={handleSelectProperty}
              onStartNewListing={() => handleNavigateScreen('post_step1')}
              onUpdateStatus={handleUpdatePropertyStatus}
            />
          )}

          {/* MASTER ADMIN DASHBOARD */}
          {currentScreen === 'admin_dashboard' && (
            <AdminDashboard
              properties={properties}
              registeredAccounts={registeredAccounts}
              activityLogs={activityLogs}
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
            />
          )}

          {/* PROFILE */}
          {currentScreen === 'profile' && (
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
          )}

          {/* PRIVACY POLICY */}
          {currentScreen === 'privacy' && (
            <PrivacyPolicy onBack={() => handleNavigateScreen('home')} />
          )}

          {/* TERMS OF SERVICE */}
          {currentScreen === 'terms' && (
            <TermsOfService onBack={() => handleNavigateScreen('home')} />
          )}

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
      {showFilterModal && (
        <FilterModal
          initialFilter={activeFilter}
          onApply={(f) => setActiveFilter(f)}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {/* Auth Modal (Fallback Popup) */}
      {showAuthModal && (
        <AuthModal
          initialScreen={authScreen}
          registeredAccounts={registeredAccounts}
          onRegisterAccount={handleRegisterAccount}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Real Estate AI Modal */}
      {showAIModal && (
        <DhammeRealEstateAIModal onClose={() => setShowAIModal(false)} />
      )}

      {/* Session Expiry Notification Modal (Never shown over login/signup) */}
      {isLoggedOutDueToInactivity && !isAuthScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-[#E8E5DF] text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-[#FAF9F6] border border-[#E8E5DF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#111315]">
              <span className="material-symbols-outlined text-3xl">timer_off</span>
            </div>
            
            <h3 className="text-xl font-bold font-serif text-[#17191C] mb-2">
              Session Auto-Logged Out
            </h3>
            
            <p className="text-sm text-[#74777B] mb-6 leading-relaxed">
              You were logged out after 10 minutes of inactivity or leaving the app to keep your Dhamme account and property listings secure.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  clearInactivityNotice();
                  handleNavigateScreen('login');
                }}
                className="w-full py-3.5 px-6 bg-[#111315] hover:bg-[#17191C] text-white font-semibold rounded-xl transition-all shadow-xs active:scale-95 text-sm"
              >
                Sign Back In
              </button>
              <button
                onClick={() => clearInactivityNotice()}
                className="w-full py-3 px-6 bg-[#FAF9F6] border border-[#E8E5DF] text-[#74777B] font-medium rounded-xl hover:border-[#111315] transition-all text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
