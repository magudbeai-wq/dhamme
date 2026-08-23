import React from 'react';
import type { PropertyListing } from '../types';

interface FavoritesProps {
  favoriteIds: string[];
  allProperties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onToggleFavorite: (id: string) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({
  favoriteIds,
  allProperties,
  onSelectProperty,
  onToggleFavorite
}) => {
  const favProperties = allProperties.filter((p) => favoriteIds.includes(p.id));

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in bg-[#FAF9F6]">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF]">
        <div>
          <span className="text-[10px] font-semibold text-[#74777B] uppercase tracking-wider block">
            Guryaha Aad Calaamadsatay
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#17191C]">
            Favorites ({favProperties.length})
          </h1>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#111315] flex items-center justify-center border border-[#E8E5DF]">
          <span className="material-symbols-outlined text-[22px] fill-1">
            favorite
          </span>
        </div>
      </div>

      {favProperties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF] p-8 space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] text-[#74777B] flex items-center justify-center mx-auto border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[32px]">favorite_border</span>
          </div>
          <h3 className="font-serif text-lg text-[#17191C]">
            Weli Ma Jirto Guryo Aad Calaamadsatay
          </h3>
          <p className="text-xs text-[#74777B] max-w-xs mx-auto">
            Taabo wadnaha guryaha aad jeceshahay si aad halkan usoo dhigto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="bg-white p-4 rounded-3xl listing-card-shadow flex gap-4 cursor-pointer border border-[#E8E5DF] hover:border-[#111315] transition-all hover:-translate-y-0.5"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-28 h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-sans font-semibold text-sm text-[#17191C] line-clamp-1">{property.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property.id);
                      }}
                      className="text-[#111315] hover:scale-110 active:scale-95 transition-all p-1"
                    >
                      <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                    </button>
                  </div>
                  <span className="text-xs text-[#74777B] font-normal block mt-0.5">{property.city}, {property.kebele}</span>
                </div>
                <div className="font-serif font-bold text-sm text-[#17191C]">
                  {property.priceLocalFormatted}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
