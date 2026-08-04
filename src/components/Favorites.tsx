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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40">
        <div>
          <span className="text-[10px] font-extrabold text-[#005145] uppercase tracking-wider block">
            Guryaha Aad Calaamadsatay
          </span>
          <h1 className="font-poppins text-2xl font-black text-[#1b1b1c]">
            Favorites ({favProperties.length})
          </h1>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
          <span className="material-symbols-outlined text-[28px] fill-1">
            favorite
          </span>
        </div>
      </div>

      {favProperties.length === 0 ? (
        <div className="text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-8 space-y-3 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f0eded] text-red-500 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">favorite_border</span>
          </div>
          <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
            Weli Ma Jirto Guryo Aad Calaamadsatay
          </h3>
          <p className="text-xs text-[#3f4946] max-w-xs mx-auto">
            Taabo wadnaha guryaha aad jeceshahay si aad halkan usoo dhigto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="bg-[#fcf9f8] p-4 rounded-3xl listing-card-shadow flex gap-4 cursor-pointer border border-[#bec9c5]/40 hover:border-[#005145] transition-all hover:-translate-y-0.5"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-28 h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-poppins font-bold text-sm text-[#1b1b1c] line-clamp-1">{property.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property.id);
                      }}
                      className="text-red-500 hover:scale-110 active:scale-95 transition-all p-1"
                    >
                      <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                    </button>
                  </div>
                  <span className="text-xs text-[#005145] font-semibold block">{property.city}, {property.kebele}</span>
                </div>
                <div className="font-poppins font-black text-sm text-[#005145]">
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
