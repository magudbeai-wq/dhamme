import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { PropertyListing, ListingStatus } from '../types';

interface MyListingsProps {
  userListings: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onStartNewListing: () => void;
  onUpdateStatus: (id: string, newStatus: ListingStatus) => void;
}

export const MyListings: React.FC<MyListingsProps> = ({
  userListings,
  onSelectProperty,
  onStartNewListing,
  onUpdateStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold' | 'rented'>('all');

  // Compute landlord analytics
  const totalListings = userListings.length;
  const totalViews = userListings.reduce((sum, p) => sum + (p.viewsCount || 45), 0);
  const totalInquiries = userListings.reduce((sum, p) => sum + (p.inquiriesCount || 6), 0);
  const activeCount = userListings.filter((p) => (p.status || 'active') === 'active').length;
  const soldCount = userListings.filter((p) => p.status === 'sold').length;
  const rentedCount = userListings.filter((p) => p.status === 'rented').length;

  const filteredListings = userListings.filter((p) => {
    if (statusFilter === 'all') return true;
    return (p.status || 'active') === statusFilter;
  });

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 bg-[#FAF9F6]">
      
      {/* Dashboard Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] gap-4"
      >
        <div>
          <span className="text-[10px] font-semibold text-[#74777B] uppercase tracking-wider block">
            Landlord Analytics & Management
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#111315]">
            Guryahayga & Dashboard-ka
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartNewListing}
          className="px-5 py-3 rounded-xl bg-[#111315] hover:bg-[#22272B] text-white font-sans font-semibold text-xs shadow-md flex items-center justify-center space-x-2 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Soo Dhig Guri Cusub</span>
        </motion.button>
      </motion.div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Listings Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Guryaha</span>
            <span className="material-symbols-outlined text-[22px]">domain</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-2xl text-[#111315]">{totalListings}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Total Listings</span>
          </div>
        </motion.div>

        {/* Total Views Analytics Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Aragtida</span>
            <span className="material-symbols-outlined text-[22px]">visibility</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-2xl text-[#111315]">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Total Property Views</span>
          </div>
        </motion.div>

        {/* Total Calls Inquiries Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#C8A96B]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Wacitaanka</span>
            <span className="material-symbols-outlined text-[22px]">call</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-2xl text-[#111315]">{totalInquiries}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Direct Inquiries</span>
          </div>
        </motion.div>

        {/* Status Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -3 }}
          className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#C8A96B]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Xaaladaha</span>
            <span className="material-symbols-outlined text-[22px]">sell</span>
          </div>
          <div className="mt-2 text-xs space-y-0.5 font-sans">
            <div className="flex justify-between text-[11px] font-semibold text-[#4A7A63]">
              <span>Active:</span>
              <span>{activeCount}</span>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-[#A8453F]">
              <span>Sold:</span>
              <span>{soldCount}</span>
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-[#C8A96B]">
              <span>Rented:</span>
              <span>{rentedCount}</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Filter Tabs for Status */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'all', label: `Dhamaan (${totalListings})` },
          { id: 'active', label: `🟢 Active (${activeCount})` },
          { id: 'sold', label: `🔴 Waala Iibsaday (${soldCount})` },
          { id: 'rented', label: `🟡 Waala Kireeyay (${rentedCount})` }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === tab.id
                ? 'text-white font-semibold'
                : 'bg-white text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
            }`}
          >
            {statusFilter === tab.id && (
              <motion.div
                layoutId="myListingsStatusTab"
                className="absolute inset-0 bg-[#111315] rounded-full shadow-xs -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              />
            )}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Landlord Property Listings Cards */}
      <AnimatePresence mode="wait">
        {filteredListings.length === 0 ? (
          <motion.div 
            key="empty-mylistings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF] p-8 space-y-4 shadow-xs"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] text-[#74777B] flex items-center justify-center mx-auto border border-[#E8E5DF]">
              <span className="material-symbols-outlined text-[36px]">domain</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#111315]">
              Weli Ma Jirto Guryo Kusoo Aaday Qeybtaan
            </h3>
            <p className="text-xs text-[#74777B] max-w-xs mx-auto">
              Soo dhig guri cusub ama beddel tab-ka si aad u aragto guryahaaga.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onStartNewListing}
              className="px-6 py-3 rounded-xl bg-[#111315] hover:bg-[#22272B] text-white font-sans font-semibold text-xs uppercase shadow-xs transition-all cursor-pointer"
            >
              Soo Dhig Guri Cusub
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="mylistings-grid"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredListings.map((property) => {
              const currentStatus = property.status || 'active';
              const views = property.viewsCount || 45;
              const calls = property.inquiriesCount || 6;

              return (
                <motion.article
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-3xl overflow-hidden listing-card-shadow border border-[#E8E5DF] hover:border-[#C8A96B]/50 flex flex-col justify-between transition-colors"
                >
                  {/* Property Card Top Image */}
                  <div 
                    onClick={() => onSelectProperty(property)}
                    className="relative aspect-[4/3] w-full bg-[#FAF9F6] overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/60 via-transparent to-transparent pointer-events-none" />

                    {/* Status Badge Over Image */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      {currentStatus === 'sold' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#A8453F] text-white shadow-xs">
                          WAALA IIBSADAY (SOLD)
                        </span>
                      )}

                      {currentStatus === 'rented' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#C8A96B] text-[#111315] shadow-xs">
                          WAALA KIREEYAY (RENTED)
                        </span>
                      )}

                      {currentStatus === 'active' && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#4A7A63] text-white shadow-xs">
                          ACTIVE
                        </span>
                      )}

                      {property.videoUrl && (
                        <span className="px-2.5 py-1 bg-black/60 text-white rounded-full text-[10px] font-medium flex items-center space-x-1 border border-white/20">
                          <span className="material-symbols-outlined text-[13px] text-[#C8A96B]">videocam</span>
                          <span>Video Tour</span>
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="font-serif text-base font-bold text-white bg-[#111315]/90 px-3 py-1 rounded-xl border border-white/20">
                        {property.priceLocalFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Content & Per-Listing Analytics */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => onSelectProperty(property)}
                        className="font-sans text-sm font-semibold text-[#111315] hover:text-[#C8A96B] cursor-pointer line-clamp-1"
                      >
                        {property.title}
                      </h3>
                      <span className="text-xs text-[#74777B] block mt-0.5">
                        {property.city}, {property.kebele}
                      </span>
                    </div>

                    {/* Per-Listing Analytics Stats Bar */}
                    <div className="p-2.5 bg-[#FAF9F6] rounded-xl grid grid-cols-2 gap-2 text-center text-xs border border-[#E8E5DF]">
                      <div className="flex items-center justify-center space-x-1.5 text-[#111315]" title="Views Count">
                        <span className="material-symbols-outlined text-[18px] text-[#74777B]">visibility</span>
                        <span className="font-medium">{views} Views</span>
                      </div>

                      <div className="flex items-center justify-center space-x-1.5 text-[#111315]" title="Calls/Inquiries">
                        <span className="material-symbols-outlined text-[18px] text-[#C8A96B]">call</span>
                        <span className="font-medium">{calls} Inquiries</span>
                      </div>
                    </div>

                    {/* Landlord Status Action Controls */}
                    <div className="pt-2 border-t border-[#E8E5DF] space-y-2">
                      <label className="block text-[10px] font-semibold text-[#74777B] uppercase">
                        Beddel Xaalada Guriga:
                      </label>

                      <div className="grid grid-cols-3 gap-1.5">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onUpdateStatus(property.id, 'active')}
                          className={`py-1.5 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                            currentStatus === 'active'
                              ? 'bg-[#4A7A63] text-white shadow-xs'
                              : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
                          }`}
                        >
                          🟢 Active
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onUpdateStatus(property.id, 'sold')}
                          className={`py-1.5 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                            currentStatus === 'sold'
                              ? 'bg-[#A8453F] text-white shadow-xs'
                              : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
                          }`}
                        >
                          🔴 Iibsaday
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onUpdateStatus(property.id, 'rented')}
                          className={`py-1.5 rounded-lg font-semibold text-[10px] transition-all cursor-pointer ${
                            currentStatus === 'rented'
                              ? 'bg-[#C8A96B] text-[#111315] shadow-xs'
                              : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
                          }`}
                        >
                          🟡 Kireeyay
                        </motion.button>
                      </div>
                    </div>

                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};
