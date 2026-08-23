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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#111315]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white max-w-md w-full rounded-t-3xl sm:rounded-3xl p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto border border-[#E8E5DF]">
        
        <div className="flex justify-between items-center pb-2 border-b border-[#E8E5DF]">
          <h2 className="font-serif text-xl font-bold text-[#17191C] flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#111315]">tune</span>
            <span>Guryaha Jigjiga (Filters)</span>
          </h2>
          <button onClick={onClose} className="text-[#74777B] hover:text-[#17191C]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div>
          <label className="block text-xs font-semibold text-[#74777B] mb-2 uppercase tracking-wider">
            Nooca Guriga (Listing Type):
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#FAF9F6] p-1 rounded-xl border border-[#E8E5DF]">
            <button
              onClick={() => setMode('kiro')}
              className={`py-2 rounded-lg font-semibold text-xs transition ${
                mode === 'kiro' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#74777B]'
              }`}
            >
              Kiro (Rent)
            </button>
            <button
              onClick={() => setMode('iib')}
              className={`py-2 rounded-lg font-semibold text-xs transition ${
                mode === 'iib' ? 'bg-[#111315] text-white shadow-xs' : 'text-[#74777B]'
              }`}
            >
              Iib (Sale)
            </button>
          </div>
        </div>

        {/* Kebele & Xaafada Selection for Jigjiga */}
        <div>
          <label className="block text-xs font-semibold text-[#74777B] mb-2 uppercase tracking-wider">
            Dooro Kebele ama Xaafada Jigjiga:
          </label>
          <select
            value={kebele}
            onChange={(e) => setKebele(e.target.value)}
            className="w-full p-3 bg-[#FAF9F6] rounded-xl text-xs font-semibold text-[#17191C] border border-[#E8E5DF] focus:border-[#111315] focus:outline-none"
          >
            {filterLocations.map((loc) => (
              <option key={loc} value={loc}>{loc === 'All' ? '🌐 Dhamaan Xaafadaha (All Locations)' : loc}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#74777B] mb-2 uppercase tracking-wider">
            Nooca Guriga (Property Category):
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${
                  category === cat
                    ? 'bg-[#111315] text-white border-[#111315]'
                    : 'bg-white text-[#74777B] border-[#E8E5DF] hover:border-[#111315]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Max Price Slider ETB */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-[#74777B] mb-2">
            <span>Qiimaha Ugu Sareeya (ETB):</span>
            <span className="text-[#17191C] font-serif font-bold">{maxPriceEtb.toLocaleString()} ETB</span>
          </div>
          <input
            type="range"
            min="5000"
            max="10000000"
            step="5000"
            value={maxPriceEtb}
            onChange={(e) => setMaxPriceEtb(Number(e.target.value))}
            className="w-full accent-[#C8A96B]"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-semibold text-[#74777B] mb-2 uppercase tracking-wider">
            Tirada Qolalka (Bedrooms):
          </label>
          <div className="flex justify-between bg-[#FAF9F6] p-1 rounded-xl border border-[#E8E5DF]">
            {['any', '1', '2', '3', '4+'].map((b) => (
              <button
                key={b}
                onClick={() => setBeds(b)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition uppercase ${
                  beds === b ? 'bg-[#111315] text-white' : 'text-[#74777B]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities & Video Tour Checkboxes */}
        <div className="space-y-3 pt-2 border-t border-[#E8E5DF]">
          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#17191C]">
            <input
              type="checkbox"
              checked={hasVideo}
              onChange={(e) => setHasVideo(e.target.checked)}
              className="w-4 h-4 rounded text-[#111315] focus:ring-[#111315]"
            />
            <span className="flex items-center space-x-1 text-[#17191C]">
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              <span>Keliya Guryaha Muuqaalka Leh (Video Tour Available)</span>
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#17191C]">
            <input
              type="checkbox"
              checked={waterRequired}
              onChange={(e) => setWaterRequired(e.target.checked)}
              className="w-4 h-4 rounded text-[#111315] focus:ring-[#111315]"
            />
            <span className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-[18px] text-[#74777B]">water_drop</span>
              <span>Biyaha Wakaallada Jigjiga</span>
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#17191C]">
            <input
              type="checkbox"
              checked={powerRequired}
              onChange={(e) => setPowerRequired(e.target.checked)}
              className="w-4 h-4 rounded text-[#111315] focus:ring-[#111315]"
            />
            <span className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-[18px] text-[#C8A96B]">bolt</span>
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
            className="flex-1 py-3 rounded-xl bg-white border border-[#E8E5DF] text-[#74777B] font-semibold text-xs hover:border-[#111315] transition"
          >
            Reset
          </button>

          <button
            onClick={handleApply}
            className="flex-2 py-3 px-6 rounded-xl bg-[#111315] text-white font-semibold text-xs shadow-xs hover:bg-[#17191C] transition"
          >
            Aruuri Guryaha (Apply Filters)
          </button>
        </div>

      </div>
    </div>
  );
};
