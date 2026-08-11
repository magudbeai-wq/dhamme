import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import type { ScreenName, PropertyListing, FilterState, UserProfile, ListingStatus } from './types';
import { INITIAL_PROPERTIES } from './data/propertiesData';
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
import { DhammeRealEstateAIModal } from './components/DhammeRealEstateAIModal';
import { supabase } from './services/supabaseClient';

export function App() {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn, user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    const path = window.location.pathname.toLowerCase();
    const search = new URLSearchParams(window.location.search);
    const screenParam = search.get('screen');

    if (path.includes('login') || screenParam === 'login') return 'login';
    if (path.includes('signup') || screenParam === 'signup') return 'signup';
    if (path.includes('admin') || screenParam === 'admin') return 'admin_dashboard';
    if (path.includes('profile') || screenParam === 'profile') return 'profile';
    return 'splash';
  });
  const [properties, setProperties] = useState<PropertyListing[]>(() => {
    const keys = [
      'dhamme_user_posted_properties_v1',
      'dhamme_properties_archive_v2',
      'dhamme_all_listings_v3',
      'dhamme_permanent_backup'
    ];
    let loaded: PropertyListing[] = [];
    keys.forEach((key) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: PropertyListing) => {
              if (item && item.id && !loaded.some((existing) => existing.id === item.id)) {
                loaded.push(item);
              }
            });
          }
        } catch (e) {
          console.error(`Error loading properties from ${key}:`, e);
        }
      }
    });

    if (loaded.length === 0) {
      return INITIAL_PROPERTIES;
    }

    const merged = [...loaded];
    INITIAL_PROPERTIES.forEach((initProp) => {
      if (!merged.some((p) => p.id === initProp.id)) {
        merged.push(initProp);
      }
    });
    return merged;
  });
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Registered accounts stored locally with full user history
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const savedV1 = localStorage.getItem('dhamme_registered_accounts');
    const savedV2 = localStorage.getItem('dhamme_accounts_backup');
    let loadedAccounts: RegisteredAccount[] = [];

    [savedV1, savedV2].forEach((s) => {
      if (s) {
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) {
            parsed.forEach((acc: RegisteredAccount) => {
              if (acc && acc.email && !loadedAccounts.some((existing) => existing.email === acc.email)) {
                loadedAccounts.push(acc);
              }
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    const merged = loadedAccounts.length > 0 ? [...loadedAccounts] : [...INITIAL_REGISTERED_ACCOUNTS];
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
      const isAdmin = email === 'magudbeai@gmail.com' || email.includes('admin');

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
      const keys = [
        'dhamme_user_posted_properties_v1',
        'dhamme_properties_archive_v2',
        'dhamme_all_listings_v3',
        'dhamme_permanent_backup'
      ];
      keys.forEach((key) => localStorage.setItem(key, json));
    } catch (e) {
      console.error('Failed to backup properties to local storage:', e);
    }
  }, [properties]);

  // Fetch properties from Supabase cloud database on startup
  useEffect(() => {
    async function syncSupabaseProperties() {
      try {
        const { data, error } = await supabase.from('properties').select('*');
        if (data && !error && data.length > 0) {
          setProperties((prev) => {
            const merged = [...prev];
            data.forEach((dbProp: any) => {
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
                description: dbProp.description || '',
                agentName: dbProp.agent_name || 'Landlord',
                agentPhone: dbProp.agent_phone || '+251 91 000 0000',
                agentAvatar: dbProp.agent_avatar || '',
                postedDate: dbProp.created_at ? new Date(dbProp.created_at).toISOString().split('T')[0] : '2026-08-01',
                status: 'active'
              };
              if (!merged.some((p) => p.id === formatted.id || p.title === formatted.title)) {
                merged.unshift(formatted);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Supabase properties sync error:', err);
      }
    }
    syncSupabaseProperties();
  }, []);

  // Save registered accounts to LocalStorage
  useEffect(() => {
    try {
      const json = JSON.stringify(registeredAccounts);
      localStorage.setItem('dhamme_registered_accounts', json);
      localStorage.setItem('dhamme_accounts_backup', json);
    } catch (e) {
      console.error(e);
    }
  }, [registeredAccounts]);

  // Save active logged-in user to LocalStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('dhamme_active_user', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('dhamme_active_user');
    }
  }, [userProfile]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

  const handleUpdatePropertyStatus = (id: string, newStatus: ListingStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddProperty = async (newProp: PropertyListing) => {
    const updatedProp: PropertyListing = {
      ...newProp,
      agentName: userProfile?.fullName || 'Landlord',
      agentPhone: userProfile?.phone || '+251 91 500 0000',
      agentAvatar: userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ownerEmail: userProfile?.email || 'user@dhamme.app',
      status: 'active',
      viewsCount: 1,
      inquiriesCount: 0
    };

    setProperties((prev) => [updatedProp, ...prev]);

    // Save asynchronously to Supabase cloud DB
    try {
      await supabase.from('properties').insert([
        {
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
          agent_name: updatedProp.agentName,
          agent_phone: updatedProp.agentPhone,
          agent_avatar: updatedProp.agentAvatar
        }
      ]);
    } catch (err) {
      console.error('Failed to sync new property to Supabase:', err);
    }

    setSelectedProperty(updatedProp);
    setCurrentScreen('details');
  };

  const handleNavigateScreen = (screen: ScreenName) => {
    if ((screen.startsWith('post_step') || screen === 'my_listings') && !userProfile) {
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
      window.history.pushState({}, '', targetPath);
    } catch (e) {}
  };

  const handleRegisterAccount = (newAccount: RegisteredAccount) => {
    setRegisteredAccounts((prev) => [...prev, newAccount]);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    if (profile.isAdmin || profile.email === 'magudbeai@gmail.com') {
      setCurrentScreen('admin_dashboard');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleLogout = () => {
    if (isClerkSignedIn) {
      clerkSignOut();
    }
    setUserProfile(null);
    setCurrentScreen('home');
  };

  const userListings = properties.filter((p) => 
    (userProfile?.email && p.ownerEmail === userProfile.email) ||
    p.agentName === (userProfile?.fullName || 'Landlord') ||
    p.ownerEmail === 'user@dhamme.app' ||
    p.id.startsWith('prop-')
  );

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'signup';

  return (
    <div className="min-h-screen bg-[#F2E8DC] text-[#1b1b1c] font-inter">
      
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
            />
          )}

          {/* LISTING DETAILS */}
          {currentScreen === 'details' && selectedProperty && (
            <ListingDetails
              property={selectedProperty}
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
              onSelectProperty={handleSelectProperty}
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

    </div>
  );
}
