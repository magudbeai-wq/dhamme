import React, { useState } from 'react';
import type { PropertyListing, ListingMode, PropertyCategory } from '../types';

interface HomeFeedProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onOpenFilter: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
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

  const categories: PropertyCategory[] = [
    'All Properties',
    'Family House',
    'Single Room',
    'Studio',
    'Villa'
  ];

  const filteredProperties = properties.filter((prop) => {
    const matchesMode = prop.mode === activeMode;
    const matchesCategory = selectedCategory === 'All Properties' || prop.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.kebele.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMode && matchesCategory && matchesSearch;
  });

  return (
    <main className="max-w-screen-xl mx-auto pb-24 animate-fade-in">
      
      {/* Search & Toggles Section - Exact Stitch Layout */}
      <section className="px-5 pt-4 space-y-4">
        
        {/* Rent / Sale (Kiro / Iib) Toggle Pill */}
        <div className="flex justify-center">
          <div className="bg-[#e5e2e1] p-1 rounded-full flex w-full max-w-xs relative shadow-inner">
            <button
              onClick={() => setActiveMode('kiro')}
              className={`flex-1 py-2 px-6 rounded-full font-inter font-bold text-xs transition-all duration-300 z-10 ${
                activeMode === 'kiro'
                  ? 'bg-[#005145] text-white shadow-md'
                  : 'text-[#3f4946] hover:text-[#1b1b1c]'
              }`}
            >
              Kiro (Rent)
            </button>

            <button
              onClick={() => setActiveMode('iib')}
              className={`flex-1 py-2 px-6 rounded-full font-inter font-bold text-xs transition-all duration-300 z-10 ${
                activeMode === 'iib'
                  ? 'bg-[#005145] text-white shadow-md'
                  : 'text-[#3f4946] hover:text-[#1b1b1c]'
              }`}
            >
              Iib (Sale)
            </button>
          </div>
        </div>

        {/* Search Bar with Kebele placeholder */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#6f7976]">location_on</span>
          </div>
          <input
            type="text"
            placeholder="Search by Kebele in Jigjiga (Kebele 06, Kebele 03...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-[#fcf9f8] rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#0f6b5c] transition-all font-inter text-sm placeholder:text-[#6f7976]"
          />
          <button
            onClick={onOpenFilter}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#005145] text-white p-2 rounded-xl active:scale-95 transition-transform"
            title="Filters"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Filter Chips Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-none px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors ${
                  isSelected
                    ? 'bg-[#005145] text-white font-bold'
                    : 'bg-[#fcf9f8] text-[#3f4946] border border-[#bec9c5] hover:bg-[#f6f3f2]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </section>

      {/* Listings Feed Cards Grid */}
      <section className="px-5 mt-6 space-y-6">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-6 space-y-3">
            <span className="material-symbols-outlined text-[48px] text-[#6f7976]">real_estate_agent</span>
            <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
              Guri Ma Loo Helin Kebele-kan (No Listings Found)
            </h3>
            <p className="text-xs text-[#3f4946]">
              Fadlan beddel Kebele-ka ama raadinta si aad u hesho guryaha Jigjiga.
            </p>
          </div>
        ) : (
          filteredProperties.map((property) => {
            const isFav = favorites.includes(property.id);
            return (
              <article
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="bg-[#fcf9f8] rounded-2xl overflow-hidden listing-card-shadow transition-transform duration-200 active:scale-[0.99] cursor-pointer border border-[#bec9c5]/30 group"
              >
                {/* Property Image with Badges */}
                <div className="relative aspect-[4/3] w-full bg-[#e5e2e1]">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Kiro/Iib & Featured Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      property.mode === 'kiro' ? 'bg-[#005145] text-white' : 'bg-[#0f6b5c] text-[#99e8d5]'
                    }`}>
                      {property.mode === 'kiro' ? 'Kiro' : 'Iib'}
                    </span>

                    {property.isFeatured && (
                      <span className="px-3 py-1 bg-[#7b2f10] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Trigger */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(property.id);
                    }}
                    className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${isFav ? 'fill-1 text-red-500' : ''}`}>
                      favorite
                    </span>
                  </button>
                </div>

                {/* Listing Details Content */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-poppins text-lg font-bold text-[#1b1b1c] leading-tight group-hover:text-[#005145] transition">
                      {property.title}
                    </h3>
                    <p className="font-poppins text-lg font-bold text-[#005145] shrink-0 ml-2">
                      {property.priceLocalFormatted}
                    </p>
                  </div>

                  {/* Location Pin */}
                  <div className="flex items-center gap-1 text-[#3f4946] text-xs">
                    <span className="material-symbols-outlined text-[18px] text-[#6f7976]">location_on</span>
                    <span>{property.city}, {property.kebele}</span>
                  </div>

                  {/* Specs Row matching Stitch exact icons */}
                  <div className="pt-3 border-t border-[#bec9c5]/30 flex items-center justify-between text-xs">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-[#6f7976]" title="Water">
                        <span className="material-symbols-outlined text-[18px]">water_drop</span>
                        <span className="font-semibold text-[#1b1b1c]">{property.water}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#6f7976]" title="Electricity">
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        <span className="font-semibold text-[#1b1b1c]">{property.electricity}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[#6f7976]" title="Pool">
                        <span className="material-symbols-outlined text-[18px]">pool</span>
                        <span className="font-semibold text-[#1b1b1c]">{property.pool}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#7b2f10] font-bold">
                      <span className="material-symbols-outlined text-[18px]">bed</span>
                      <span>{property.beds} Beds</span>
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
