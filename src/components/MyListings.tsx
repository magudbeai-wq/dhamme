import React, { useState } from 'react';
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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#005145] uppercase tracking-wider block">
            Landlord Analytics & Management
          </span>
          <h1 className="font-poppins text-2xl font-black text-[#1b1b1c]">
            Guryahayga & Dashboard-ka
          </h1>
        </div>

        <button
          onClick={onStartNewListing}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#005145] to-[#0f6b5c] text-white font-poppins font-bold text-xs shadow-md flex items-center justify-center space-x-2 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Soo Dhig Guri Cusub</span>
        </button>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Listings Card */}
        <div className="bg-[#fcf9f8] p-4 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#005145]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3f4946]">Guryaha</span>
            <span className="material-symbols-outlined text-[22px]">domain</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-2xl text-[#1b1b1c]">{totalListings}</span>
            <span className="text-[10px] text-[#6f7976] block font-semibold">Total Listings</span>
          </div>
        </div>

        {/* Total Views Analytics Card */}
        <div className="bg-[#fcf9f8] p-4 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#0f6b5c]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3f4946]">Aragtida</span>
            <span className="material-symbols-outlined text-[22px]">visibility</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-2xl text-[#005145]">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-[#6f7976] block font-semibold">Total Property Views</span>
          </div>
        </div>

        {/* Total Calls Inquiries Card */}
        <div className="bg-[#fcf9f8] p-4 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#7b2f10]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3f4946]">Waqtiga Wacitaanka</span>
            <span className="material-symbols-outlined text-[22px]">call</span>
          </div>
          <div className="mt-3">
            <span className="font-poppins font-black text-2xl text-[#7b2f10]">{totalInquiries}</span>
            <span className="text-[10px] text-[#6f7976] block font-semibold">Direct Client Inquiries</span>
          </div>
        </div>

        {/* Sold / Rented Status Summary */}
        <div className="bg-[#fcf9f8] p-4 rounded-3xl listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3f4946]">Xaaladaha</span>
            <span className="material-symbols-outlined text-[22px]">sell</span>
          </div>
          <div className="mt-2 text-xs space-y-0.5">
            <div className="flex justify-between text-[11px] font-bold text-emerald-700">
              <span>Active:</span>
              <span>{activeCount}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-red-600">
              <span>Sold:</span>
              <span>{soldCount}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-amber-600">
              <span>Rented:</span>
              <span>{rentedCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Tabs for Status */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'all', label: `Dhamaan (${totalListings})` },
          { id: 'active', label: `🟢 Active (${activeCount})` },
          { id: 'sold', label: `🔴 Waala Iibsaday (${soldCount})` },
          { id: 'rented', label: `🟡 Waala Kireeyay (${rentedCount})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? 'bg-[#005145] text-white shadow-sm'
                : 'bg-[#fcf9f8] text-[#3f4946] border border-[#bec9c5]/60 hover:bg-[#f0eded]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Landlord Property Listings Cards */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f0eded] text-[#005145] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">domain</span>
          </div>
          <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
            Weli Ma Jirto Guryo Kusoo Aaday Qeybtaan
          </h3>
          <p className="text-xs text-[#3f4946] max-w-xs mx-auto">
            Soo dhig guri cusub ama beddel tab-ka si aad u aragto guryahaaga.
          </p>
          <button
            onClick={onStartNewListing}
            className="px-6 py-3.5 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-xs uppercase shadow-md transition-all active:scale-95"
          >
            Soo Dhig Guri Cusub
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((property) => {
            const currentStatus = property.status || 'active';
            const views = property.viewsCount || 45;
            const calls = property.inquiriesCount || 6;

            return (
              <article
                key={property.id}
                className="bg-[#fcf9f8] rounded-3xl overflow-hidden listing-card-shadow border border-[#bec9c5]/40 flex flex-col justify-between"
              >
                {/* Property Card Top Image */}
                <div 
                  onClick={() => onSelectProperty(property)}
                  className="relative aspect-[16/10] w-full bg-[#e5e2e1] overflow-hidden cursor-pointer group"
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Status Badge Over Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    {currentStatus === 'sold' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                        WAALA IIBSADAY (SOLD)
                      </span>
                    )}

                    {currentStatus === 'rented' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-md">
                        WAALA KIREEYAY (RENTED)
                      </span>
                    )}

                    {currentStatus === 'active' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                        ACTIVE
                      </span>
                    )}

                    {property.videoUrl && (
                      <span className="px-2.5 py-1 bg-red-600/90 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md flex items-center space-x-1 border border-red-400/40">
                        <span className="material-symbols-outlined text-[13px]">videocam</span>
                        <span>Video Tour</span>
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3">
                    <span className="font-poppins text-base font-black text-white bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md border border-white/20">
                      {property.priceLocalFormatted}
                    </span>
                  </div>
                </div>

                {/* Content & Per-Listing Analytics */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onSelectProperty(property)}
                      className="font-poppins text-base font-bold text-[#1b1b1c] hover:text-[#005145] cursor-pointer line-clamp-2"
                    >
                      {property.title}
                    </h3>
                    <span className="text-xs text-[#005145] font-semibold block mt-1">
                      {property.city}, {property.kebele}
                    </span>
                  </div>

                  {/* Per-Listing Analytics Stats Bar */}
                  <div className="p-2.5 bg-[#f0eded] rounded-2xl grid grid-cols-2 gap-2 text-center text-xs border border-[#bec9c5]/30">
                    <div className="flex items-center justify-center space-x-1.5 text-[#005145]" title="Views Count">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span className="font-bold">{views} Aragtida (Views)</span>
                    </div>

                    <div className="flex items-center justify-center space-x-1.5 text-[#7b2f10]" title="Calls/Inquiries">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      <span className="font-bold">{calls} Wacitaan</span>
                    </div>
                  </div>

                  {/* Landlord Status Action Controls */}
                  <div className="pt-2 border-t border-[#bec9c5]/30 space-y-2">
                    <label className="block text-[10px] font-bold text-[#3f4946] uppercase">
                      Beddel Xaalada Guriga (Change Property Status):
                    </label>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => onUpdateStatus(property.id, 'active')}
                        className={`py-2 rounded-xl font-bold text-[10px] transition-all ${
                          currentStatus === 'active'
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-[#e5e2e1] text-[#3f4946] hover:bg-[#d8d5d4]'
                        }`}
                      >
                        🟢 Active
                      </button>

                      <button
                        onClick={() => onUpdateStatus(property.id, 'sold')}
                        className={`py-2 rounded-xl font-bold text-[10px] transition-all ${
                          currentStatus === 'sold'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-[#e5e2e1] text-[#3f4946] hover:bg-[#d8d5d4]'
                        }`}
                      >
                        🔴 Waala Iibsaday
                      </button>

                      <button
                        onClick={() => onUpdateStatus(property.id, 'rented')}
                        className={`py-2 rounded-xl font-bold text-[10px] transition-all ${
                          currentStatus === 'rented'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-[#e5e2e1] text-[#3f4946] hover:bg-[#d8d5d4]'
                        }`}
                      >
                        🟡 Waala Kireeyay
                      </button>
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

    </main>
  );
};
