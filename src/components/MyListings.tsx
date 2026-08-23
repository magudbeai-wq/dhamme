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
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in bg-[#FAF9F6]">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-3xl listing-card-shadow border border-[#E8E5DF] gap-4">
        <div>
          <span className="text-[10px] font-semibold text-[#74777B] uppercase tracking-wider block">
            Landlord Analytics & Management
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#17191C]">
            Guryahayga & Dashboard-ka
          </h1>
        </div>

        <button
          onClick={onStartNewListing}
          className="px-5 py-3 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-sans font-semibold text-xs shadow-xs flex items-center justify-center space-x-2 active:scale-95 transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Soo Dhig Guri Cusub</span>
        </button>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Total Listings Card */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Guryaha</span>
            <span className="material-symbols-outlined text-[22px]">domain</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-2xl text-[#17191C]">{totalListings}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Total Listings</span>
          </div>
        </div>

        {/* Total Views Analytics Card */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#111315]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Aragtida</span>
            <span className="material-symbols-outlined text-[22px]">visibility</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-2xl text-[#17191C]">{totalViews.toLocaleString()}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Total Property Views</span>
          </div>
        </div>

        {/* Total Calls Inquiries Card */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#C8A96B]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#74777B]">Waqtiga Wacitaanka</span>
            <span className="material-symbols-outlined text-[22px]">call</span>
          </div>
          <div className="mt-3">
            <span className="font-serif font-bold text-2xl text-[#17191C]">{totalInquiries}</span>
            <span className="text-[10px] text-[#74777B] block font-normal">Direct Client Inquiries</span>
          </div>
        </div>

        {/* Sold / Rented Status Summary */}
        <div className="bg-white p-5 rounded-3xl listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between">
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
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              statusFilter === tab.id
                ? 'bg-[#111315] text-white shadow-xs'
                : 'bg-white text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Landlord Property Listings Cards */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E5DF] p-8 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] text-[#74777B] flex items-center justify-center mx-auto border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[36px]">domain</span>
          </div>
          <h3 className="font-serif font-bold text-lg text-[#17191C]">
            Weli Ma Jirto Guryo Kusoo Aaday Qeybtaan
          </h3>
          <p className="text-xs text-[#74777B] max-w-xs mx-auto">
            Soo dhig guri cusub ama beddel tab-ka si aad u aragto guryahaaga.
          </p>
          <button
            onClick={onStartNewListing}
            className="px-6 py-3 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-sans font-semibold text-xs uppercase shadow-xs transition-all active:scale-95"
          >
            Soo Dhig Guri Cusub
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((property) => {
            const currentStatus = property.status || 'active';
            const views = property.viewsCount || 45;
            const calls = property.inquiriesCount || 6;

            return (
              <article
                key={property.id}
                className="bg-white rounded-3xl overflow-hidden listing-card-shadow border border-[#E8E5DF] flex flex-col justify-between"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/60 via-transparent to-transparent" />

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
                        <span className="material-symbols-outlined text-[13px]">videocam</span>
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
                      className="font-sans text-sm font-semibold text-[#17191C] hover:text-[#C8A96B] cursor-pointer line-clamp-1"
                    >
                      {property.title}
                    </h3>
                    <span className="text-xs text-[#74777B] block mt-0.5">
                      {property.city}, {property.kebele}
                    </span>
                  </div>

                  {/* Per-Listing Analytics Stats Bar */}
                  <div className="p-2.5 bg-[#FAF9F6] rounded-xl grid grid-cols-2 gap-2 text-center text-xs border border-[#E8E5DF]">
                    <div className="flex items-center justify-center space-x-1.5 text-[#17191C]" title="Views Count">
                      <span className="material-symbols-outlined text-[18px] text-[#74777B]">visibility</span>
                      <span className="font-medium">{views} Views</span>
                    </div>

                    <div className="flex items-center justify-center space-x-1.5 text-[#17191C]" title="Calls/Inquiries">
                      <span className="material-symbols-outlined text-[18px] text-[#C8A96B]">call</span>
                      <span className="font-medium">{calls} Wacitaan</span>
                    </div>
                  </div>

                  {/* Landlord Status Action Controls */}
                  <div className="pt-2 border-t border-[#E8E5DF] space-y-2">
                    <label className="block text-[10px] font-semibold text-[#74777B] uppercase">
                      Beddel Xaalada Guriga (Change Status):
                    </label>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => onUpdateStatus(property.id, 'active')}
                        className={`py-1.5 rounded-lg font-semibold text-[10px] transition-all ${
                          currentStatus === 'active'
                            ? 'bg-[#4A7A63] text-white shadow-xs'
                            : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
                        }`}
                      >
                        🟢 Active
                      </button>

                      <button
                        onClick={() => onUpdateStatus(property.id, 'sold')}
                        className={`py-1.5 rounded-lg font-semibold text-[10px] transition-all ${
                          currentStatus === 'sold'
                            ? 'bg-[#A8453F] text-white shadow-xs'
                            : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
                        }`}
                      >
                        🔴 Waala Iibsaday
                      </button>

                      <button
                        onClick={() => onUpdateStatus(property.id, 'rented')}
                        className={`py-1.5 rounded-lg font-semibold text-[10px] transition-all ${
                          currentStatus === 'rented'
                            ? 'bg-[#C8A96B] text-[#111315] shadow-xs'
                            : 'bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] hover:border-[#111315]'
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
