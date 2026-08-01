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
    <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow">
        <div>
          <span className="text-[10px] font-bold text-[#005145] uppercase tracking-wider block">
            Guryaha Aad Calaamadsatay
          </span>
          <h1 className="font-poppins text-2xl font-bold text-[#1b1b1c]">
            Favorites ({favProperties.length})
          </h1>
        </div>

        <span className="material-symbols-outlined text-[#7b2f10] text-[32px] fill-1">
          favorite
        </span>
      </div>

      {favProperties.length === 0 ? (
        <div className="text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-6 space-y-3">
          <span className="material-symbols-outlined text-[48px] text-[#6f7976]">favorite_border</span>
          <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
            Weli Ma Jirto Guryo Aad Calaamadsatay
          </h3>
          <p className="text-xs text-[#3f4946]">
            Taabo wadnaha guryaha aad jeceshahay si aad halkan usoo dhigto.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {favProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="bg-[#fcf9f8] p-4 rounded-2xl listing-card-shadow flex gap-4 cursor-pointer hover:border hover:border-[#005145]/40 transition"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-28 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">{property.title}</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(property.id);
                      }}
                      className="text-red-500 hover:scale-110 transition"
                    >
                      <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                    </button>
                  </div>
                  <span className="text-xs text-[#005145] font-semibold">{property.city}, {property.kebele}</span>
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
