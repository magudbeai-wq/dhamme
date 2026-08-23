import React from 'react';
import { DhammeLogo } from './DhammeLogo';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            DHAMME Real Estate Platform • Last Updated: August 12, 2026
          </p>
        </div>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">1. Introduction</h2>
          <p>
            Welcome to DHAMME Real Estate ("DHAMME", "we", "our", or "us"), operating at <strong>https://capilorix.store</strong>. We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our web application or use our real estate listing and authentication services.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <p>We collect information that identifies, relates to, or describes you ("Personal Information"), including:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account Information:</strong> Name, email address, phone number, and profile avatar when registering or using Google OAuth / Clerk Authentication.</li>
            <li><strong>Google User Data:</strong> When you log in via Google Sign-In, we request access to your primary email address, full name, and profile picture to authenticate your identity.</li>
            <li><strong>Property Listing Data:</strong> Titles, descriptions, images, prices, locations (Jigjiga, Kebeles), and contact information provided by landlords and agents.</li>
            <li><strong>Usage & Device Information:</strong> IP addresses, browser types, device identifiers, and pages visited for security and performance optimization.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To authenticate your identity and allow secure sign-in via email or Google OAuth.</li>
            <li>To enable landlords and property buyers/renters in Jigjiga, Somali Region, Ethiopia to connect safely.</li>
            <li>To display property listings and contact information to verified buyers and renters.</li>
            <li>To prevent fraud, spam, unauthorized access, and protect platform integrity.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">4. Data Sharing and Protection</h2>
          <p>
            We do not sell, rent, or trade your personal information to third parties. We share data only with service providers required for operating our platform (e.g., Clerk Auth, Supabase DB, Vercel hosting) under strict confidentiality agreements.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">5. Google User Data Privacy Compliance</h2>
          <p>
            DHAMME adheres strictly to Google’s Limited Use Requirements for Google User Data. Information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-base font-bold text-slate-900">6. Your Rights & Contact Us</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal data at any time. For questions or privacy inquiries, contact us at:
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl text-xs font-semibold space-y-1 text-slate-900 border border-slate-200">
            <p><strong>DHAMME Real Estate Support</strong></p>
            <p>Email: <a href="mailto:magudbeai@gmail.com" className="text-rose-600 underline">magudbeai@gmail.com</a></p>
            <p>Phone: +251 91 575 2826</p>
            <p>Location: Jigjiga, Somali Region, Ethiopia</p>
            <p>Website: <a href="https://capilorix.store" className="text-rose-600 underline">https://capilorix.store</a></p>
          </div>
        </section>

      </div>
    </div>
  );
};
