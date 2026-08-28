import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FAF9F6] pb-28"
    >
      
      {/* Top Image Carousel Header */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full max-w-screen-lg mx-auto bg-[#111315] overflow-hidden sm:rounded-b-3xl shadow-md">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImgIndex}
            src={property.images[activeImgIndex] || property.images[0]}
            alt={property.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={`w-full h-full object-cover ${isSold || isRented ? 'grayscale-[30%]' : ''}`}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#111315]/75 via-transparent to-[#111315]/30 pointer-events-none" />

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#111315] p-2.5 rounded-full hover:bg-white transition-all shadow-md z-10 cursor-pointer"
          title="Back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </motion.button>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#111315] p-2.5 rounded-full hover:bg-white transition-all shadow-md z-10 cursor-pointer"
          title={isFav ? 'Remove Favorite' : 'Add Favorite'}
        >
          <span className={`material-symbols-outlined text-[20px] transition-colors ${isFav ? 'fill-1 text-red-500' : 'text-[#74777B]'}`}>
            favorite
          </span>
        </motion.button>

        {/* Sold / Rented Banner Overlay */}
        {isSold && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-[#111315]/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center z-20"
          >
            <span className="material-symbols-outlined text-[42px] text-[#A8453F] mb-1">lock</span>
            <span className="font-serif font-bold text-xl tracking-wider text-white border border-[#A8453F] px-6 py-2 rounded-2xl bg-[#A8453F]/40 shadow-2xl">
              WAALA IIBSADAY (SOLD)
            </span>
            <p className="text-xs text-white/80 mt-2 bg-black/50 px-4 py-1.5 rounded-full border border-white/20">
              Gurigan waa la iibsaday. Fadlan fiiri guryaha kale ee dhaw.
            </p>
          </motion.div>
        )}

        {isRented && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-[#111315]/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center z-20"
          >
            <span className="material-symbols-outlined text-[42px] text-[#C8A96B] mb-1">key</span>
            <span className="font-serif font-bold text-xl tracking-wider text-white border border-[#C8A96B] px-6 py-2 rounded-2xl bg-[#C8A96B]/30 shadow-2xl">
              WAALA KIREEYAY (RENTED)
            </span>
            <p className="text-xs text-white/80 mt-2 bg-black/50 px-4 py-1.5 rounded-full border border-white/20">
              Gurigan waa la kireeyay. Fadlan fiiri guryaha kale ee dhaw.
            </p>
          </motion.div>
        )}

        {/* Gallery Thumbnails Indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20 z-10">
            {property.images.map((_, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.8 }}
                onClick={() => setActiveImgIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
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
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 sm:p-7 rounded-3xl listing-card-shadow space-y-4 border border-[#E8E5DF]"
        >
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
                  <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white text-[#111315] border border-[#E8E5DF] flex items-center space-x-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[14px] text-[#C8A96B]">videocam</span>
                    <span>Video Tour</span>
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#FAF9F6] text-[#74777B] border border-[#E8E5DF] flex items-center space-x-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>{views} Views</span>
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#111315] leading-tight">
                {property.title}
              </h1>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#111315] block">
                {property.priceLocalFormatted}
              </span>
              <span className="text-[11px] text-[#74777B] font-normal">
                {property.mode === 'kiro' ? 'Monthly Rent' : 'Total Price (Sale)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#74777B] text-sm pt-3 border-t border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[18px] text-[#111315]">location_on</span>
            <span className="font-medium text-[#111315]">{property.city}, {property.kebele}</span>
          </div>
        </motion.div>

        {/* PROPERTY VIDEO TOUR SECTION */}
        {property.videoUrl && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif text-lg text-[#111315] flex items-center space-x-2">
                <span className="material-symbols-outlined text-[20px] text-[#C8A96B]">videocam</span>
                <span>Muuqaalka Tooska ah ee Guriga (Live Video Tour)</span>
              </h3>
            </div>

            <PropertyVideoPlayer
              videoUrl={property.videoUrl}
              posterUrl={property.videoThumbnail || property.images[0]}
              title={property.title}
            />
          </motion.div>
        )}

        {/* GPS Location & Map Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white p-6 rounded-3xl listing-card-shadow space-y-4 border border-[#E8E5DF]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#111315] text-[22px]">my_location</span>
              <h3 className="font-serif text-lg text-[#111315]">
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
              <span className="font-mono font-semibold text-[#111315]">{property.gpsCoords || `${lat}° N, ${lng}° E`}</span>
            </div>
            {property.nearDistance && (
              <div className="flex items-center justify-between">
                <span className="text-[#74777B]">Proximity / Distance:</span>
                <span className="font-medium text-[#111315]">{property.nearDistance}</span>
              </div>
            )}
          </div>

          <motion.a
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl bg-white border border-[#E8E5DF] hover:border-[#111315] text-[#111315] font-sans font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-[#C8A96B]">map</span>
            <span>Fur Google Maps (View Location on GPS Map)</span>
          </motion.a>
        </motion.div>

        {/* Specs Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white p-6 rounded-3xl listing-card-shadow grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border border-[#E8E5DF]"
        >
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">bed</span>
            <span className="font-sans font-medium text-xs text-[#111315] block">{property.beds} Qol (Beds)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">bathtub</span>
            <span className="font-sans font-medium text-xs text-[#111315] block">{property.baths} Musqul</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">water_drop</span>
            <span className="font-sans font-medium text-xs text-[#111315] block">{property.water}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF]">
            <span className="material-symbols-outlined text-[#111315] text-[24px] block mb-1">bolt</span>
            <span className="font-sans font-medium text-xs text-[#111315] block">{property.electricity}</span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white p-6 rounded-3xl listing-card-shadow space-y-2 border border-[#E8E5DF]"
        >
          <h3 className="font-serif text-lg text-[#111315]">
            Faahfaahinta Guriga (Property Description)
          </h3>
          <p className="text-xs text-[#74777B] leading-relaxed font-normal">
            {property.description}
          </p>
        </motion.div>

        {/* Landlord Agent Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white p-6 rounded-3xl listing-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#E8E5DF]"
        >
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <img 
              src={property.agentAvatar} 
              alt={property.agentName}
              className="w-12 h-12 rounded-full object-cover border border-[#E8E5DF] shrink-0"
            />
            <div>
              <h4 className="font-sans font-semibold text-sm text-[#111315]">{property.agentName}</h4>
              <span className="text-xs text-[#4A7A63] font-medium flex items-center space-x-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Verified Landlord in Jigjiga</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLeaseModal(true)}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white border border-[#E8E5DF] text-[#111315] font-semibold text-xs hover:border-[#111315] transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">description</span>
              <span>Heshiiska Kirada</span>
            </motion.button>

            {/* Gold Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowContactModal(true)}
              disabled={isSold || isRented}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-sans font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer ${
                isSold || isRented
                  ? 'bg-[#74777B] text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSold || isRented ? 'lock' : 'call'}
              </span>
              <span>{isSold ? 'Waala Iibsaday' : isRented ? 'Waala Kireeyay' : 'La Xiriir Milkiilaha'}</span>
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Agent Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="fixed inset-0 bg-[#111315]/65 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative bg-white max-w-sm w-full p-6 rounded-3xl shadow-2xl space-y-4 text-center border border-[#E8E5DF] z-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DF] text-[#111315] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px] text-[#C8A96B]">contact_phone</span>
              </div>

              <h3 className="font-serif text-lg text-[#111315]">
                La Xiriir Milkiilaha (Jigjiga)
              </h3>
              <p className="text-xs text-[#74777B]">
                Wac ama fariin WhatsApp ugu dir nambarkan:
              </p>
              
              <div className="p-3 bg-[#FAF9F6] rounded-xl font-mono font-bold text-base text-[#111315] border border-[#E8E5DF]">
                {property.agentPhone}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
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
                  className="py-3 rounded-xl bg-[#111315] text-white font-semibold text-xs flex items-center justify-center space-x-1 shadow-xs hover:bg-[#22272B] transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Wac Nambarka</span>
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
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
                  className="py-3 rounded-xl bg-[#4A7A63] text-white font-semibold text-xs flex items-center justify-center space-x-1 shadow-xs hover:brightness-105 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </motion.button>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="text-xs font-medium text-[#74777B] hover:text-[#111315] pt-2 block mx-auto cursor-pointer"
              >
                Xidh (Close)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable Lease Agreement Contract Modal */}
      {showLeaseModal && (
        <LeaseAgreementModal
          property={property}
          userProfile={userProfile}
          onClose={() => setShowLeaseModal(false)}
        />
      )}

    </motion.div>
  );
};
