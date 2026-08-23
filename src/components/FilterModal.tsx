import React, { useState } from 'react';
import type { FilterState, ListingMode, PropertyCategory } from '../types';
import { ALL_JIGJIGA_LOCATIONS } from '../data/jigjigaLocations';

interface FilterModalProps {
  initialFilter: FilterState;
  onApply: (filter: FilterState) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  initialFilter,
  onApply,
  onClose
}) => {
  const [mode, setMode] = useState<ListingMode>(initialFilter.mode);
  const [kebele, setKebele] = useState<string>(initialFilter.kebele || 'All');
  const [category, setCategory] = useState<PropertyCategory>(initialFilter.category);
  const [maxPriceEtb, setMaxPriceEtb] = useState<number>(initialFilter.maxPriceEtb || 500000);
  const [beds, setBeds] = useState<string>(initialFilter.beds || 'any');
  const [waterRequired, setWaterRequired] = useState<boolean>(initialFilter.waterRequired);
  const [powerRequired, setPowerRequired] = useState<boolean>(initialFilter.powerRequired);
  const [hasVideo, setHasVideo] = useState<boolean>(Boolean(initialFilter.hasVideo));

  const filterLocations = ['All', ...ALL_JIGJIGA_LOCATIONS];

  const categories: PropertyCategory[] = ['All Properties', 'Family House', 'Single Room', 'Studio', 'Villa', 'Apartment'];

  const handleApply = () => {
    onApply({
      mode,
      searchLocation: 'Jigjiga',
      kebele: kebele === 'All' ? '' : kebele,
      category,
      minPriceEtb: 0,
      maxPriceEtb,
      beds,
      waterRequired,
      powerRequired,
      hasVideo
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-md w-full rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="font-poppins text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span className="material-symbols-outlined text-rose-600">tune</span>
            <span>Guryaha Jigjiga (Filters)</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
            Nooca Guriga (Listing Type):
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setMode('kiro')}
              className={`py-2 rounded-xl font-bold text-xs transition ${
                mode === 'kiro' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-700'
              }`}
            >
              Kiro (Rent)
            </button>
            <button
              onClick={() => setMode('iib')}
              className={`py-2 rounded-xl font-bold text-xs transition ${
                mode === 'iib' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-700'
              }`}
            >
              Iib (Sale)
            </button>
          </div>
        </div>

        {/* Kebele & Xaafada Selection for Jigjiga */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
            Dooro Kebele ama Xaafada Jigjiga:
          </label>
          <select
            value={kebele}
            onChange={(e) => setKebele(e.target.value)}
            className="w-full p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 border border-slate-200 focus:ring-2 focus:ring-rose-600 focus:outline-none"
          >
            {filterLocations.map((loc) => (
              <option key={loc} value={loc}>{loc === 'All' ? '🌐 Dhamaan Xaafadaha (All Locations)' : loc}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
            Nooca Guriga (Property Category):
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  category === cat
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Max Price Slider ETB */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
            <span>Qiimaha Ugu Sareeya (ETB):</span>
            <span className="text-rose-600 font-poppins font-black">{maxPriceEtb.toLocaleString()} ETB</span>
          </div>
          <input
            type="range"
            min="5000"
            max="10000000"
            step="5000"
            value={maxPriceEtb}
            onChange={(e) => setMaxPriceEtb(Number(e.target.value))}
            className="w-full accent-rose-600"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
            Tirada Qolalka (Bedrooms):
          </label>
          <div className="flex justify-between bg-slate-100 p-1 rounded-2xl">
            {['any', '1', '2', '3', '4+'].map((b) => (
              <button
                key={b}
                onClick={() => setBeds(b)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase ${
                  beds === b ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-700'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities & Video Tour Checkboxes */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-900">
            <input
              type="checkbox"
              checked={hasVideo}
              onChange={(e) => setHasVideo(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-600"
            />
            <span className="flex items-center space-x-1 text-rose-600 font-bold">
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              <span>Keliya Guryaha Muuqaalka Leh (Video Tour Available)</span>
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-900">
            <input
              type="checkbox"
              checked={waterRequired}
              onChange={(e) => setWaterRequired(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-600"
            />
            <span className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-[18px] text-blue-600">water_drop</span>
              <span>Biyaha Wakaallada Jigjiga</span>
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-slate-900">
            <input
              type="checkbox"
              checked={powerRequired}
              onChange={(e) => setPowerRequired(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-600"
            />
            <span className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-[18px] text-amber-500">bolt</span>
              <span>Laydhka 24 Saac (Solar / Mains)</span>
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="pt-4 flex space-x-3">
          <button
            onClick={() => {
              setMode('kiro');
              setKebele('All');
              setCategory('All Properties');
              setMaxPriceEtb(500000);
              setBeds('any');
              setWaterRequired(false);
              setPowerRequired(false);
              setHasVideo(false);
            }}
            className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition"
          >
            Reset
          </button>

          <button
            onClick={handleApply}
            className="flex-2 py-3 px-6 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition"
          >
            Aruuri Guryaha (Apply Filters)
          </button>
        </div>

      </div>
    </div>
  );
};
