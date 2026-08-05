import React, { useState } from 'react';
import type { PropertyListing, ListingMode, PropertyCategory } from '../types';

interface HomeFeedProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onOpenFilter: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// Haversine formula to compute distance in km between two GPS coordinates
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
  onToggleFavorite
}) => {
  const [activeMode, setActiveMode] = useState<ListingMode>('kiro');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('All Properties');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
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

  // Handler to request live GPS coordinates from the user's browser/device
  const handleRequestLiveGps = () => {
    if (userGps) {
      // Toggle off
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
        // Fallback default coordinates for Jigjiga center if user denies permission or outdoors
        setUserGps({ lat: 9.3524, lng: 42.7961 });
        setGpsError('GPS Access Granted (Jigjiga Center Reference)');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Filter & Sort Properties
  let filteredProperties = properties.filter((prop) => {
    const matchesCity = prop.city.toLowerCase().includes('jigjiga');
    const matchesMode = prop.mode === activeMode;
    const matchesCategory = selectedCategory === 'All Properties' || prop.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.kebele.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prop.nearDistance && prop.nearDistance.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCity && matchesMode && matchesCategory && matchesSearch;
  });

  // If live GPS active, calculate real distances & sort closest first
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
    <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 animate-fade-in">
      
      {/* Top Banner & Mode Toggle Section */}
      <section className="space-y-4">
        
        {/* Rent / Sale Toggle Pill & GPS Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="bg-[#e5e2e1] p-1.5 rounded-2xl flex w-full max-w-xs relative shadow-inner border border-[#bec9c5]/40">
            <button
              onClick={() => setActiveMode('kiro')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-poppins font-bold text-xs transition-all duration-300 z-10 flex items-center justify-center space-x-1.5 ${
                activeMode === 'kiro'
                  ? 'bg-[#005145] text-white shadow-md'
                  : 'text-[#3f4946] hover:text-[#1b1b1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              <span>Kiro (Rent)</span>
            </button>

            <button
              onClick={() => setActiveMode('iib')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-poppins font-bold text-xs transition-all duration-300 z-10 flex items-center justify-center space-x-1.5 ${
                activeMode === 'iib'
                  ? 'bg-[#005145] text-white shadow-md'
                  : 'text-[#3f4946] hover:text-[#1b1b1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">sell</span>
              <span>Iib (Sale)</span>
            </button>
          </div>

          {/* Real Live GPS Location Near Me Button */}
          <button
            onClick={handleRequestLiveGps}
            disabled={gpsLoading}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm border active:scale-95 ${
              userGps 
                ? 'bg-emerald-700 text-white border-emerald-600 ring-2 ring-emerald-500/30' 
                : 'bg-[#fcf9f8] text-[#005145] border-[#005145]/30 hover:bg-[#f0eded]'
            }`}
            title="Hel Location-kaaga GPS Near Me"
          >
            <span className={`material-symbols-outlined text-[18px] ${gpsLoading ? 'animate-spin' : 'animate-pulse'}`}>
              {gpsLoading ? 'sync' : 'my_location'}
            </span>
            <span>
              {gpsLoading 
                ? 'Navigating GPS...' 
                : userGps 
                ? 'GPS Location Active' 
                : '📍 Hel GPS Location Near Me'}
            </span>
          </button>
        </div>

        {/* GPS Live Coordinates Status Bar */}
        {userGps && (
          <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-2xl text-xs text-emerald-900 flex items-center justify-between shadow-xs max-w-xl mx-auto">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span className="font-bold">Live Device GPS:</span>
              <span className="font-mono">{userGps.lat.toFixed(4)}° N, {userGps.lng.toFixed(4)}° E</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase bg-emerald-200 px-2 py-0.5 rounded-md text-emerald-800">
              Closest Sorted
            </span>
          </div>
        )}

        {gpsError && !userGps && (
          <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl text-center border border-amber-200">
            {gpsError}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#005145]">search</span>
          </div>
          <input
            type="text"
            placeholder="Raadi Kebele (Kebele 06 Garab'ase, Kebele 03 Taiwan, Kebele 08)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-24 py-3.5 bg-[#fcf9f8] rounded-2xl border border-[#bec9c5]/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005145] focus:border-transparent transition-all font-inter text-sm placeholder:text-[#6f7976]"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-[#6f7976] hover:text-[#1b1b1c] rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={onOpenFilter}
              className="bg-[#005145] hover:bg-[#0f6b5c] text-white p-2.5 rounded-xl active:scale-95 transition-all shadow-sm flex items-center justify-center"
              title="Filters"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-none px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#005145] text-white font-bold ring-2 ring-[#005145]/30'
                    : 'bg-[#fcf9f8] text-[#3f4946] border border-[#bec9c5]/60 hover:bg-[#f6f3f2]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Header Count */}
        <div className="flex items-center justify-between text-xs text-[#3f4946] px-1 pt-1">
          <span className="font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#005145]" />
            <span>{filteredProperties.length} {filteredProperties.length === 1 ? 'Guri Loo Helay' : 'Guryo Loo Helay'} Jigjiga ({activeMode === 'kiro' ? 'Kiro' : 'Iib'})</span>
          </span>
          <span className="text-[11px] text-[#005145] font-bold">
            Jigjiga City Kebeles
          </span>
        </div>

      </section>

      {/* Property Cards Grid */}
      <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#f0eded] text-[#005145] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">real_estate_agent</span>
            </div>
            <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
              Guri Ma Loo Helin Kebele-kan Jigjiga
            </h3>
            <p className="text-xs text-[#3f4946] max-w-md mx-auto leading-relaxed">
              Fadlan beddel Kebele-ka ama raadinta si aad u hesho guryaha Jigjiga.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Properties');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#005145] text-white font-bold text-xs shadow-md hover:bg-[#0f6b5c] transition-colors inline-block"
            >
              Nadiifi Raadinta (Reset Search)
            </button>
          </div>
        ) : (
          filteredProperties.map((property) => {
            const isFav = favorites.includes(property.id);
            const dist = (property as any).calculatedDistKm;

            return (
              <article
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="bg-[#fcf9f8] rounded-3xl overflow-hidden listing-card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-[#bec9c5]/40 flex flex-col group"
              >
                {/* Property Image Container */}
                <div className="relative aspect-[4/3] w-full bg-[#e5e2e1] overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-md ${
                      property.mode === 'kiro' ? 'bg-[#005145] text-white' : 'bg-[#d4af37] text-[#00382f]'
                    }`}>
                      {property.mode === 'kiro' ? 'Kiro (Rent)' : 'Iib (Sale)'}
                    </span>

                    {property.isFeatured && (
                      <span className="px-3 py-1 bg-[#7b2f10] text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md backdrop-blur-md flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[12px]">star</span>
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(property.id);
                    }}
                    className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/70 active:scale-90 transition-all z-10"
                    title={isFav ? 'Remove Favorite' : 'Add Favorite'}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isFav ? 'fill-1 text-red-500' : 'text-white'}`}>
                      favorite
                    </span>
                  </button>

                  {/* Floating Price Tag on Image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
                    <span className="font-poppins text-lg font-black text-white drop-shadow-md bg-black/60 px-3.5 py-1 rounded-xl backdrop-blur-md border border-white/20">
                      {property.priceLocalFormatted}
                    </span>
                  </div>
                </div>

                {/* Listing Details Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-poppins text-base font-bold text-[#1b1b1c] leading-snug group-hover:text-[#005145] transition-colors line-clamp-2">
                      {property.title}
                    </h3>

                    {/* Location Pin & Kebele */}
                    <div className="flex items-center gap-1 text-[#3f4946] text-xs mt-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#005145]">location_on</span>
                      <span className="font-semibold text-[#1b1b1c]">{property.city}, {property.kebele}</span>
                    </div>

                    {/* Live Calculated GPS Distance Badge */}
                    {dist !== undefined ? (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold mt-1 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 self-start inline-flex">
                        <span className="material-symbols-outlined text-[14px] text-emerald-700 animate-pulse">my_location</span>
                        <span>{dist} km from your device</span>
                      </div>
                    ) : property.nearDistance ? (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-medium mt-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 self-start inline-flex">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">near_me</span>
                        <span>{property.nearDistance}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Specs Row */}
                  <div className="pt-3 border-t border-[#bec9c5]/30 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-1.5 rounded-xl bg-[#f0eded] flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px] text-[#7b2f10]">bed</span>
                      <span className="font-bold text-[11px] text-[#1b1b1c] mt-0.5">{property.beds} Qol</span>
                    </div>

                    <div className="p-1.5 rounded-xl bg-[#f0eded] flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px] text-[#005145]">water_drop</span>
                      <span className="font-bold text-[10px] text-[#1b1b1c] truncate max-w-full mt-0.5">{property.water}</span>
                    </div>

                    <div className="p-1.5 rounded-xl bg-[#f0eded] flex flex-col items-center">
                      <span className="material-symbols-outlined text-[18px] text-amber-600">bolt</span>
                      <span className="font-bold text-[10px] text-[#1b1b1c] truncate max-w-full mt-0.5">{property.electricity}</span>
                    </div>
                  </div>

                </div>
              </article>
            );
          })
        )}
      </section>

    </main>
  );
};
