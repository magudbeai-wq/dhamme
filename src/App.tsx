import { useState, useEffect } from 'react';
import type { ScreenName, PropertyListing, FilterState, UserProfile } from './types';
import { INITIAL_PROPERTIES } from './data/propertiesData';
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
import { AuthModal } from './components/Auth/AuthModal';
import { DhammeRealEstateAIModal } from './components/DhammeRealEstateAIModal';

interface RegisteredAccount extends UserProfile {
  passwordHash: string;
}

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [properties, setProperties] = useState<PropertyListing[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userListings, setUserListings] = useState<PropertyListing[]>([]);

  // Registered accounts stored locally (no sample accounts - starts empty or from LocalStorage)
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('dhamme_registered_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  // Current logged in profile (starts null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dhamme_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'forgot_password'>('signup');
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

  // Save registered accounts to LocalStorage
  useEffect(() => {
    localStorage.setItem('dhamme_registered_accounts', JSON.stringify(registeredAccounts));
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

  const handleAddProperty = (newProp: PropertyListing) => {
    const updatedProp: PropertyListing = {
      ...newProp,
      agentName: userProfile?.fullName || 'Landlord',
      agentPhone: userProfile?.phone || '+251 91 000 0000',
      agentAvatar: userProfile?.avatarUrl || '',
      ownerEmail: userProfile?.email
    };

    setProperties((prev) => [updatedProp, ...prev]);
    setUserListings((prev) => [updatedProp, ...prev]);
    setSelectedProperty(updatedProp);
    setCurrentScreen('details');
  };

  const handleNavigateScreen = (screen: ScreenName) => {
    if ((screen.startsWith('post_step') || screen === 'my_listings') && !userProfile) {
      setAuthScreen('signup');
      setShowAuthModal(true);
      return;
    }
    setCurrentScreen(screen);
  };

  const handleRegisterAccount = (newAccount: RegisteredAccount) => {
    setRegisteredAccounts((prev) => [...prev, newAccount]);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setCurrentScreen('home');
  };

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

      {/* Main Layout Header */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
        <HeaderNav 
          onNavigate={handleNavigateScreen} 
          onOpenAI={() => setShowAIModal(true)}
        />
      )}

      {/* Main View Area */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
        <main className="w-full">
          
          {/* HOME FEED */}
          {currentScreen === 'home' && (
            <HomeFeed
              properties={properties}
              onSelectProperty={(prop) => {
                setSelectedProperty(prop);
                setCurrentScreen('details');
              }}
              onOpenFilter={() => setShowFilterModal(true)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
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
              onSelectProperty={(prop) => {
                setSelectedProperty(prop);
                setCurrentScreen('details');
              }}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {/* MY LISTINGS */}
          {currentScreen === 'my_listings' && (
            <MyListings
              userListings={userListings}
              onSelectProperty={(prop) => {
                setSelectedProperty(prop);
                setCurrentScreen('details');
              }}
              onStartNewListing={() => handleNavigateScreen('post_step1')}
            />
          )}

          {/* PROFILE */}
          {currentScreen === 'profile' && (
            <Profile
              userProfile={userProfile}
              onUpdateProfile={(updated) => {
                setUserProfile(updated);
                setRegisteredAccounts((prev) =>
                  prev.map((acc) => (acc.email === updated.email ? { ...acc, ...updated } : acc))
                );
              }}
              onOpenAuth={() => {
                setAuthScreen('signup');
                setShowAuthModal(true);
              }}
              onLogout={handleLogout}
              onOpenAI={() => setShowAIModal(true)}
            />
          )}

        </main>
      )}

      {/* Bottom Navigation */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
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

      {/* Auth Modal */}
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
