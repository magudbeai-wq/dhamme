import React from 'react';
import { DhammeLogo } from './DhammeLogo';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-sm font-bold text-rose-600 hover:text-rose-700 transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>U noqo Guriga (Back to Home)</span>
        </button>

        <DhammeLogo variant="sm" animated={false} showSubtitle={false} />
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="font-poppins text-3xl font-extrabold text-rose-600">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            DHAMME Real Estate Platform • Last Updated: August 12, 2026
          </p>
        </div>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the DHAMME Real Estate web application hosted at <strong>https://capilorix.store</strong>, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you may not use our services.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">2. Description of Service</h2>
          <p>
            DHAMME provides an online real estate marketplace connecting property owners, landlords, agents, renters, and property buyers in Jigjiga and across the Somali Region of Ethiopia.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">3. Account Registration & User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You must provide accurate and truthful information when creating an account or logging in via Google / Clerk authentication.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</li>
            <li>Landlords and property posters must ensure that listed properties accurately reflect physical dimensions, price in Ethiopian Birr (ETB), location, and amenities.</li>
            <li>Posting fraudulent, deceptive, offensive, or illegal listings is strictly prohibited and will result in immediate account termination.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">4. Intellectual Property</h2>
          <p>
            All content, branding, logos, graphics, and software components of DHAMME Real Estate are the intellectual property of DHAMME and protected by applicable copyright and trademark laws.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            DHAMME facilitates property connections between users. We are not liable for disputes, agreements, financial transactions, or physical inspections conducted independently between property buyers and landlords.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">6. Contact Information</h2>
          <p>For questions or support regarding these Terms of Service, please contact:</p>
          <div className="p-4 bg-slate-50 rounded-2xl text-xs font-semibold space-y-1 text-slate-900 border border-slate-200">
            <p><strong>DHAMME Real Estate Team</strong></p>
            <p>Email: <a href="mailto:magudbeai@gmail.com" className="text-rose-600 underline">magudbeai@gmail.com</a></p>
            <p>Website: <a href="https://capilorix.store" className="text-rose-600 underline">https://capilorix.store</a></p>
          </div>
        </section>

      </div>
    </div>
  );
};
