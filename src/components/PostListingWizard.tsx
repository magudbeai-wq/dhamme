import React, { useState } from 'react';
import type { NewListingDraft, PropertyListing, PropertyCategory } from '../types';

interface PostListingWizardProps {
  currentStep: number;
  onNavigateStep: (step: number) => void;
  onAddProperty: (newProp: PropertyListing) => void;
  onCancel: () => void;
}

export const PostListingWizard: React.FC<PostListingWizardProps> = ({
  currentStep,
  onNavigateStep,
  onAddProperty,
  onCancel
}) => {
  const [draft, setDraft] = useState<NewListingDraft>({
    title: '',
    mode: 'kiro',
    category: 'Family House',
    priceEtb: 25000,
    city: 'Jigjiga',
    kebele: 'Kebele 06',
    beds: 3,
    baths: 2,
    areaSqm: 180,
    description: '',
    water: true,
    electricity: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ]
  });

  const categories: PropertyCategory[] = ['Family House', 'Single Room', 'Studio', 'Villa', 'Apartment'];
  const kebeles = [
    'Kebele 01', 'Kebele 02', 'Kebele 03', 'Kebele 04', 'Kebele 05',
    'Kebele 06', 'Kebele 07', 'Kebele 08', 'Kebele 09', 'Kebele 10',
    'Garab\'ase Sector', 'Taiwan Market Area'
  ];

  const handleFinalSubmit = () => {
    const newProperty: PropertyListing = {
      id: `prop-${Date.now()}`,
      title: draft.title || 'DHAMME Jigjiga Residence',
      priceEtb: draft.priceEtb,
      priceLocalFormatted: draft.mode === 'kiro' ? `${draft.priceEtb.toLocaleString()} ETB/mo` : `${draft.priceEtb.toLocaleString()} ETB`,
      mode: draft.mode,
      category: draft.category,
      city: 'Jigjiga',
      kebele: draft.kebele,
      beds: draft.beds,
      baths: draft.baths,
      areaSqm: draft.areaSqm,
      water: draft.water ? 'Yes' : 'No',
      electricity: draft.electricity ? '24h' : 'Mains',
      pool: 'Private',
      isFeatured: true,
      images: draft.images,
      description: draft.description || 'DHAMME Real Estate listing created in Jigjiga, Somali Region, Ethiopia.',
      agentName: 'You (Owner)',
      agentPhone: '+251 91 500 0000',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      postedDate: 'Just now'
    };

    onAddProperty(newProperty);
  };

  return (
    <div className="min-h-screen bg-[#F2E8DC] pb-24 p-5 max-w-screen-md mx-auto animate-fade-in space-y-6">
      
      {/* Wizard Header Progress Bar */}
      <div className="bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-[#005145] uppercase tracking-wider block">
              Tallaabada {currentStep} ee 5 (Jigjiga)
            </span>
            <h1 className="font-poppins text-lg font-bold text-[#1b1b1c]">
              {currentStep === 1 && '1. Faahfaahinta Koowaad (Basic Info)'}
              {currentStep === 2 && '2. Cabirka & Qolalka (Specs)'}
              {currentStep === 3 && '3. Kebele-ka Jigjiga (Location)'}
              {currentStep === 4 && '4. Sawirada Guriga (Photos)'}
              {currentStep === 5 && '5. Qiimaha ETB & Daabacaada (Publish)'}
            </h1>
          </div>

          <button onClick={onCancel} className="text-xs text-[#645d54] hover:text-[#1b1b1c] font-semibold">
            Jooji (Cancel)
          </button>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-2 bg-[#e5e2e1] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#005145] rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      {currentStep === 1 && (
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Nooca Guriga (Listing Type):
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#e5e2e1] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, mode: 'kiro' })}
                className={`py-2 rounded-xl font-bold text-xs ${
                  draft.mode === 'kiro' ? 'bg-[#005145] text-white' : 'text-[#3f4946]'
                }`}
              >
                Kiro (For Rent)
              </button>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, mode: 'iib' })}
                className={`py-2 rounded-xl font-bold text-xs ${
                  draft.mode === 'iib' ? 'bg-[#005145] text-white' : 'text-[#3f4946]'
                }`}
              >
                Iib (For Sale)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Magaca Guriga (Property Title):
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jigjiga Kebele 06 Villa with Garden"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full p-3 bg-[#f0eded] rounded-xl border-none text-sm text-[#1b1b1c]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Qaybta (Category):
            </label>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as PropertyCategory })}
              className="w-full p-3 bg-[#f0eded] rounded-xl border-none text-sm text-[#1b1b1c]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Faahfaahinta Chada (Description):
            </label>
            <textarea
              rows={3}
              placeholder="Faahfaahinta guriga Jigjiga, biyaha, solar-ka..."
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="w-full p-3 bg-[#f0eded] rounded-xl border-none text-sm text-[#1b1b1c]"
            />
          </div>

          <button
            onClick={() => onNavigateStep(2)}
            disabled={!draft.title.trim()}
            className="w-full py-3.5 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-xs uppercase tracking-wider disabled:opacity-50"
          >
            Tallaabada Xigta (Next Step)
          </button>
        </div>
      )}

      {/* STEP 2: Specs */}
      {currentStep === 2 && (
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3f4946] mb-1">
                Bedrooms (Qolalka):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={draft.beds}
                onChange={(e) => setDraft({ ...draft, beds: Number(e.target.value) })}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3f4946] mb-1">
                Bathrooms (Musqulaha):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={draft.baths}
                onChange={(e) => setDraft({ ...draft, baths: Number(e.target.value) })}
                className="w-full p-3 bg-[#f0eded] rounded-xl text-sm font-bold text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Cabirka Guriga (Area Sqm):
            </label>
            <input
              type="number"
              value={draft.areaSqm}
              onChange={(e) => setDraft({ ...draft, areaSqm: Number(e.target.value) })}
              className="w-full p-3 bg-[#f0eded] rounded-xl text-sm font-bold text-[#1b1b1c]"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#1b1b1c]">
              <input
                type="checkbox"
                checked={draft.water}
                onChange={(e) => setDraft({ ...draft, water: e.target.checked })}
                className="w-4 h-4 rounded text-[#005145]"
              />
              <span>Water Connection (Biyaha Wakaallada)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#1b1b1c]">
              <input
                type="checkbox"
                checked={draft.electricity}
                onChange={(e) => setDraft({ ...draft, electricity: e.target.checked })}
                className="w-4 h-4 rounded text-[#005145]"
              />
              <span>24h Electricity / Solar Power</span>
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onNavigateStep(1)}
              className="flex-1 py-3.5 rounded-2xl bg-[#e5e2e1] text-[#3f4946] font-bold text-xs"
            >
              Kusoo Noqo (Back)
            </button>
            <button
              onClick={() => onNavigateStep(3)}
              className="flex-2 py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-xs uppercase"
            >
              Tallaabada 3-aad (Next)
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Location (Kebele in Jigjiga) */}
      {currentStep === 3 && (
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Magaalada:
            </label>
            <input
              type="text"
              disabled
              value="Jigjiga (Somali Region, Ethiopia)"
              className="w-full p-3 bg-[#e5e2e1] rounded-xl text-sm font-bold text-[#1b1b1c]"
            />
          </div>

          <div>
            <label className="block text-[#3f4946] text-xs font-bold mb-1">
              Kebele (Kabale / Xaafadda):
            </label>
            <select
              value={draft.kebele}
              onChange={(e) => setDraft({ ...draft, kebele: e.target.value })}
              className="w-full p-3 bg-[#f0eded] rounded-xl text-sm font-bold text-[#1b1b1c]"
            >
              {kebeles.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onNavigateStep(2)}
              className="flex-1 py-3.5 rounded-2xl bg-[#e5e2e1] text-[#3f4946] font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => onNavigateStep(4)}
              className="flex-2 py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-xs uppercase"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Photos */}
      {currentStep === 4 && (
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-5 text-center">
          <div className="border-2 border-dashed border-[#005145] rounded-3xl p-8 bg-[#f0eded] space-y-2">
            <span className="material-symbols-outlined text-[48px] text-[#005145]">add_a_photo</span>
            <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">
              Soo Geli Sawirada Guriga (Upload Photos)
            </h4>
            <p className="text-xs text-[#3f4946]">
              Sawirada HD ah waxay kordhiyaan dadka guriga kireysanaya.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {draft.images.map((img, i) => (
              <div key={i} className="aspect-video rounded-xl overflow-hidden relative border border-[#bec9c5]">
                <img src={img} alt="Uploaded preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onNavigateStep(3)}
              className="flex-1 py-3.5 rounded-2xl bg-[#e5e2e1] text-[#3f4946] font-bold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => onNavigateStep(5)}
              className="flex-2 py-3.5 rounded-2xl bg-[#005145] text-white font-bold text-xs uppercase"
            >
              Final Step
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Pricing ETB & Final Publish */}
      {currentStep === 5 && (
        <div className="bg-[#fcf9f8] p-6 rounded-3xl listing-card-shadow space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#3f4946] mb-1">
              Qiimaha Guriga (ETB - Ethiopian Birr):
            </label>
            <input
              type="number"
              min="1000"
              required
              value={draft.priceEtb}
              onChange={(e) => setDraft({ ...draft, priceEtb: Number(e.target.value) })}
              className="w-full p-4 bg-[#f0eded] rounded-2xl text-2xl font-poppins font-black text-[#005145] text-center"
            />
          </div>

          <div className="p-4 bg-[#f0eded] rounded-2xl text-xs space-y-2 border border-[#bec9c5]/40">
            <div className="flex justify-between font-bold">
              <span>Magaca:</span>
              <span>{draft.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <span>Jigjiga, {draft.kebele}</span>
            </div>
            <div className="flex justify-between">
              <span>Nooca:</span>
              <span>{draft.mode === 'kiro' ? 'Kiro' : 'Iib'} ({draft.category})</span>
            </div>
          </div>

          <button
            onClick={handleFinalSubmit}
            className="w-full py-4 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-black text-sm uppercase tracking-wider shadow-lg"
          >
            Daabac Guriga (Publish Property Now)
          </button>
        </div>
      )}

    </div>
  );
};
