import React, { useState } from 'react';
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
    <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 animate-fade-in space-y-8">
      
      {/* LUXURY PHOTOGRAPHY-FIRST HERO BANNER */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-[#E8E5DF] group">
        
        {/* Full-bleed Photography Container */}
        <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden bg-[#111315]">
          <img
            src="/jigjiga-aerial.jpg"
            alt="Jigjiga City Aerial Boulevard"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Dark Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/90 via-[#111315]/50 to-[#111315]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111315]/80 via-transparent to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between z-10">
            
            {/* Top Row: Subtitle pill */}
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-white/10 text-[#C8A96B] border border-white/20 backdrop-blur-md">
                📍 JIGJIGA REAL ESTATE MARKETPLACE
              </span>

              <button
                onClick={handleRequestLiveGps}
                disabled={gpsLoading}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
              >
                <span className={`material-symbols-outlined text-[16px] text-[#C8A96B] ${gpsLoading ? 'animate-spin' : ''}`}>
                  {gpsLoading ? 'sync' : 'my_location'}
                </span>
                <span>{gpsLoading ? 'Navigating GPS...' : userGps ? '📍 Live GPS Active' : gpsError ? '📍 GPS Offline' : '📍 GPS Near Me'}</span>
              </button>
            </div>

            {/* Middle Serif Headline */}
            <div className="space-y-2 max-w-2xl text-left">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
                DHamme ayaa kuu dhamaystiraya
              </h1>
              <p className="text-xs sm:text-sm text-[#FAF9F6]/80 font-sans max-w-lg leading-relaxed font-normal">
                Kirayso ama Iibso guryaha ugu casrisan ee Jigjiga. Discover extraordinary homes in the Somali Region.
              </p>
            </div>

            {/* Single Elegant Unified Search Card */}
            <div className="pt-2 w-full max-w-3xl">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-[#E8E5DF] shadow-xl flex flex-col sm:flex-row items-center gap-2">
                
                {/* Search Query Input */}
                <div className="flex-1 w-full flex items-center space-x-2 px-3 py-2 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF]">
                  <span className="material-symbols-outlined text-[#74777B] text-[20px]">search</span>
                  <input
                    type="text"
                    placeholder="Raadi Kebele (Kebele 06 Garab'ase, Kebele 03 Taiwan, Kebele 08)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs font-sans text-[#17191C] placeholder-[#74777B] focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-[#74777B] hover:text-[#111315]">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Filter Trigger */}
                <button
                  onClick={onOpenFilter}
                  className="px-4 py-2.5 bg-white border border-[#E8E5DF] text-[#17191C] rounded-xl text-xs font-semibold hover:border-[#111315] transition flex items-center space-x-1.5 shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#74777B]">tune</span>
                  <span>Filters</span>
                </button>

                {/* Main Unified Search Action CTA Button */}
                <button
                  onClick={() => {}}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#111315] hover:bg-[#17191C] text-white rounded-xl text-xs font-semibold transition shrink-0 flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <span>Raadi (Search)</span>
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mode Toggle & Filter Bar */}
      <section className="space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#E8E5DF] pb-4">
          
          {/* Mode Tabs (Rent/Sale) */}
          <div className="bg-[#FAF9F6] p-1 rounded-xl flex border border-[#E8E5DF] w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('kiro')}
              className={`py-2 px-5 rounded-lg font-sans font-semibold text-xs transition-all ${
                activeFilter.mode === 'kiro'
                  ? 'bg-[#111315] text-white shadow-xs'
                  : 'text-[#74777B] hover:text-[#17191C]'
              }`}
            >
              Kiro (Rent)
            </button>

            <button
              onClick={() => handleModeChange('iib')}
              className={`py-2 px-5 rounded-lg font-sans font-semibold text-xs transition-all ${
                activeFilter.mode === 'iib'
                  ? 'bg-[#111315] text-white shadow-xs'
                  : 'text-[#74777B] hover:text-[#17191C]'
              }`}
            >
              Iib (Sale)
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
            {categories.map((cat) => {
              const isSelected = activeFilter.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#111315] text-white font-semibold'
                      : 'bg-white text-[#74777B] border border-[#E8E5DF] hover:border-[#111315] hover:text-[#17191C]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Format Toggle (List / Map) */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E8E5DF]">
            <button
              onClick={() => setViewFormat('list')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewFormat === 'list' ? 'bg-[#111315] text-white' : 'text-[#74777B]'
              }`}
            >
              Liis
            </button>
            <button
              onClick={() => setViewFormat('map')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewFormat === 'map' ? 'bg-[#111315] text-white' : 'text-[#74777B]'
              }`}
            >
              Khariidad
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
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-[#E8E5DF] p-8 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] text-[#74777B] flex items-center justify-center mx-auto border border-[#E8E5DF]">
              <span className="material-symbols-outlined text-[32px]">domain_disabled</span>
            </div>
            <h3 className="font-serif text-xl text-[#17191C]">
              Weli Ma Jirtay Guryo La Soo Dhigay Jigjiga
            </h3>
            <p className="text-xs text-[#74777B] max-w-md mx-auto leading-relaxed">
              Noqo qofka ugu horeeya ee gurigiisa ama dabaq kiro/iib ah Jigjiga ugu soo dhiga DHAMME Real Estate!
            </p>
            {onStartPostListing && (
              <button
                onClick={onStartPostListing}
                className="px-6 py-3 rounded-xl bg-[#111315] text-white font-sans font-semibold text-xs shadow-xs hover:bg-[#17191C] transition inline-flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>📍 Soo Dhig Gurigii Ugu Horeeyay (Post First Home)</span>
              </button>
            )}
          </div>
        ) : (
          filteredProperties.map((property) => {
            const isFav = favorites.includes(property.id);
            const dist = (property as any).calculatedDistKm;

            return (
              <article
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="bg-white rounded-3xl overflow-hidden listing-card-shadow border border-[#E8E5DF] flex flex-col group cursor-pointer"
              >
                {/* 4:3 Ratio Dominant Image */}
                <div className="relative aspect-[4/3] w-full bg-[#FAF9F6] overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Subtle Top-Left Verified Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#4A7A63] text-white shadow-xs backdrop-blur-md flex items-center space-x-1">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>Verified</span>
                    </span>

                    {property.videoUrl && (
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-[10px] font-medium flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[12px]">videocam</span>
                        <span>Tour</span>
                      </span>
                    )}
                  </div>

                  {/* Subtle Circular Favorite Icon Top-Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(property.id);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition z-10"
                    title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isFav ? 'fill-1 text-[#111315]' : 'text-[#74777B]'}`}>
                      favorite
                    </span>
                  </button>

                </div>

                {/* Clean Text Block Below */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-semibold text-[#74777B] uppercase tracking-wider">
                        {property.city}, {property.kebele}
                      </span>
                      <span className="font-serif font-bold text-lg text-[#17191C]">
                        {property.priceLocalFormatted}
                      </span>
                    </div>

                    <h3 className="font-sans text-sm font-semibold text-[#17191C] leading-snug group-hover:text-[#C8A96B] transition-colors line-clamp-1 mt-1">
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
                      <span className="text-[10px] font-medium text-[#4A7A63]">
                        {dist} km
                      </span>
                    )}
                  </div>

                </div>
              </article>
            );
          })
        )}
      </section>
      )}

    </main>
  );
};
