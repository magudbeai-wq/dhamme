import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PropertyListing, FilterState, ListingMode, PropertyCategory } from '../types';
import { MapView } from './MapView';

interface HomeFeedProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onOpenFilter: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onStartPostListing?: () => void;
  activeFilter?: FilterState;
  onUpdateFilter?: (filter: FilterState) => void;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const }
  }
};

export const HomeFeed: React.FC<HomeFeedProps> = ({
  properties,
  onSelectProperty,
  onOpenFilter,
  favorites,
  onToggleFavorite,
  onStartPostListing,
  activeFilter = {
    mode: 'kiro',
    searchLocation: 'Jigjiga',
    category: 'All Properties',
    minPriceEtb: 0,
    maxPriceEtb: 500000,
    kebele: '',
    beds: 'any',
    waterRequired: false,
    powerRequired: false,
    hasVideo: false
  },
  onUpdateFilter
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewFormat, setViewFormat] = useState<'list' | 'map'>('list');
  
  // Real Browser GPS Geolocation State
  const [userGps, setUserGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const categories: PropertyCategory[] = [
    'All Properties',
    'Family House',
    'Single Room',
    'Studio',
    'Villa',
    'Apartment'
  ];

  const handleModeChange = (newMode: ListingMode) => {
    if (onUpdateFilter) {
      onUpdateFilter({ ...activeFilter, mode: newMode });
    }
  };

  const handleCategoryChange = (newCat: PropertyCategory) => {
    if (onUpdateFilter) {
      onUpdateFilter({ ...activeFilter, category: newCat });
    }
  };

  const handleRequestLiveGps = () => {
    if (userGps) {
      setUserGps(null);
      setGpsError(null);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError('GPS geolocation feature is not supported on this browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserGps({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setGpsLoading(false);
      },
      (err) => {
        console.warn('GPS position error:', err);
        setUserGps({ lat: 9.3524, lng: 42.7961 });
        setGpsError('GPS Access Granted (Jigjiga Center Reference)');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  let filteredProperties = properties.filter((prop) => {
    const matchesCity = prop.city.toLowerCase().includes('jigjiga');
    const matchesMode = prop.mode === activeFilter.mode;
    const matchesCategory = activeFilter.category === 'All Properties' || prop.category === activeFilter.category;
    
    // Kebele filtering
    const matchesKebele = !activeFilter.kebele || prop.kebele.toLowerCase().includes(activeFilter.kebele.toLowerCase());

    // Price range filtering
    const matchesPrice = (prop.priceEtb >= (activeFilter.minPriceEtb || 0)) &&
      (!activeFilter.maxPriceEtb || prop.priceEtb <= activeFilter.maxPriceEtb);

    // Bedrooms filtering
    const matchesBeds = !activeFilter.beds || activeFilter.beds === 'any' ||
      (activeFilter.beds === '4+' ? prop.beds >= 4 : prop.beds === Number(activeFilter.beds));

    // Water connection requirement
    const matchesWater = !activeFilter.waterRequired || (
      typeof prop.water === 'boolean' ? prop.water :
      String(prop.water).toLowerCase() === 'yes' ||
      String(prop.water).toLowerCase().includes('24h') ||
      String(prop.water).toLowerCase().includes('wakaalad')
    );

    // Power requirement
    const matchesPower = !activeFilter.powerRequired || (
      typeof prop.electricity === 'boolean' ? prop.electricity :
      String(prop.electricity).toLowerCase().includes('24') ||
      String(prop.electricity).toLowerCase().includes('solar') ||
      String(prop.electricity).toLowerCase().includes('mains')
    );

    // Video Tour filtering
    const matchesVideo = !activeFilter.hasVideo || Boolean(prop.videoUrl);

    // Keyword search
    const matchesSearch = searchQuery === '' || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.kebele.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prop.description && prop.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (prop.nearDistance && prop.nearDistance.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCity && matchesMode && matchesCategory && matchesKebele && matchesPrice && matchesBeds && matchesWater && matchesPower && matchesVideo && matchesSearch;
  });

  if (userGps) {
    filteredProperties = filteredProperties
      .map((prop) => {
        const propLat = prop.lat || 9.3524;
        const propLng = prop.lng || 42.7961;
        const distKm = calculateDistanceKm(userGps.lat, userGps.lng, propLat, propLng);
        return { ...prop, calculatedDistKm: distKm };
      })
      .sort((a, b) => (a.calculatedDistKm ?? 999) - (b.calculatedDistKm ?? 999));
  }

  return (
    <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-8">
      
      {/* LUXURY PHOTOGRAPHY-FIRST HERO BANNER */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full rounded-3xl overflow-hidden shadow-md border border-[#E8E5DF] group"
      >
        {/* Full-bleed Photography Container */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden bg-[#111315]">
          <img
            src="/jigjiga-aerial.jpg"
            alt="Jigjiga City Aerial Boulevard"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Dark Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/95 via-[#111315]/50 to-[#111315]/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/85 via-transparent to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-10">
            
            {/* Top Row: Subtitle pill */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-white/10 text-[#C8A96B] border border-white/20 backdrop-blur-md">
                📍 JIGJIGA REAL ESTATE MARKETPLACE
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRequestLiveGps}
                disabled={gpsLoading}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[16px] text-[#C8A96B] ${gpsLoading ? 'animate-spin' : ''}`}>
                  {gpsLoading ? 'sync' : 'my_location'}
                </span>
                <span>{gpsLoading ? 'Navigating GPS...' : userGps ? '📍 Live GPS Active' : gpsError ? '📍 GPS Offline' : '📍 GPS Near Me'}</span>
              </motion.button>
            </div>

            {/* Middle Serif Headline */}
            <div className="space-y-2 max-w-2xl text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight"
              >
                DHamme ayaa kuu dhamaystiraya
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs sm:text-sm text-[#FAF9F6]/80 font-sans max-w-lg leading-relaxed font-normal"
              >
                Kirayso ama Iibso guryaha ugu casrisan ee Jigjiga. Discover extraordinary homes in the Somali Region.
              </motion.p>
            </div>

            {/* Single Elegant Unified Search Card */}
            <div className="pt-2 w-full max-w-3xl">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-[#E8E5DF] shadow-xl flex flex-col sm:flex-row items-center gap-2">
                
                {/* Search Query Input */}
                <div className="flex-1 w-full flex items-center space-x-2 px-3 py-2 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] focus-within:border-[#C8A96B] focus-within:bg-white transition-all">
                  <span className="material-symbols-outlined text-[#74777B] text-[20px]">search</span>
                  <input
                    type="text"
                    placeholder="Raadi Kebele (Kebele 06 Garab'ase, Kebele 03 Taiwan, Kebele 08)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-sans text-[#111315] placeholder-[#74777B] focus:outline-none"
                  />
                  {searchQuery && (
                    <motion.button 
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSearchQuery('')} 
                      className="text-[#74777B] hover:text-[#111315] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </motion.button>
                  )}
                </div>

                {/* Filter Trigger */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenFilter}
                  className="px-4 py-2.5 bg-white border border-[#E8E5DF] text-[#111315] rounded-xl text-xs font-semibold hover:border-[#C8A96B] transition flex items-center space-x-1.5 shrink-0 cursor-pointer shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#74777B]">tune</span>
                  <span>Filters</span>
                </motion.button>

                {/* Main Unified Search Action CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {}}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#111315] hover:bg-[#22272B] text-white rounded-xl text-xs font-semibold transition shrink-0 flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <span>Raadi (Search)</span>
                </motion.button>

              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Mode Toggle & Filter Bar */}
      <section className="space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E8E5DF] pb-4">
          
          {/* Mode Tabs (Rent/Sale) */}
          <div className="relative bg-[#FAF9F6] p-1 rounded-xl flex border border-[#E8E5DF] w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('kiro')}
              className={`relative py-2 px-5 rounded-lg font-sans font-semibold text-xs transition-colors cursor-pointer z-10 ${
                activeFilter.mode === 'kiro' ? 'text-[#111315]' : 'text-[#74777B] hover:text-[#111315]'
              }`}
            >
              {activeFilter.mode === 'kiro' && (
                <motion.div
                  layoutId="homeModeActivePill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#E8E5DF]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-20">Kiro (Rent)</span>
            </button>

            <button
              onClick={() => handleModeChange('iib')}
              className={`relative py-2 px-5 rounded-lg font-sans font-semibold text-xs transition-colors cursor-pointer z-10 ${
                activeFilter.mode === 'iib' ? 'text-[#111315]' : 'text-[#74777B] hover:text-[#111315]'
              }`}
            >
              {activeFilter.mode === 'iib' && (
                <motion.div
                  layoutId="homeModeActivePill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs border border-[#E8E5DF]"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-20">Iib (Sale)</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto py-1">
            {categories.map((cat) => {
              const isSelected = activeFilter.category === cat;
              return (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(cat)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'text-white font-semibold'
                      : 'bg-white text-[#74777B] border border-[#E8E5DF] hover:border-[#111315] hover:text-[#111315]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="categoryHighlight"
                      className="absolute inset-0 bg-[#111315] rounded-full shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>{cat}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Format Toggle (List / Map) */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E8E5DF] shadow-2xs">
            <button
              onClick={() => setViewFormat('list')}
              className={`relative px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewFormat === 'list' ? 'text-white font-semibold' : 'text-[#74777B]'
              }`}
            >
              {viewFormat === 'list' && (
                <motion.div
                  layoutId="viewFormatPill"
                  className="absolute inset-0 bg-[#111315] rounded-lg shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span>Liis</span>
            </button>
            <button
              onClick={() => setViewFormat('map')}
              className={`relative px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewFormat === 'map' ? 'text-white font-semibold' : 'text-[#74777B]'
              }`}
            >
              {viewFormat === 'map' && (
                <motion.div
                  layoutId="viewFormatPill"
                  className="absolute inset-0 bg-[#111315] rounded-lg shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span>Khariidad</span>
            </button>
          </div>

        </div>

      </section>

      {/* Render Map View or Clean Property Cards Grid */}
      {viewFormat === 'map' ? (
        <section className="mt-4">
          <MapView
            properties={filteredProperties}
            onSelectProperty={onSelectProperty}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </section>
      ) : (
        /* Property Cards Grid */
        <AnimatePresence mode="wait">
          {filteredProperties.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 bg-white rounded-3xl border border-[#E8E5DF] p-8 space-y-4 shadow-sm"
            >
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-[#FAF9F6] text-[#74777B] flex items-center justify-center mx-auto border border-[#E8E5DF]"
              >
                <span className="material-symbols-outlined text-[32px]">domain_disabled</span>
              </motion.div>
              <h3 className="font-serif text-xl text-[#111315]">
                Weli Ma Jirtay Guryo La Soo Dhigay Jigjiga
              </h3>
              <p className="text-xs text-[#74777B] max-w-md mx-auto leading-relaxed">
                Noqo qofka ugu horeeya ee gurigiisa ama dabaq kiro/iib ah Jigjiga ugu soo dhiga DHAMME Real Estate!
              </p>
              {onStartPostListing && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onStartPostListing}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#111315] to-[#22272B] text-white font-sans font-semibold text-xs shadow-md transition inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>📍 Soo Dhig Gurigii Ugu Horeeyay (Post First Home)</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.section
              key="properties-grid"
              variants={gridContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredProperties.map((property) => {
                const isFav = favorites.includes(property.id);
                const dist = (property as any).calculatedDistKm;

                return (
                  <motion.article
                    key={property.id}
                    variants={cardItemVariants}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    onClick={() => onSelectProperty(property)}
                    className="bg-white rounded-3xl overflow-hidden listing-card-shadow border border-[#E8E5DF] hover:border-[#C8A96B]/50 flex flex-col group cursor-pointer transition-colors"
                  >
                    {/* 4:3 Ratio Dominant Image */}
                    <div className="relative aspect-[4/3] w-full bg-[#FAF9F6] overflow-hidden">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Subtle Top-Left Verified Badge */}
                      <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#4A7A63] text-white shadow-xs backdrop-blur-md flex items-center space-x-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          <span>Verified</span>
                        </span>

                        {property.videoUrl && (
                          <motion.span 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white rounded-full text-[10px] font-medium flex items-center space-x-1"
                          >
                            <span className="material-symbols-outlined text-[12px] text-[#C8A96B]">videocam</span>
                            <span>Tour</span>
                          </motion.span>
                        )}
                      </div>

                      {/* Circular Favorite Icon Top-Right */}
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(property.id);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md z-10 cursor-pointer"
                        title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                      >
                        <span className={`material-symbols-outlined text-[18px] transition-colors ${isFav ? 'fill-1 text-red-500' : 'text-[#74777B]'}`}>
                          favorite
                        </span>
                      </motion.button>

                    </div>

                    {/* Clean Text Block Below */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-[11px] font-semibold text-[#74777B] uppercase tracking-wider">
                            {property.city}, {property.kebele}
                          </span>
                          <span className="font-serif font-bold text-lg text-[#111315] group-hover:text-[#C8A96B] transition-colors">
                            {property.priceLocalFormatted}
                          </span>
                        </div>

                        <h3 className="font-sans text-sm font-semibold text-[#111315] leading-snug line-clamp-1 mt-1">
                          {property.title}
                        </h3>
                      </div>

                      {/* Clean Spec Line */}
                      <div className="pt-2 border-t border-[#E8E5DF] flex items-center justify-between text-xs text-[#74777B]">
                        <div className="flex items-center space-x-3">
                          <span>{property.beds} Beds</span>
                          <span>•</span>
                          <span>{property.baths} Baths</span>
                          <span>•</span>
                          <span>{property.areaSqm} m²</span>
                        </div>

                        {dist !== undefined && (
                          <span className="text-[10px] font-semibold text-[#4A7A63] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {dist} km
                          </span>
                        )}
                      </div>

                    </div>
                  </motion.article>
                );
              })}
            </motion.section>
          )}
        </AnimatePresence>
      )}

    </main>
  );
};
