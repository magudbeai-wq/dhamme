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
    <div className="min-h-screen bg-slate-50 pb-28 animate-fade-in">
      
      {/* Top Image Carousel Header */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-w-screen-lg mx-auto bg-slate-900 overflow-hidden sm:rounded-b-3xl shadow-xl">
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
          <span className={`material-symbols-outlined text-[24px] ${isFav ? 'fill-1 text-rose-500' : 'text-white'}`}>
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
                  idx === activeImgIndex ? 'w-7 bg-rose-500' : 'w-2.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-6 space-y-5">
        
        {/* Title, Badges & Views Count */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl listing-card-shadow space-y-3 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  property.mode === 'kiro' ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
                }`}>
                  {property.mode === 'kiro' ? 'Kiro (For Rent)' : 'Iib (For Sale)'}
                </span>

                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  {property.category}
                </span>

                {/* Video Tour Badge */}
                {property.videoUrl && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-300 flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[14px] text-red-600">videocam</span>
                    <span>Video Tour Ready</span>
                  </span>
                )}

                {/* Views Count Badge */}
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>{views} Aragtida (Views)</span>
                </span>
              </div>

              <h1 className="font-poppins text-2xl font-black text-slate-900 leading-tight">
                {property.title}
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="font-poppins text-2xl font-black text-rose-600 block">
                {property.priceLocalFormatted}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {property.mode === 'kiro' ? 'Monthly Rent' : 'Total Price (Sale)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 text-sm pt-2 border-t border-slate-100">
            <span className="material-symbols-outlined text-rose-600">location_on</span>
            <span className="font-semibold text-slate-900">{property.city}, {property.kebele}</span>
          </div>
        </div>

        {/* PROPERTY VIDEO TOUR SECTION */}
        {property.videoUrl && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-poppins font-bold text-base text-slate-900 flex items-center space-x-2">
                <span className="material-symbols-outlined text-rose-600">videocam</span>
                <span>Muuqaalka Tooska ah ee Guriga (Live Video Tour)</span>
              </h3>
              <span className="text-[11px] font-bold text-rose-600">HD Video</span>
            </div>

            <PropertyVideoPlayer
              videoUrl={property.videoUrl}
              posterUrl={property.videoThumbnail || property.images[0]}
              title={property.title}
            />
          </div>
        )}

        {/* GPS Location & Map Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl listing-card-shadow space-y-3 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-rose-600 text-[24px]">my_location</span>
              <h3 className="font-poppins font-bold text-base text-slate-900">
                GPS Location & Map (Jigjiga)
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              GPS Verified
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">GPS Coordinates:</span>
              <span className="font-mono font-bold text-rose-600">{property.gpsCoords || `${lat}° N, ${lng}° E`}</span>
            </div>
            {property.nearDistance && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Proximity / Distance:</span>
                <span className="font-bold text-slate-900">{property.nearDistance}</span>
              </div>
            )}
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-poppins font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined text-[20px] text-amber-400">map</span>
            <span>Fur Google Maps (View Location on GPS Map)</span>
          </a>
        </div>

        {/* Specs Grid */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl listing-card-shadow grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border border-slate-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-rose-600 text-[28px] block mb-1">bed</span>
            <span className="font-poppins font-bold text-xs text-slate-900 block">{property.beds} Qol (Beds)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-rose-600 text-[28px] block mb-1">bathtub</span>
            <span className="font-poppins font-bold text-xs text-slate-900 block">{property.baths} Musqul</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-blue-600 text-[28px] block mb-1">water_drop</span>
            <span className="font-poppins font-bold text-xs text-slate-900 block">{property.water}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-amber-500 text-[28px] block mb-1">bolt</span>
            <span className="font-poppins font-bold text-xs text-slate-900 block">{property.electricity}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl listing-card-shadow space-y-2 border border-slate-200">
          <h3 className="font-poppins font-bold text-base text-slate-900">
            Faahfaahinta Guriga (Property Description)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {property.description}
          </p>
        </div>

        {/* Landlord Agent Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl listing-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <img 
              src={property.agentAvatar} 
              alt={property.agentName}
              className="w-14 h-14 rounded-full object-cover border-2 border-rose-600 shadow-sm shrink-0"
            />
            <div>
              <h4 className="font-poppins font-bold text-sm text-slate-900">{property.agentName}</h4>
              <span className="text-xs text-rose-600 font-semibold flex items-center space-x-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-amber-500">verified</span>
                <span>Verified Landlord in Jigjiga</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => setShowLeaseModal(true)}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-rose-50 text-rose-700 font-poppins font-bold text-xs shadow-xs hover:bg-rose-100 active:scale-95 transition-all flex items-center justify-center space-x-1.5 border border-rose-200"
            >
              <span className="material-symbols-outlined text-[20px]">description</span>
              <span>Heshiiska Kirada (Lease Contract)</span>
            </button>

            <button
              onClick={() => setShowContactModal(true)}
              disabled={isSold || isRented}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-poppins font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 ${
                isSold || isRented
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 via-rose-600 to-rose-700 hover:shadow-rose-600/30 text-white active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSold || isRented ? 'lock' : 'call'}
              </span>
              <span>{isSold ? 'Waala Iibsaday (Sold)' : isRented ? 'Waala Kireeyay (Rented)' : 'La Xiriir Milkiilaha'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Agent Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 text-center border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[36px]">contact_phone</span>
            </div>

            <h3 className="font-poppins font-bold text-lg text-slate-900">
              La Xiriir Milkiilaha (Jigjiga)
            </h3>
            <p className="text-xs text-slate-600">
              Wac ama fariin WhatsApp ugu dir nambarkan:
            </p>
            
            <div className="p-3.5 bg-slate-50 rounded-2xl font-mono font-bold text-base text-rose-600 border border-slate-200">
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
                className="py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md hover:bg-rose-700 transition"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
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
                className="py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md hover:bg-emerald-700 transition"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WhatsApp</span>
              </button>
            </div>

            <button
              onClick={() => setShowContactModal(false)}
              className="text-xs font-semibold text-slate-500 hover:underline pt-2 block mx-auto"
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
