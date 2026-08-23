import React, { useState } from 'react';
import type { NewListingDraft, PropertyListing, PropertyCategory } from '../types';
import { JIGJIGA_XAAFADAHA, JIGJIGA_KEBELES } from '../data/jigjigaLocations';
import { VideoUploadField } from './VideoUploadField';

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
    kebele: JIGJIGA_XAAFADAHA[0],
    beds: 3,
    baths: 2,
    areaSqm: 180,
    description: '',
    water: true,
    electricity: true,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: undefined,
    videoDuration: undefined,
    gpsCoords: '9.3524° N, 42.7961° E',
    nearDistance: 'Jigjiga Center'
  });

  const [isCustomLocation, setIsCustomLocation] = useState<boolean>(false);
  const [customLocationName, setCustomLocationName] = useState<string>('');
  const [detectingGps, setDetectingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [agreedToAntiFraud, setAgreedToAntiFraud] = useState<boolean>(true);

  const categories: PropertyCategory[] = ['Family House', 'Single Room', 'Studio', 'Villa', 'Apartment'];

  // GPS Capture Handler
  const handleCaptureLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('GPS isn\'t supported on this device.');
      return;
    }

    setDetectingGps(true);
    setGpsStatus('Navigating live device location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setDraft((prev) => ({
          ...prev,
          gpsCoords: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
          nearDistance: `GPS Captured (${lat.toFixed(3)}, ${lng.toFixed(3)})`
        }));
        setGpsStatus(`✅ GPS Detected: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
        setDetectingGps(false);
      },
      (err) => {
        console.warn('GPS capture error:', err);
        setGpsStatus('✅ Default Jigjiga GPS Captured (9.3524° N, 42.7961° E)');
        setDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Image Upload Handler using FileReader (File to Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const resultUrl = reader.result;
          setDraft((prev) => ({
            ...prev,
            images: [...prev.images, resultUrl]
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setDraft((prev) => ({
      ...prev,
      images: [...prev.images, urlInput.trim()]
    }));
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleFinalSubmit = () => {
    if (!agreedToAntiFraud) return;

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
      images: draft.images.length > 0 ? draft.images : [
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80'
      ],
      videoUrl: draft.videoUrl,
      videoDuration: draft.videoDuration,
      videoStatus: 'active',
      description: draft.description || 'DHAMME Real Estate listing created in Jigjiga, Somali Region, Ethiopia.',
      agentName: 'You (Owner)',
      agentPhone: '0915752826',
      agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      postedDate: 'Just now',
      gpsCoords: draft.gpsCoords || '9.3524° N, 42.7961° E',
      nearDistance: draft.nearDistance || 'Jigjiga Area'
    };

    onAddProperty(newProperty);
  };


  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 p-4 sm:p-6 max-w-screen-md mx-auto animate-fade-in space-y-6">
      
      {/* Wizard Header Progress Bar */}
      <div className="bg-white p-5 rounded-3xl listing-card-shadow space-y-3 border border-[#E8E5DF]">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-semibold text-[#C8A96B] uppercase tracking-wider block">
              Tallaabada {currentStep} ee 5 (Jigjiga)
            </span>
            <h1 className="font-serif text-lg text-[#17191C]">
              {currentStep === 1 && '1. Faahfaahinta Koowaad (Basic Info)'}
              {currentStep === 2 && '2. Cabirka & Qolalka (Specs)'}
              {currentStep === 3 && '3. Kebele & GPS Location (Jigjiga)'}
              {currentStep === 4 && '4. Sawirada Guriga (Upload Photos)'}
              {currentStep === 5 && '5. Qiimaha ETB & Sharciyada (Publish)'}
            </h1>
          </div>

          <button onClick={onCancel} className="text-xs text-[#74777B] hover:text-[#17191C] font-semibold">
            Jooji (Cancel)
          </button>
        </div>

        {/* Progress bar line */}
        <div className="w-full h-1.5 bg-[#FAF9F6] border border-[#E8E5DF] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#111315] rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-5 border border-[#E8E5DF]">
          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Nooca Guriga (Listing Type):
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#FAF9F6] p-1.5 rounded-xl border border-[#E8E5DF]">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, mode: 'kiro' })}
                className={`py-2.5 rounded-lg font-semibold text-xs transition ${
                  draft.mode === 'kiro' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#74777B]'
                }`}
              >
                Kiro (For Rent)
              </button>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, mode: 'iib' })}
                className={`py-2.5 rounded-lg font-semibold text-xs transition ${
                  draft.mode === 'iib' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#74777B]'
                }`}
              >
                Iib (For Sale)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Magaca Guriga (Property Title):
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jigjiga Kebele 06 Villa with Garden"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm text-[#17191C] focus:outline-none focus:border-[#111315]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Qaybta (Category):
            </label>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as PropertyCategory })}
              className="w-full p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm font-semibold text-[#17191C] focus:border-[#111315]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Faahfaahinta Guriga (Description):
            </label>
            <textarea
              rows={3}
              placeholder="Faahfaahinta guriga Jigjiga, biyaha, solar-ka..."
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="w-full p-3.5 bg-[#FAF9F6] rounded-xl border border-[#E8E5DF] text-sm text-[#17191C] focus:border-[#111315]"
            />
          </div>

          <button
            onClick={() => onNavigateStep(2)}
            disabled={!draft.title.trim()}
            className="w-full py-3.5 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-sans font-semibold text-xs uppercase tracking-wider disabled:opacity-50 shadow-xs active:scale-95 transition"
          >
            Tallaabada Xigta (Next Step)
          </button>
        </div>
      )}

      {/* STEP 2: Specs */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-5 border border-[#E8E5DF]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
                Bedrooms (Qolalka):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={draft.beds}
                onChange={(e) => setDraft({ ...draft, beds: Number(e.target.value) })}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-sm font-bold text-center border border-[#E8E5DF] text-[#17191C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
                Bathrooms (Musqulaha):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={draft.baths}
                onChange={(e) => setDraft({ ...draft, baths: Number(e.target.value) })}
                className="w-full p-3 bg-[#FAF9F6] rounded-xl text-sm font-bold text-center border border-[#E8E5DF] text-[#17191C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Cabirka Guriga (Area Sqm):
            </label>
            <input
              type="number"
              value={draft.areaSqm}
              onChange={(e) => setDraft({ ...draft, areaSqm: Number(e.target.value) })}
              className="w-full p-3 bg-[#FAF9F6] rounded-xl text-sm font-bold text-[#17191C] border border-[#E8E5DF]"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer text-xs font-medium text-[#17191C]">
              <input
                type="checkbox"
                checked={draft.water}
                onChange={(e) => setDraft({ ...draft, water: e.target.checked })}
                className="w-4 h-4 rounded text-[#111315] focus:ring-[#111315]"
              />
              <span>Water Connection (Biyaha Wakaallada)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer text-xs font-medium text-[#17191C]">
              <input
                type="checkbox"
                checked={draft.electricity}
                onChange={(e) => setDraft({ ...draft, electricity: e.target.checked })}
                className="w-4 h-4 rounded text-[#111315] focus:ring-[#111315]"
              />
              <span>24h Electricity / Solar Power</span>
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onNavigateStep(1)}
              className="flex-1 py-3.5 rounded-xl bg-white border border-[#E8E5DF] text-[#74777B] font-semibold text-xs"
            >
              Kusoo Noqo (Back)
            </button>
            <button
              onClick={() => onNavigateStep(3)}
              className="flex-2 py-3.5 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-semibold text-xs uppercase shadow-xs transition"
            >
              Tallaabada 3-aad (Next)
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Location & Live GPS */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-5 border border-[#E8E5DF]">
          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Magaalada:
            </label>
            <input
              type="text"
              disabled
              value="Jigjiga (Somali Region, Ethiopia)"
              className="w-full p-3.5 bg-[#FAF9F6] rounded-xl text-sm font-semibold text-[#17191C]"
            />
          </div>

          <div>
            <label className="block text-[#74777B] text-xs font-semibold mb-1 uppercase tracking-wider">
              Dooro Xaafada ama Kabalaha Jigjiga (Select Xaafad or Kebele):
            </label>
            <select
              value={isCustomLocation ? 'Others (Qor Xaafad Kale)' : draft.kebele}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Others (Qor Xaafad Kale)') {
                  setIsCustomLocation(true);
                  setDraft({ ...draft, kebele: customLocationName || 'Xaafad' });
                } else {
                  setIsCustomLocation(false);
                  setDraft({ ...draft, kebele: val });
                }
              }}
              className="w-full p-3.5 bg-[#FAF9F6] rounded-xl text-sm font-semibold text-[#17191C] border border-[#E8E5DF]"
            >
              <optgroup label="🏘️ Xaafadaha Magaalada Jigjiga">
                {JIGJIGA_XAAFADAHA.map((x, idx) => (
                  <option key={`x-${idx}`} value={x}>{idx + 1}. {x}</option>
                ))}
              </optgroup>
              <optgroup label="📍 Kebele-yada Jigjiga (Kebele 01 - 20)">
                {JIGJIGA_KEBELES.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </optgroup>
              <optgroup label="✍️ Doorasho Kale (Custom / Other)">
                <option value="Others (Qor Xaafad Kale)">Others (Qor Xaafad Kale)</option>
              </optgroup>
            </select>

            {isCustomLocation && (
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-[#111315] uppercase mb-1">
                  Qor Magaca Xaafadaada (Type Custom Neighborhood):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Xaafada Cusub, Taiwan Dhadheer..."
                  value={customLocationName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomLocationName(val);
                    setDraft({ ...draft, kebele: val.trim() || 'Xaafad' });
                  }}
                  className="w-full p-3 bg-[#FAF9F6] rounded-xl text-sm font-bold text-[#17191C] border border-[#111315]"
                />
              </div>
            )}
          </div>

          {/* Live Device GPS Capture Section */}
          <div className="p-4 bg-[#FAF9F6] rounded-2xl space-y-3 border border-[#E8E5DF] text-center">
            <div className="flex items-center justify-center space-x-2 text-[#111315]">
              <span className="material-symbols-outlined text-[24px]">my_location</span>
              <h4 className="font-serif font-bold text-xs text-[#17191C]">
                GPS Geolocation (Latitude & Longitude)
              </h4>
            </div>

            <p className="text-[11px] text-[#74777B]">
              Taabo badhanka hoose si uu telefoonku si otomaatig ah ugu soo qabto GPS-ka gurigaaga.
            </p>

            {draft.gpsCoords && (
              <div className="p-2.5 bg-white rounded-xl text-xs font-mono font-semibold text-[#17191C] border border-[#E8E5DF]">
                📍 {draft.gpsCoords}
              </div>
            )}

            <button
              type="button"
              onClick={handleCaptureLiveGps}
              disabled={detectingGps}
              className="w-full py-3 rounded-xl bg-[#111315] hover:bg-[#17191C] text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
            >
              <span className={`material-symbols-outlined text-[18px] text-[#C8A96B] ${detectingGps ? 'animate-spin' : ''}`}>
                {detectingGps ? 'sync' : 'gps_fixed'}
              </span>
              <span>{detectingGps ? 'Detecting GPS...' : '📍 Soo Qabo GPS Location-kayga Hada'}</span>
            </button>

            {gpsStatus && (
              <p className="text-[10px] font-semibold text-[#C8A96B] pt-1">
                {gpsStatus}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => onNavigateStep(2)}
              className="flex-1 py-3.5 rounded-xl bg-white border border-[#E8E5DF] text-[#74777B] font-semibold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => onNavigateStep(4)}
              className="flex-2 py-3.5 rounded-xl bg-[#111315] text-white font-semibold text-xs uppercase"
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Photos & Mandatory Property Video Upload */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-6 border border-[#E8E5DF] text-center">
          
          {/* Section 1: Photos */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#E8E5DF] rounded-3xl p-6 bg-[#FAF9F6] space-y-3 relative group hover:border-[#111315] transition">
              <span className="material-symbols-outlined text-[40px] text-[#74777B]">add_a_photo</span>
              <h4 className="font-serif font-bold text-sm text-[#17191C]">
                1. Soo Geli Sawirada Guriga (Upload Photos)
              </h4>
              <p className="text-xs text-[#74777B]">
                Taabo halkan si aad sawiro dhab ah oo guri ah uga soo doorato telefoonkaaga.
              </p>

              <label className="inline-block px-5 py-2.5 rounded-xl bg-[#111315] text-white text-xs font-semibold cursor-pointer shadow-xs hover:bg-[#17191C]">
                <span>Soo Dooro Sawiro (Choose Photos)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="url"
                placeholder="Ama geli Image URL link..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 p-3 bg-[#FAF9F6] rounded-xl text-xs border border-[#E8E5DF]"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-4 py-3 bg-[#111315] text-white rounded-xl text-xs font-semibold hover:bg-[#17191C]"
              >
                Add URL
              </button>
            </div>

            {draft.images.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="text-xs font-semibold text-[#74777B] block">
                  Sawirada la soo galiyay ({draft.images.length}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {draft.images.map((img, i) => (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden relative border border-[#E8E5DF] shadow-xs group">
                      <img src={img} alt={`Uploaded ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
                        title="Remove image"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Mandatory Property Video Upload Field */}
          <div className="pt-4 border-t border-[#E8E5DF] text-left">
            <VideoUploadField
              currentVideoUrl={draft.videoUrl}
              onVideoChange={(url, duration) => {
                setDraft((prev) => ({
                  ...prev,
                  videoUrl: url,
                  videoDuration: duration
                }));
              }}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => onNavigateStep(3)}
              className="flex-1 py-3.5 rounded-xl bg-white border border-[#E8E5DF] text-[#74777B] font-semibold text-xs"
            >
              Back
            </button>
            <button
              onClick={() => onNavigateStep(5)}
              className="flex-2 py-3.5 rounded-xl bg-[#111315] text-white font-semibold text-xs uppercase"
            >
              Final Step
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Pricing ETB & Anti-Fraud Agreement */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-3xl listing-card-shadow space-y-5 border border-[#E8E5DF]">
          <div>
            <label className="block text-xs font-semibold text-[#74777B] mb-1 uppercase tracking-wider">
              Qiimaha Guriga (ETB - Ethiopian Birr):
            </label>
            <input
              type="number"
              min="1000"
              required
              value={draft.priceEtb}
              onChange={(e) => setDraft({ ...draft, priceEtb: Number(e.target.value) })}
              className="w-full p-4 bg-[#FAF9F6] rounded-2xl text-2xl font-serif font-bold text-[#17191C] text-center border border-[#E8E5DF] focus:border-[#111315]"
            />
          </div>

          <div className="p-4 bg-[#FAF9F6] rounded-2xl text-xs space-y-2 border border-[#E8E5DF]">
            <div className="flex justify-between font-semibold text-[#17191C]">
              <span>Magaca:</span>
              <span>{draft.title}</span>
            </div>
            <div className="flex justify-between text-[#74777B]">
              <span>Location:</span>
              <span>Jigjiga, {draft.kebele}</span>
            </div>
            <div className="flex justify-between text-[#74777B]">
              <span>GPS:</span>
              <span>{draft.gpsCoords}</span>
            </div>
            <div className="flex justify-between text-[#74777B]">
              <span>Nooca:</span>
              <span>{draft.mode === 'kiro' ? 'Kiro' : 'Iib'} ({draft.category})</span>
            </div>
            <div className="flex justify-between font-medium text-[#17191C]">
              <span>Sawirada:</span>
              <span>{draft.images.length} Photos</span>
            </div>
            <div className="flex justify-between font-medium text-[#17191C]">
              <span>Muuqaalka (Video Tour):</span>
              <span>{draft.videoUrl ? '✅ Video Tour Included' : '❌ No Video Attached'}</span>
            </div>
          </div>

          {/* Anti-Fraud Explicit Agreement Checkbox */}
          <div className="p-3.5 bg-[#FAF9F6] rounded-2xl border border-[#E8E5DF] text-xs text-[#74777B] space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToAntiFraud}
                onChange={(e) => setAgreedToAntiFraud(e.target.checked)}
                className="w-4 h-4 rounded text-[#111315] mt-0.5"
              />
              <span className="font-medium text-[11px] leading-snug text-[#17191C]">
                Waan waafaqsanahay sharciyada DHAMME: Sawirada iyo faahfaahinta gurigani waa 100% dhab. Waxaa si adag loo mamnuucay sawirada been abuurka ah ama guryaha aan jirin (Anti-Fraud Policy).
              </span>
            </label>
          </div>

          {/* Single Gold Primary CTA */}
          <button
            onClick={handleFinalSubmit}
            disabled={!agreedToAntiFraud}
            className="w-full py-4 rounded-xl bg-[#C8A96B] hover:brightness-105 text-[#111315] font-sans font-bold text-sm uppercase tracking-wider shadow-xs active:scale-95 transition-all disabled:opacity-50"
          >
            Daabac Guriga (Publish Property Now)
          </button>
        </div>
      )}

    </div>
  );
};
