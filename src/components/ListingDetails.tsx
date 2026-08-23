import React, { useState } from 'react';
import type { PropertyListing, UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';
import { LeaseAgreementModal } from './LeaseAgreementModal';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';

interface ListingDetailsProps {
  property: PropertyListing;
  userProfile?: UserProfile | null;
  onBack: () => void;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ListingDetails: React.FC<ListingDetailsProps> = ({
  property,
  userProfile = null,
  onBack,
  isFav,
  onToggleFavorite
}) => {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLeaseModal, setShowLeaseModal] = useState(false);

  const lat = property.lat || 9.3524;
  const lng = property.lng || 42.7961;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const isSold = property.status === 'sold';
  const isRented = property.status === 'rented';
  const views = property.viewsCount || 45;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-28 animate-fade-in">
      
      {/* Top Image Carousel Header */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-w-screen-lg mx-auto bg-[#111315] overflow-hidden sm:rounded-b-3xl shadow-sm">
        <img
          src={property.images[activeImgIndex] || property.images[0]}
          alt={property.title}
          className={`w-full h-full object-cover ${isSold || isRented ? 'grayscale-[30%]' : ''}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/70 via-transparent to-[#111315]/30" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#17191C] p-2.5 rounded-full hover:bg-white active:scale-95 transition-all shadow-xs z-10"
          title="Back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#17191C] p-2.5 rounded-full hover:bg-white active:scale-95 transition-all shadow-xs z-10"
          title={isFav ? 'Remove Favorite' : 'Add Favorite'}
        >
          <span className={`material-symbols-outlined text-[20px] ${isFav ? 'fill-1 text-[#111315]' : 'text-[#74777B]'}`}>
            favorite
          </span>
        </button>

        {/* Sold / Rented Banner Overlay on Details Header Image */}
        {isSold && (
          <div className="absolute inset-0 bg-[#111315]/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <span className="material-symbols-outlined text-[42px] text-[#A8453F] mb-1">lock</span>
            <span className="font-serif font-bold text-xl tracking-wider text-white border border-[#A8453F] px-6 py-2 rounded-2xl bg-[#A8453F]/40 shadow-2xl">
              WAALA IIBSADAY (SOLD)
            </span>
            <p className="text-xs text-white/80 mt-2 bg-black/50 px-4 py-1.5 rounded-full border border-white/20">
              Gurigan waa la iibsaday. Fadlan fiiri guryaha kale ee dhaw.
            </p>
          </div>
        )}

        {isRented && (
          <div className="absolute inset-0 bg-[#111315]/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <span className="material-symbols-outlined text-[42px] text-[#C8A96B] mb-1">key</span>
            <span className="font-serif font-bold text-xl tracking-wider text-white border border-[#C8A96B] px-6 py-2 rounded-2xl bg-[#C8A96B]/30 shadow-2xl">
              WAALA KIREEYAY (RENTED)
            </span>
            <p className="text-xs text-white/80 mt-2 bg-black/50 px-4 py-1.5 rounded-full border border-white/20">
              Gurigan waa la kireeyay. Fadlan fiiri guryaha kale ee dhaw.
            </p>
          </div>
        )}

        {/* Gallery Thumbnails Indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 z-10">
            {property.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeImgIndex ? 'w-6 bg-[#C8A96B]' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Title, Badges & Price */}
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-3 border border-[#E8E5DF]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#111315] text-white">
                  {property.mode === 'kiro' ? 'Kiro (For Rent)' : 'Iib (For Sale)'}
                </span>

                <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF]">
                  {property.category}
                </span>

                {property.videoUrl && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white text-[#17191C] border border-[#E8E5DF] flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[14px]">videocam</span>
                    <span>Video Tour</span>
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>{views} Views</span>
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#17191C] leading-tight">
                {property.title}
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#17191C] block">
                {property.priceLocalFormatted}
              </span>
              <span className="text-[11px] text-[#74777B] font-normal">
                {property.mode === 'kiro' ? 'Monthly Rent' : 'Total Price (Sale)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#74777B] text-sm pt-3 border-t border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[18px] text-[#111315]">location_on</span>
            <span className="font-medium text-[#17191C]">{property.city}, {property.kebele}</span>
          </div>
        </div>

        {/* PROPERTY VIDEO TOUR SECTION */}
        {property.videoUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif text-lg text-[#17191C] flex items-center space-x-2">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
                <span>Muuqaalka Tooska ah ee Guriga (Live Video Tour)</span>
              </h3>
            </div>

            <PropertyVideoPlayer
              videoUrl={property.videoUrl}
              posterUrl={property.videoThumbnail || property.images[0]}
              title={property.title}
            />
          </div>
        )}

        {/* GPS Location & Map Card */}
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-4 border border-[#E8E5DF]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#111315] text-[22px]">my_location</span>
              <h3 className="font-serif text-lg text-[#17191C]">
                GPS Location & Map (Jigjiga)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4A7A63] text-white">
              GPS Verified
            </span>
          </div>

          <div className="p-3.5 bg-[#FAF9F6] rounded-2xl space-y-2 border border-[#E8E5DF] text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#74777B]">GPS Coordinates:</span>
              <span className="font-mono font-semibold text-[#17191C]">{property.gpsCoords || `${lat}° N, ${lng}° E`}</span>
            </div>
            {property.nearDistance && (
              <div className="flex items-center justify-between">
                <span className="text-[#74777B]">Proximity / Distance:</span>
                <span className="font-medium text-[#17191C]">{property.nearDistance}</span>
              </div>
            )}
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-white border border-[#E8E5DF] hover:border-[#111315] text-[#17191C] font-sans font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-[#C8A96B]">map</span>
            <span>Fur Google Maps (View Location on GPS Map)</span>
          </a>
        </div>

        {/* Specs Grid */}
        <div className="bg-white p-6 rounded-3xl listing-card-shadow grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border border-[#E8E5DF]">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">bed</span>
            <span className="font-sans font-medium text-xs text-[#17191C] block">{property.beds} Qol (Beds)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">bathtub</span>
            <span className="font-sans font-medium text-xs text-[#17191C] block">{property.baths} Musqul</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">water_drop</span>
            <span className="font-sans font-medium text-xs text-[#17191C] block">{property.water}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">bolt</span>
            <span className="font-sans font-medium text-xs text-[#17191C] block">{property.electricity}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-2 border border-[#E8E5DF]">
          <h3 className="font-serif text-lg text-[#17191C]">
            Faahfaahinta Guriga (Property Description)
          </h3>
          <p className="text-xs text-[#74777B] leading-relaxed font-normal">
            {property.description}
          </p>
        </div>

        {/* Landlord Agent Card */}
        <div className="bg-white p-6 rounded-3xl listing-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#E8E5DF]">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <img 
              src={property.agentAvatar} 
              alt={property.agentName}
              className="w-12 h-12 rounded-full object-cover border border-[#E8E5DF] shrink-0"
            />
            <div>
              <h4 className="font-sans font-semibold text-sm text-[#17191C]">{property.agentName}</h4>
              <span className="text-xs text-[#4A7A63] font-medium flex items-center space-x-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Verified Landlord in Jigjiga</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowLeaseModal(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-[#E8E5DF] text-[#17191C] font-semibold text-xs hover:border-[#111315] transition flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span>Heshiiska Kirada (Lease Contract)</span>
            </button>

            {/* Single Gold Primary CTA */}
            <button
              onClick={() => setShowContactModal(true)}
              disabled={isSold || isRented}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-sans font-bold text-xs shadow-xs transition flex items-center justify-center space-x-2 ${
                isSold || isRented
                  ? 'bg-[#74777B] text-white cursor-not-allowed'
                  : 'bg-[#C8A96B] hover:brightness-105 text-[#111315] active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSold || isRented ? 'lock' : 'call'}
              </span>
              <span>{isSold ? 'Waala Iibsaday (Sold)' : isRented ? 'Waala Kireeyay (Rented)' : 'La Xiriir Milkiilaha'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Agent Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-xl space-y-4 text-center border border-[#E8E5DF]">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF] text-[#111315] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">contact_phone</span>
            </div>

            <h3 className="font-serif text-lg text-[#17191C]">
              La Xiriir Milkiilaha (Jigjiga)
            </h3>
            <p className="text-xs text-[#74777B]">
              Wac ama fariin WhatsApp ugu dir nambarkan:
            </p>
            
            <div className="p-3 bg-[#FAF9F6] rounded-xl font-mono font-bold text-base text-[#111315] border border-[#E8E5DF]">
              {property.agentPhone}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${property.agentPhone}`}
                onClick={() => {
                  supabase.from('property_inquiries').insert([{
                    property_id: property.id,
                    property_title: property.title,
                    sender_name: 'DHAMME Tenant',
                    sender_phone: 'Direct Call Initiated',
                    agent_email: property.ownerEmail || 'user@dhamme.app',
                    message: `Initiated direct phone call to ${property.agentPhone}`
                  }]).catch((err) => console.warn('Inquiry log error:', err));
                }}
                className="py-3 rounded-xl bg-[#111315] text-white font-semibold text-xs flex items-center justify-center space-x-1 shadow-xs hover:bg-[#17191C] transition"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Wac Nambarka</span>
              </a>
              <button
                onClick={() => {
                  supabase.from('property_inquiries').insert([{
                    property_id: property.id,
                    property_title: property.title,
                    sender_name: 'DHAMME Tenant',
                    sender_phone: 'WhatsApp Initiated',
                    agent_email: property.ownerEmail || 'user@dhamme.app',
                    message: `Initiated WhatsApp chat with ${property.agentPhone}`
                  }]).catch((err) => console.warn('Inquiry log error:', err));

                  window.open(`https://wa.me/${property.agentPhone.replace(/[^0-9]/g, '')}`, '_blank');
                  setShowContactModal(false);
                }}
                className="py-3 rounded-xl bg-[#4A7A63] text-white font-semibold text-xs flex items-center justify-center space-x-1 shadow-xs hover:brightness-105 transition"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="text-xs font-medium text-[#74777B] hover:text-[#17191C] pt-2 block mx-auto"
            >
              Xidh (Close)
            </button>
          </div>
        </div>
      )}

      {/* Printable Lease Agreement Contract Modal */}
      {showLeaseModal && (
        <LeaseAgreementModal
          property={property}
          userProfile={userProfile}
          onClose={() => setShowLeaseModal(false)}
        />
      )}

    </div>
  );
};
