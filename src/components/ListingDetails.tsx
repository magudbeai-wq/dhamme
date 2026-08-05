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

  const lat = property.lat || 9.3524;
  const lng = property.lng || 42.7961;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const isSold = property.status === 'sold';
  const isRented = property.status === 'rented';
  const views = property.viewsCount || 45;

  return (
    <div className="min-h-screen bg-[#F2E8DC] pb-28 animate-fade-in">
      
      {/* Top Image Carousel Header */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-w-screen-lg mx-auto bg-[#e5e2e1] overflow-hidden sm:rounded-b-3xl shadow-lg">
        <img
          src={property.images[activeImgIndex] || property.images[0]}
          alt={property.title}
          className={`w-full h-full object-cover ${isSold || isRented ? 'grayscale-[30%]' : ''}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 active:scale-95 transition-all shadow-md z-10"
          title="Back"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 active:scale-95 transition-all shadow-md z-10"
          title={isFav ? 'Remove Favorite' : 'Add Favorite'}
        >
          <span className={`material-symbols-outlined text-[24px] ${isFav ? 'fill-1 text-red-500' : ''}`}>
            favorite
          </span>
        </button>

        {/* Sold / Rented Banner Overlay on Details Header Image */}
        {isSold && (
          <div className="absolute inset-0 bg-red-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <span className="material-symbols-outlined text-[48px] text-red-400 mb-1">lock</span>
            <span className="font-poppins font-black text-2xl tracking-wider text-red-200 border-2 border-red-400 px-6 py-2 rounded-2xl bg-red-900/90 shadow-2xl">
              WAALA IIBSADAY (SOLD)
            </span>
            <p className="text-xs font-bold text-red-100 mt-2 bg-black/70 px-4 py-1.5 rounded-full border border-red-400/40">
              Gurigan waa la iibsaday. Fadlan fiiri guryaha kale ee dhaw.
            </p>
          </div>
        )}

        {isRented && (
          <div className="absolute inset-0 bg-amber-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <span className="material-symbols-outlined text-[48px] text-amber-400 mb-1">key</span>
            <span className="font-poppins font-black text-2xl tracking-wider text-amber-200 border-2 border-amber-400 px-6 py-2 rounded-2xl bg-amber-900/90 shadow-2xl">
              WAALA KIREEYAY (RENTED)
            </span>
            <p className="text-xs font-bold text-amber-100 mt-2 bg-black/70 px-4 py-1.5 rounded-full border border-amber-400/40">
              Gurigan waa la kireeyay. Fadlan fiiri guryaha kale ee dhaw.
            </p>
          </div>
        )}

        {/* Gallery Thumbnails Indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20 z-10">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeImgIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-6 space-y-5">
        
        {/* Title, Badges & Views Count */}
        <div className="bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow space-y-3 border border-[#bec9c5]/40">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  property.mode === 'kiro' ? 'bg-[#005145] text-white' : 'bg-[#d4af37] text-[#00382f]'
                }`}>
                  {property.mode === 'kiro' ? 'Kiro (For Rent)' : 'Iib (For Sale)'}
                </span>

                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0f6b5c]/10 text-[#005145] border border-[#005145]/20">
                  {property.category}
                </span>

                {/* Views Count Badge */}
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f0eded] text-[#005145] border border-[#bec9c5]/40 flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>{views} Aragtida (Views)</span>
                </span>
              </div>

              <h1 className="font-poppins text-2xl font-black text-[#1b1b1c] leading-tight">
                {property.title}
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="font-poppins text-2xl font-black text-[#005145] block">
                {property.priceLocalFormatted}
              </span>
              <span className="text-[11px] text-[#6f7976] font-medium">
                {property.mode === 'kiro' ? 'Monthly Rent' : 'Total Price (Sale)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#3f4946] text-sm pt-2 border-t border-[#bec9c5]/30">
            <span className="material-symbols-outlined text-[#005145]">location_on</span>
            <span className="font-semibold">{property.city}, {property.kebele}</span>
          </div>
        </div>

        {/* GPS Location & Map Card */}
        <div className="bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow space-y-3 border border-[#bec9c5]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#005145] text-[24px]">my_location</span>
              <h3 className="font-poppins font-bold text-base text-[#1b1b1c]">
                GPS Location & Map (Jigjiga)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              GPS Verified
            </span>
          </div>

          <div className="p-3.5 bg-[#f0eded] rounded-2xl space-y-2 border border-[#bec9c5]/30 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6f7976] font-semibold">GPS Coordinates:</span>
              <span className="font-mono font-bold text-[#005145]">{property.gpsCoords || `${lat}° N, ${lng}° E`}</span>
            </div>
            {property.nearDistance && (
              <div className="flex items-center justify-between">
                <span className="text-[#6f7976] font-semibold">Proximity / Distance:</span>
                <span className="font-bold text-[#1b1b1c]">{property.nearDistance}</span>
              </div>
            )}
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-poppins font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            <span>Fur Google Maps (View Location on GPS Map)</span>
          </a>
        </div>

        {/* Specs Grid */}
        <div className="bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border border-[#bec9c5]/40">
          <div className="p-3.5 rounded-2xl bg-[#f0eded] border border-[#bec9c5]/20">
            <span className="material-symbols-outlined text-[#7b2f10] text-[28px] block mb-1">bed</span>
            <span className="font-poppins font-bold text-xs text-[#1b1b1c] block">{property.beds} Qol (Beds)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0eded] border border-[#bec9c5]/20">
            <span className="material-symbols-outlined text-[#005145] text-[28px] block mb-1">bathtub</span>
            <span className="font-poppins font-bold text-xs text-[#1b1b1c] block">{property.baths} Musqul</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0eded] border border-[#bec9c5]/20">
            <span className="material-symbols-outlined text-[#0f6b5c] text-[28px] block mb-1">water_drop</span>
            <span className="font-poppins font-bold text-xs text-[#1b1b1c] block">{property.water}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#f0eded] border border-[#bec9c5]/20">
            <span className="material-symbols-outlined text-amber-600 text-[28px] block mb-1">bolt</span>
            <span className="font-poppins font-bold text-xs text-[#1b1b1c] block">{property.electricity}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow space-y-2 border border-[#bec9c5]/40">
          <h3 className="font-poppins font-bold text-base text-[#1b1b1c]">
            Faahfaahinta Guriga (Property Description)
          </h3>
          <p className="text-xs text-[#3f4946] leading-relaxed font-medium">
            {property.description}
          </p>
        </div>

        {/* Landlord Agent Card */}
        <div className="bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#bec9c5]/40">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <img 
              src={property.agentAvatar} 
              alt={property.agentName}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#005145] shadow-sm shrink-0"
            />
            <div>
              <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">{property.agentName}</h4>
              <span className="text-xs text-[#005145] font-semibold flex items-center space-x-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#005145]">verified</span>
                <span>Verified Landlord in Jigjiga</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowContactModal(true)}
            disabled={isSold || isRented}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-poppins font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
              isSold || isRented
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-[#005145] to-[#0f6b5c] hover:brightness-110 text-white active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isSold || isRented ? 'lock' : 'call'}
            </span>
            <span>{isSold ? 'Waala Iibsaday (Sold)' : isRented ? 'Waala Kireeyay (Rented)' : 'La Xiriir Milkiilaha'}</span>
          </button>
        </div>

      </div>

      {/* Agent Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fcf9f8] max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 text-center border border-[#bec9c5]/40">
            <div className="w-16 h-16 rounded-2xl bg-[#005145] text-white flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[36px]">contact_phone</span>
            </div>

            <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
              La Xiriir Milkiilaha (Jigjiga)
            </h3>
            <p className="text-xs text-[#3f4946]">
              Wac ama fariin WhatsApp ugu dir nambarkan:
            </p>
            
            <div className="p-3.5 bg-[#f0eded] rounded-2xl font-mono font-bold text-base text-[#005145] border border-[#bec9c5]/30">
              {property.agentPhone}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${property.agentPhone}`}
                className="py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md hover:bg-[#0f6b5c] transition"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Wac Nambarka</span>
              </a>
              <button
                onClick={() => {
                  window.open(`https://wa.me/${property.agentPhone.replace(/[^0-9]/g, '')}`, '_blank');
                  setShowContactModal(false);
                }}
                className="py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md hover:bg-emerald-700 transition"
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
