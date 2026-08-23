import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-white text-slate-900 w-full max-w-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 my-auto relative space-y-6 print:p-0 print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Header Controls (Hidden during print) */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-rose-600 text-2xl">description</span>
            <h3 className="font-poppins font-bold text-lg text-rose-600">
              Heshiiska Kirada (Lease Contract PDF)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs hover:bg-rose-700 transition-all flex items-center space-x-1.5 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Printable Formal Contract Document Content */}
        <div className="space-y-6 text-sm text-slate-800 font-inter">
          
          {/* Document Title Header */}
          <div className="text-center space-y-1 border-b-2 border-rose-600 pb-4">
            <h1 className="font-poppins font-black text-xl text-rose-600 uppercase tracking-wide">
              HESHISKA KIRADA GURIGA (LEASE AGREEMENT)
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              DHAMME REAL ESTATE NETWORK • JIGJIGA, SOMALI REGION, ETHIOPIA
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Date: <span className="font-bold text-slate-900">{todayDate}</span> | Ref: DHM-CONTRACT-{(property.id || '').slice(-6).toUpperCase()}
            </div>
          </div>

          {/* Parties Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-poppins font-bold text-xs uppercase text-rose-600 mb-1">
                1. MULKIILAHA (LANDLORD / AGENT)
              </h4>
              <p className="font-bold text-slate-900">{property.agentName}</p>
              <p className="text-xs text-slate-600">Phone: {property.agentPhone}</p>
              <p className="text-xs text-slate-600">Email: {property.ownerEmail || 'user@dhamme.app'}</p>
            </div>

            <div>
              <h4 className="font-poppins font-bold text-xs uppercase text-rose-600 mb-1">
                2. KIREYSTAHA (TENANT)
              </h4>
              <div className="space-y-1 print:hidden">
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full text-xs font-bold p-1.5 border border-slate-300 rounded-lg"
                  placeholder="Tenant Full Name"
                />
                <input
                  type="text"
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full text-xs p-1.5 border border-slate-300 rounded-lg"
                  placeholder="Tenant Phone Number"
                />
              </div>
              <div className="hidden print:block space-y-0.5">
                <p className="font-bold text-slate-900">{tenantName}</p>
                <p className="text-xs text-slate-600">Phone: {tenantPhone}</p>
              </div>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="space-y-2">
            <h4 className="font-poppins font-bold text-xs uppercase text-rose-600">
              3. FAAHFAAHINTA GURIGA (PROPERTY DETAILS)
            </h4>
            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                <span className="font-bold text-xs text-rose-950">{property.city}, {property.kebele}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Category</span>
                <span className="font-bold text-xs text-rose-950">{property.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Size & Rooms</span>
                <span className="font-bold text-xs text-rose-950">{property.beds} Beds • {property.areaSqm} m²</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Utilities</span>
                <span className="font-bold text-xs text-rose-950">Water {property.water} • Power {property.electricity}</span>
              </div>
            </div>
          </div>

          {/* Financial Terms */}
          <div className="space-y-2">
            <h4 className="font-poppins font-bold text-xs uppercase text-rose-600">
              4. SHURUUDAHA QIIMAHA IYO DHIBAATADA (FINANCIAL TERMS)
            </h4>
            <ul className="list-disc pl-5 text-xs space-y-1.5 text-slate-700">
              <li>
                <strong>Kiro Shahaadoolee (Monthly Rent):</strong> <span className="font-black text-rose-600 font-poppins">{property.priceLocalFormatted}</span> payments due on the 1st day of every month.
              </li>
              <li>
                <strong>Damanad (Security Deposit):</strong> <span className="font-bold">{depositEtb} ETB</span> (2 months rent deposit) held as security against property damage.
              </li>
              <li>
                <strong>Muddada Kirada (Lease Term):</strong> Fixed for <span className="font-bold">{leaseDurationMonths} Months</span> renewable upon mutual written notice 30 days before expiration.
              </li>
            </ul>
          </div>

          {/* Clauses */}
          <div className="space-y-2">
            <h4 className="font-poppins font-bold text-xs uppercase text-rose-600">
              5. HESHIISKA SHARCIYADA (LEGAL CLAUSES)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kireystahu wuxuu ku heshiinayaa inuu dhowro nidaamka iyo nadaafada guriga, inaanuu bedelin qaabka guriga isagoon ogolaansho qoraal ah ka helin mulkiilaha, iyo inuu bixiyo kharashka korontada iyo biyaha sida ku belan.
            </p>
          </div>

          {/* Signatures Section */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center">
            <div className="space-y-8">
              <div className="border-b border-slate-400 pb-1 font-bold text-xs">
                {property.agentName}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">
                Saxiixa Mulkiilaha (Landlord Signature)
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-b border-slate-400 pb-1 font-bold text-xs">
                {tenantName}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold uppercase">
                Saxiixa Kireystaha (Tenant Signature)
              </p>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-slate-100">
          Generated automatically via DHAMME Real Estate Digital Platform • Jigjiga, Ethiopia
        </div>

      </div>
    </div>
  );
};
