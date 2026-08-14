import React, { useState } from 'react';
import type { PropertyListing } from '../types';

interface MapViewProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

// Preset Jigjiga Neighborhood Center Coordinates & Landmarks
const NEIGHBORHOOD_ZONES = [
  { name: 'Kebele 06 (Garab\'ase)', lat: 9.3580, lng: 42.7980, color: 'bg-emerald-600' },
  { name: 'Kebele 04 (Taiwan Market)', lat: 9.3510, lng: 42.7930, color: 'bg-amber-600' },
  { name: 'Kebele 02 (Jigjiga Univ.)', lat: 9.3450, lng: 42.8050, color: 'bg-blue-600' },
  { name: 'Kebele 03 (Airport Road)', lat: 9.3620, lng: 42.7880, color: 'bg-purple-600' },
  { name: 'Kebele 01 (City Center)', lat: 9.3524, lng: 42.7961, color: 'bg-[#005145]' }
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
    <div className="w-full space-y-4 animate-fade-in">
      
      {/* Map Control Toolbar & Neighborhood Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedZone('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              selectedZone === 'All'
                ? 'bg-[#005145] text-white ring-2 ring-[#005145]/30'
                : 'bg-white text-[#645d54] hover:bg-[#ebe1d5] border border-[#bec9c5]/40'
            }`}
          >
            📍 All Jigjiga Zones ({properties.length})
          </button>
          
          {NEIGHBORHOOD_ZONES.map((zone) => (
            <button
              key={zone.name}
              onClick={() => setSelectedZone(zone.name.split(' ')[0])}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedZone.includes(zone.name.split(' ')[0])
                  ? 'bg-[#005145] text-white font-bold ring-2 ring-[#005145]/30'
                  : 'bg-white text-[#3f4946] hover:bg-[#ebe1d5] border border-[#bec9c5]/40'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Visual Stage Container */}
      <div className="relative w-full h-[520px] rounded-3xl bg-[#ded4c5] border border-[#bec9c5]/60 overflow-hidden shadow-xl listing-card-shadow">
        
        {/* Map Vector Grid & Satellite Pattern Background */}
        <div 
          className="absolute inset-0 opacity-40 bg-[radial-[#005145]_1px,transparent_1px] [background-size:24px_24px] pointer-events-none" 
        />

        {/* Top Floating Map Header Info */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/60 shadow-md">
            <span className="material-symbols-outlined text-[#005145] text-[20px] animate-pulse">
              location_on
            </span>
            <div>
              <h4 className="text-xs font-bold text-[#1b1b1c] leading-none font-poppins">
                Jigjiga Interactive Real Estate Map
              </h4>
              <span className="text-[10px] text-[#645d54] font-medium">
                {displayedProperties.length} active listings on map
              </span>
            </div>
          </div>

          <div className="bg-[#005145] text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE GPS GRID</span>
          </div>
        </div>

        {/* Neighborhood Overlay Labels on Map */}
        {NEIGHBORHOOD_ZONES.map((zone, idx) => {
          // Calculate grid positioning relative coordinates
          const leftPercent = 15 + (idx * 18);
          const topPercent = 20 + ((idx % 3) * 22);

          return (
            <div
              key={zone.name}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
            >
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20">
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
            
            // Generate distributed pseudo-lat/lng offsets for visual pin layout
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
              <button
                key={prop.id}
                onClick={() => setSelectedProp(prop)}
                style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                  isSelected ? 'z-40 scale-110' : 'z-20 hover:scale-105 hover:z-30'
                }`}
              >
                {/* Price Marker Tag Pill */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-xl font-poppins text-xs font-black transition-all border ${
                    isSelected
                      ? 'bg-[#005145] text-white border-emerald-400 ring-4 ring-[#005145]/30'
                      : prop.mode === 'iib'
                      ? 'bg-[#7b2f10] text-white border-amber-300'
                      : 'bg-white text-[#005145] border-[#bec9c5]/60 hover:bg-[#005145] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {prop.mode === 'iib' ? 'sell' : 'key'}
                  </span>
                  <span>{formatPriceShort(prop.priceEtb)}</span>
                  
                  {isFav && (
                    <span className="material-symbols-outlined text-red-400 text-[14px] fill-1">
                      favorite
                    </span>
                  )}
                </div>

                {/* Marker Pin Pointer Down Tail */}
                <div
                  className={`w-2.5 h-2.5 mx-auto -mt-1 rotate-45 transition-colors ${
                    isSelected
                      ? 'bg-[#005145]'
                      : prop.mode === 'iib'
                      ? 'bg-[#7b2f10]'
                      : 'bg-white'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Selected Property Floating Preview Card (Bottom Drawer Card) */}
        {selectedProp && (
          <div className="absolute bottom-3 left-3 right-3 z-40 bg-white/95 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-[#bec9c5]/60 animate-fade-in">
            <div className="flex gap-3 sm:gap-4 items-center">
              
              {/* Thumbnail Image */}
              <div 
                onClick={() => onSelectProperty(selectedProp)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative cursor-pointer group"
              >
                <img
                  src={selectedProp.images[0]}
                  alt={selectedProp.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <span className={`absolute top-1.5 left-1.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-md text-white ${
                  selectedProp.mode === 'iib' ? 'bg-[#7b2f10]' : 'bg-[#005145]'
                }`}>
                  {selectedProp.mode === 'iib' ? 'IIB' : 'KIRO'}
                </span>
              </div>

              {/* Property Details Brief */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-[#005145] bg-[#005145]/10 px-2 py-0.5 rounded-md">
                    {selectedProp.kebele}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(selectedProp.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${favorites.includes(selectedProp.id) ? 'fill-1 text-red-500' : ''}`}>
                      favorite
                    </span>
                  </button>
                </div>

                <h3 
                  onClick={() => onSelectProperty(selectedProp)}
                  className="font-poppins font-bold text-sm text-[#1b1b1c] truncate mt-1 cursor-pointer hover:text-[#005145] transition-colors"
                >
                  {selectedProp.title}
                </h3>

                <div className="text-base font-black font-poppins text-[#005145] mt-0.5">
                  {selectedProp.priceLocalFormatted}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3 text-xs text-[#645d54] mt-1">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-[#005145]">bed</span>
                    {selectedProp.beds} Beds
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-[#005145]">bathtub</span>
                    {selectedProp.baths} Baths
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-[#005145]">square_foot</span>
                    {selectedProp.areaSqm} m²
                  </span>
                </div>

                {/* View Details CTA Button */}
                <button
                  onClick={() => onSelectProperty(selectedProp)}
                  className="mt-2.5 w-full py-2 rounded-xl bg-[#005145] text-white font-bold text-xs hover:bg-[#0f6b5c] transition-all flex items-center justify-center space-x-1 shadow-sm"
                >
                  <span>Fiiri Faahfaahinta (View Details)</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
