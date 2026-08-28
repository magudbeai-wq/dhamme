import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PropertyListing } from '../types';

interface MapViewProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// Preset Jigjiga Neighborhood Center Coordinates & Landmarks
const NEIGHBORHOOD_ZONES = [
  { name: 'Kebele 06 (Garab\'ase)', lat: 9.3580, lng: 42.7980, color: 'bg-[#C8A96B]' },
  { name: 'Kebele 04 (Taiwan Market)', lat: 9.3510, lng: 42.7930, color: 'bg-[#111315]' },
  { name: 'Kebele 02 (Jigjiga Univ.)', lat: 9.3450, lng: 42.8050, color: 'bg-[#4A7A63]' },
  { name: 'Kebele 03 (Airport Road)', lat: 9.3620, lng: 42.7880, color: 'bg-[#8A5A36]' },
  { name: 'Kebele 01 (City Center)', lat: 9.3524, lng: 42.7961, color: 'bg-[#C8A96B]' }
];

export const MapView: React.FC<MapViewProps> = ({
  properties,
  onSelectProperty,
  favorites,
  onToggleFavorite
}) => {
  const [selectedProp, setSelectedProp] = useState<PropertyListing | null>(
    properties.length > 0 ? properties[0] : null
  );
  const [selectedZone, setSelectedZone] = useState<string>('All');

  // Filter properties by selected neighborhood zone if active
  const displayedProperties = properties.filter((p) => {
    if (selectedZone === 'All') return true;
    return p.kebele.toLowerCase().includes(selectedZone.toLowerCase()) ||
           p.title.toLowerCase().includes(selectedZone.toLowerCase());
  });

  return (
    <div className="w-full space-y-4">
      
      {/* Map Control Toolbar & Neighborhood Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <div className="flex items-center gap-2 py-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedZone('All')}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
              selectedZone === 'All'
                ? 'text-white'
                : 'bg-white text-[#74777B] hover:text-[#111315] border border-[#E8E5DF]'
            }`}
          >
            {selectedZone === 'All' && (
              <motion.div
                layoutId="mapZoneActivePill"
                className="absolute inset-0 bg-[#111315] rounded-full shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>📍 All Jigjiga Zones ({properties.length})</span>
          </motion.button>
          
          {NEIGHBORHOOD_ZONES.map((zone) => {
            const isSelected = selectedZone.includes(zone.name.split(' ')[0]);
            return (
              <motion.button
                key={zone.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedZone(zone.name.split(' ')[0])}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'text-white font-semibold'
                    : 'bg-white text-[#74777B] hover:text-[#111315] border border-[#E8E5DF]'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="mapZoneActivePill"
                    className="absolute inset-0 bg-[#111315] rounded-full shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{zone.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Interactive Map Visual Stage Container */}
      <div className="relative w-full h-[520px] rounded-3xl bg-[#EFECE6] border border-[#E8E5DF] overflow-hidden shadow-xl">
        
        {/* Map Vector Grid & Pattern Background */}
        <div 
          className="absolute inset-0 opacity-25 bg-[radial-[#C8A96B]_1px,transparent_1px] [background-size:24px_24px] pointer-events-none" 
        />

        {/* Top Floating Map Header Info */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/60 shadow-md">
            <span className="material-symbols-outlined text-[#C8A96B] text-[20px] animate-pulse">
              location_on
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#111315] leading-none font-serif">
                Jigjiga Interactive Map
              </h4>
              <span className="text-[10px] text-[#74777B] font-medium">
                {displayedProperties.length} active listings on map
              </span>
            </div>
          </div>

          <div className="bg-[#111315] text-[#C8A96B] border border-[#C8A96B]/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C8A96B] animate-ping" />
            <span>LIVE GPS GRID</span>
          </div>
        </div>

        {/* Neighborhood Overlay Labels on Map */}
        {NEIGHBORHOOD_ZONES.map((zone, idx) => {
          const leftPercent = 15 + (idx * 18);
          const topPercent = 20 + ((idx % 3) * 22);

          return (
            <div
              key={zone.name}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70"
            >
              <div className="flex items-center gap-1 bg-[#111315]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                <span className={`w-2 h-2 rounded-full ${zone.color}`} />
                <span>{zone.name}</span>
              </div>
            </div>
          );
        })}

        {/* Interactive Property Price Marker Pins */}
        <div className="absolute inset-0 p-8 z-20 overflow-hidden">
          {displayedProperties.map((prop, index) => {
            const isSelected = selectedProp?.id === prop.id;
            const isFav = favorites.includes(prop.id);
            
            const col = index % 4;
            const row = Math.floor(index / 4) % 3;
            const leftPos = 12 + col * 23 + (index % 2 ? 5 : 0);
            const topPos = 25 + row * 24 + (index % 3 ? 8 : 0);

            const formatPriceShort = (price: number) => {
              if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M ETB`;
              if (price >= 1000) return `${(price / 1000).toFixed(0)}k ETB`;
              return `${price} ETB`;
            };

            return (
              <motion.button
                key={prop.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.12, zIndex: 40 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProp(prop)}
                style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all ${
                  isSelected ? 'z-40 scale-110' : 'z-20'
                }`}
              >
                {/* Price Marker Tag Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-[#111315] text-[#C8A96B] border-[#C8A96B] ring-4 ring-[#C8A96B]/30'
                      : prop.mode === 'iib'
                      ? 'bg-white text-[#111315] border-[#C8A96B]'
                      : 'bg-white text-[#111315] border-[#E8E5DF] hover:border-[#111315]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#C8A96B]">
                    {prop.mode === 'iib' ? 'sell' : 'key'}
                  </span>
                  <span>{formatPriceShort(prop.priceEtb)}</span>
                  
                  {isFav && (
                    <span className="material-symbols-outlined text-red-500 text-[14px] fill-1">
                      favorite
                    </span>
                  )}
                </div>

                {/* Marker Pin Pointer Down Tail */}
                <div
                  className={`w-2.5 h-2.5 mx-auto -mt-1 rotate-45 transition-colors ${
                    isSelected ? 'bg-[#111315]' : 'bg-white'
                  }`}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Selected Property Floating Preview Card */}
        <AnimatePresence>
          {selectedProp && (
            <motion.div 
              key={selectedProp.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="absolute bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-[#E8E5DF]"
            >
              <div className="flex gap-3 sm:gap-4 items-center">
                
                {/* Thumbnail Image */}
                <div 
                  onClick={() => onSelectProperty(selectedProp)}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#FAF9F6] shrink-0 relative cursor-pointer group"
                >
                  <img
                    src={selectedProp.images[0]}
                    alt={selectedProp.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className={`absolute top-1.5 left-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md text-white ${
                    selectedProp.mode === 'iib' ? 'bg-[#C8A96B] text-[#111315]' : 'bg-[#111315]'
                  }`}>
                    {selectedProp.mode === 'iib' ? 'IIB' : 'KIRO'}
                  </span>
                </div>

                {/* Property Details Brief */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-semibold text-[#4A7A63] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {selectedProp.kebele}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(selectedProp.id);
                      }}
                      className="p-1 text-[#74777B] hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${favorites.includes(selectedProp.id) ? 'fill-1 text-red-500' : ''}`}>
                        favorite
                      </span>
                    </motion.button>
                  </div>

                  <h3 
                    onClick={() => onSelectProperty(selectedProp)}
                    className="font-sans font-semibold text-sm text-[#111315] truncate mt-1 cursor-pointer hover:text-[#C8A96B] transition-colors"
                  >
                    {selectedProp.title}
                  </h3>

                  <div className="text-base font-serif font-bold text-[#111315] mt-0.5">
                    {selectedProp.priceLocalFormatted}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-3 text-xs text-[#74777B] mt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-[#111315]">bed</span>
                      {selectedProp.beds} Beds
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-[#111315]">bathtub</span>
                      {selectedProp.baths} Baths
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-[#111315]">square_foot</span>
                      {selectedProp.areaSqm} m²
                    </span>
                  </div>

                  {/* View Details CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectProperty(selectedProp)}
                    className="mt-2.5 w-full py-2 rounded-xl bg-[#111315] text-white font-semibold text-xs hover:bg-[#22272B] transition-all flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <span>Fiiri Faahfaahinta (View Details)</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </motion.button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
