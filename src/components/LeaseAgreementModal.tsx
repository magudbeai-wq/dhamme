import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { PropertyListing, UserProfile } from '../types';

interface LeaseAgreementModalProps {
  property: PropertyListing;
  userProfile: UserProfile | null;
  onClose: () => void;
}

export const LeaseAgreementModal: React.FC<LeaseAgreementModalProps> = ({
  property,
  userProfile,
  onClose
}) => {
  const [tenantName, setTenantName] = useState(userProfile?.fullName || 'Kireyste (Tenant)');
  const [tenantPhone, setTenantPhone] = useState(userProfile?.phone || '+251 91 000 0000');
  const [leaseDurationMonths] = useState(12);

  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const depositEtb = (property.priceEtb * 2).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#111315]/70 backdrop-blur-md print:hidden"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="relative bg-white text-[#111315] w-full max-w-2xl p-6 sm:p-8 rounded-[32px] shadow-2xl border border-[#E8E5DF] my-auto space-y-6 print:p-0 print:shadow-none print:max-w-none print:rounded-none z-10"
      >
        {/* Header Controls (Hidden during print) */}
        <div className="flex justify-between items-center border-b border-[#E8E5DF] pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#C8A96B] text-2xl">description</span>
            <h3 className="font-serif font-bold text-lg text-[#111315]">
              Heshiiska Kirada (Lease Contract PDF)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-[#C8A96B] to-[#D4B97F] text-[#111315] rounded-xl font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print / Save PDF</span>
            </motion.button>
            <button
              onClick={onClose}
              className="p-2 text-[#74777B] hover:text-[#111315] rounded-full hover:bg-[#FAF9F6] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Printable Formal Contract Document Content */}
        <div className="space-y-6 text-sm text-[#111315]">
          
          {/* Document Title Header */}
          <div className="text-center space-y-1 border-b-2 border-[#111315] pb-4">
            <h1 className="font-serif font-black text-xl text-[#111315] uppercase tracking-wide">
              HESHISKA KIRADA GURIGA (LEASE AGREEMENT)
            </h1>
            <p className="text-xs text-[#74777B] font-semibold">
              DHAMME REAL ESTATE NETWORK • JIGJIGA, SOMALI REGION, ETHIOPIA
            </p>
            <div className="text-[11px] font-mono text-[#74777B] pt-1">
              Date: <span className="font-bold text-[#111315]">{todayDate}</span> | Ref: DHM-CONTRACT-{(property.id || '').slice(-6).toUpperCase()}
            </div>
          </div>

          {/* Parties Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF]">
            <div>
              <h4 className="font-sans font-bold text-xs uppercase text-[#C8A96B] mb-1">
                1. MULKIILAHA (LANDLORD / AGENT)
              </h4>
              <p className="font-bold text-[#111315]">{property.agentName}</p>
              <p className="text-xs text-[#74777B]">Phone: {property.agentPhone}</p>
              <p className="text-xs text-[#74777B]">Email: {property.ownerEmail || 'user@dhamme.app'}</p>
            </div>

            <div>
              <h4 className="font-sans font-bold text-xs uppercase text-[#C8A96B] mb-1">
                2. KIREYSTAHA (TENANT)
              </h4>
              <div className="space-y-1 print:hidden">
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full text-xs font-bold p-1.5 border border-[#E8E5DF] rounded-lg bg-white"
                  placeholder="Tenant Full Name"
                />
                <input
                  type="text"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full text-xs p-1.5 border border-[#E8E5DF] rounded-lg bg-white"
                  placeholder="Tenant Phone Number"
                />
              </div>
              <div className="hidden print:block space-y-0.5">
                <p className="font-bold text-[#111315]">{tenantName}</p>
                <p className="text-xs text-[#74777B]">Phone: {tenantPhone}</p>
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase text-[#C8A96B]">
              3. FAAHFAAHINTA GURIGA (PROPERTY DETAILS)
            </h4>
            <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[10px] text-[#74777B] uppercase font-bold block">Location</span>
                <span className="font-bold text-xs text-[#111315]">{property.city}, {property.kebele}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#74777B] uppercase font-bold block">Category</span>
                <span className="font-bold text-xs text-[#111315]">{property.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#74777B] uppercase font-bold block">Size & Rooms</span>
                <span className="font-bold text-xs text-[#111315]">{property.beds} Beds • {property.areaSqm} m²</span>
              </div>
              <div>
                <span className="text-[10px] text-[#74777B] uppercase font-bold block">Utilities</span>
                <span className="font-bold text-xs text-[#111315]">Water {property.water} • Power {property.electricity}</span>
              </div>
            </div>
          </div>

          {/* Financial Terms */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase text-[#C8A96B]">
              4. SHURUUDAHA QIIMAHA (FINANCIAL TERMS)
            </h4>
            <ul className="list-disc pl-5 text-xs space-y-1.5 text-[#74777B]">
              <li>
                <strong className="text-[#111315]">Kiro Shahaadoolee (Monthly Rent):</strong> <span className="font-bold text-[#111315]">{property.priceLocalFormatted}</span> payments due on the 1st day of every month.
              </li>
              <li>
                <strong className="text-[#111315]">Damanad (Security Deposit):</strong> <span className="font-bold text-[#111315]">{depositEtb} ETB</span> (2 months rent deposit) held as security against property damage.
              </li>
              <li>
                <strong className="text-[#111315]">Muddada Kirada (Lease Term):</strong> Fixed for <span className="font-bold text-[#111315]">{leaseDurationMonths} Months</span> renewable upon mutual written notice 30 days before expiration.
              </li>
            </ul>
          </div>

          {/* Clauses */}
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-xs uppercase text-[#C8A96B]">
              5. HESHIISKA SHARCIYADA (LEGAL CLAUSES)
            </h4>
            <p className="text-xs text-[#74777B] leading-relaxed">
              Kireystahu wuxuu ku heshiinayaa inuu dhowro nidaamka iyo nadaafada guriga, inaanuu bedelin qaabka guriga isagoon ogolaansho qoraal ah ka helin mulkiilaha, iyo inuu bixiyo kharashka korontada iyo biyaha sida ku belan.
            </p>
          </div>

          {/* Signatures Section */}
          <div className="pt-6 border-t border-[#E8E5DF] grid grid-cols-2 gap-8 text-center">
            <div className="space-y-8">
              <div className="border-b border-[#111315] pb-1 font-bold text-xs">
                {property.agentName}
              </div>
              <p className="text-[11px] text-[#74777B] font-semibold uppercase">
                Saxiixa Mulkiilaha (Landlord Signature)
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-b border-[#111315] pb-1 font-bold text-xs">
                {tenantName}
              </div>
              <p className="text-[11px] text-[#74777B] font-semibold uppercase">
                Saxiixa Kireystaha (Tenant Signature)
              </p>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center pt-2 text-[10px] text-[#74777B] border-t border-[#E8E5DF]">
          Generated automatically via DHAMME Real Estate Digital Platform • Jigjiga, Ethiopia
        </div>

      </motion.div>
    </div>
  );
};
