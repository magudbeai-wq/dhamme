import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 bg-[#FAF9F6]">
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF]"
      >
        <div>
          <span className="text-[10px] font-semibold text-[#74777B] uppercase tracking-wider block">
            Guryaha Aad Calaamadsatay
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#111315]">
            Favorites ({favProperties.length})
          </h1>
        </div>

        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100"
        >
          <span className="material-symbols-outlined text-[22px] fill-1">
            favorite
          </span>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {favProperties.length === 0 ? (
          <motion.div 
            key="empty-favs"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF] p-8 space-y-3 shadow-xs"
          >
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-[#FAF9F6] text-[#74777B] flex items-center justify-center mx-auto border border-[#E8E5DF]"
            >
              <span className="material-symbols-outlined text-[32px]">favorite_border</span>
            </motion.div>
            <h3 className="font-serif text-lg text-[#111315]">
              Weli Ma Jirto Guryo Aad Calaamadsatay
            </h3>
            <p className="text-xs text-[#74777B] max-w-xs mx-auto">
              Taabo wadnaha guryaha aad jeceshahay si aad halkan usoo dhigto.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="favs-grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {favProperties.map((property) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => onSelectProperty(property)}
                className="bg-white p-4 rounded-3xl listing-card-shadow flex gap-4 cursor-pointer border border-[#E8E5DF] hover:border-[#C8A96B] transition-colors"
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-28 h-24 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-sans font-semibold text-sm text-[#111315] line-clamp-1">{property.title}</h4>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(property.id);
                        }}
                        className="text-red-500 p-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px] fill-1">favorite</span>
                      </motion.button>
                    </div>
                    <span className="text-xs text-[#74777B] font-normal block mt-0.5">{property.city}, {property.kebele}</span>
                  </div>
                  <div className="font-serif font-bold text-sm text-[#111315]">
                    {property.priceLocalFormatted}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
