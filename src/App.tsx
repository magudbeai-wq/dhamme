import { useState } from 'react';
import type { ScreenName, PropertyListing, FilterState } from './types';
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

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [properties, setProperties] = useState<PropertyListing[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['prop-1', 'prop-3']);
  const [userListings, setUserListings] = useState<PropertyListing[]>([]);
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'otp' | 'forgot_password'>('login');
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

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddProperty = (newProp: PropertyListing) => {
    setProperties((prev) => [newProp, ...prev]);
    setUserListings((prev) => [newProp, ...prev]);
    setSelectedProperty(newProp);
    setCurrentScreen('details');
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
          onNavigate={(s) => setCurrentScreen(s)} 
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
              onStartNewListing={() => setCurrentScreen('post_step1')}
            />
          )}

          {/* PROFILE */}
          {currentScreen === 'profile' && (
            <Profile
              onOpenAuth={() => {
                setAuthScreen('login');
                setShowAuthModal(true);
              }}
              onOpenAI={() => setShowAIModal(true)}
            />
          )}

        </main>
      )}

      {/* Bottom Navigation */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
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
          onSuccess={() => alert('Waad soo gashay (Login successful)!')}
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
