import React, { useState } from 'react';
import type { PropertyListing } from '../types';

interface ListingDetailsProps {
  property: PropertyListing;
  onBack: () => void;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ListingDetails: React.FC<ListingDetailsProps> = ({
  property,
  onBack,
  isFav,
  onToggleFavorite
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2E8DC] pb-24 animate-fade-in">
      
      {/* Top Image Header Carousel */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-w-screen-lg mx-auto bg-[#e5e2e1] overflow-hidden sm:rounded-b-3xl">
        <img
          src={property.images[activeImgIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/60 transition"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/60 transition"
        >
          <span className={`material-symbols-outlined text-[24px] ${isFav ? 'fill-1 text-red-500' : ''}`}>
            favorite
          </span>
        </button>

        {/* Gallery Thumbnails row */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === activeImgIndex ? 'w-6 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="max-w-screen-md mx-auto px-5 pt-6 space-y-6">
        
        {/* Title, Badge & Price */}
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                property.mode === 'kiro' ? 'bg-[#005145] text-white' : 'bg-[#0f6b5c] text-[#99e8d5]'
              }`}>
                {property.mode === 'kiro' ? 'Kiro (For Rent)' : 'Iib (For Sale)'}
              </span>
              <h1 className="font-poppins text-2xl font-bold text-[#1b1b1c]">
                {property.title}
              </h1>
            </div>
            <div className="text-right">
              <span className="font-poppins text-2xl font-black text-[#005145]">
                {property.priceLocalFormatted}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#3f4946] text-sm">
            <span className="material-symbols-outlined text-[#005145]">location_on</span>
            <span className="font-semibold">{property.city}, {property.kebele}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow grid grid-cols-3 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-[#f0eded]">
            <span className="material-symbols-outlined text-[#7b2f10] text-[28px] block mb-1">bed</span>
            <span className="font-poppins font-bold text-sm text-[#1b1b1c]">{property.beds} Bedrooms</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#f0eded]">
            <span className="material-symbols-outlined text-[#005145] text-[28px] block mb-1">bathtub</span>
            <span className="font-poppins font-bold text-sm text-[#1b1b1c]">{property.baths} Baths</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#f0eded]">
            <span className="material-symbols-outlined text-[#0f6b5c] text-[28px] block mb-1">water_drop</span>
            <span className="font-poppins font-bold text-sm text-[#1b1b1c]">Water: {property.water}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#f0eded]">
            <span className="material-symbols-outlined text-amber-600 text-[28px] block mb-1">bolt</span>
            <span className="font-poppins font-bold text-sm text-[#1b1b1c]">Power: {property.electricity}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-2">
          <h3 className="font-poppins font-bold text-base text-[#1b1b1c]">
            Faahfaahinta Guriga (Property Description)
          </h3>
          <p className="text-xs text-[#3f4946] leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Agent Card */}
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={property.agentAvatar} 
              alt={property.agentName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#005145]"
            />
            <div>
              <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">{property.agentName}</h4>
              <span className="text-xs text-[#005145] font-semibold flex items-center space-x-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Verified Landlord in Jigjiga</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowContactModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-xs shadow-md transition flex items-center space-x-1"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>La Xiriir</span>
          </button>
        </div>

      </div>

      {/* Agent Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fcf9f8] max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 text-center">
            <span className="material-symbols-outlined text-[48px] text-[#005145]">contact_phone</span>
            <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
              La Xiriir Milkiilaha (Jigjiga)
            </h3>
            <p className="text-xs text-[#3f4946]">
              Wac ama fariin WhatsApp ugu dir telefoonka Ethiopia:
            </p>
            <div className="p-3 bg-[#f0eded] rounded-2xl font-mono font-bold text-base text-[#005145]">
              {property.agentPhone}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${property.agentPhone}`}
                className="py-3 rounded-xl bg-[#005145] text-white font-bold text-xs flex items-center justify-center space-x-1"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Wac Nambarka</span>
              </a>
              <button
                onClick={() => {
                  alert(`WhatsApp chat target: ${property.agentPhone}`);
                  setShowContactModal(false);
                }}
                className="py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="text-xs font-semibold text-[#645d54] hover:underline pt-2 block mx-auto"
            >
              Xidh (Close)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
