import React, { useState } from 'react';
import type { FilterState, ListingMode, PropertyCategory } from '../types';

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
  const [maxPriceEtb, setMaxPriceEtb] = useState<number>(initialFilter.maxPriceEtb || 100000);
  const [beds, setBeds] = useState<string>(initialFilter.beds || 'any');
  const [waterRequired, setWaterRequired] = useState<boolean>(initialFilter.waterRequired);
  const [powerRequired, setPowerRequired] = useState<boolean>(initialFilter.powerRequired);

  const kebeles = [
    'All',
    'Kebele 01',
    'Kebele 02',
    'Kebele 03',
    'Kebele 06',
    'Kebele 08',
    'Kebele 10',
    'Garab\'ase',
    'Taiwan Area'
  ];

  const categories: PropertyCategory[] = ['All Properties', 'Family House', 'Single Room', 'Studio', 'Villa'];

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
      powerRequired
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcf9f8] max-w-md w-full rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center pb-2 border-b border-[#bec9c5]/40">
          <h2 className="font-poppins text-xl font-bold text-[#1b1b1c] flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#005145]">tune</span>
            <span>Guryaha Jigjiga (Filters)</span>
          </h2>
          <button onClick={onClose} className="text-[#645d54] hover:text-[#1b1b1c]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode Toggle */}
        <div>
          <label className="block text-xs font-bold text-[#3f4946] mb-2 uppercase tracking-wider">
            Nooca Guriga (Listing Type):
          </label>
          <div className="grid grid-cols-2 gap-2 bg-[#e5e2e1] p-1 rounded-2xl">
            <button
              onClick={() => setMode('kiro')}
              className={`py-2 rounded-xl font-bold text-xs transition ${
                mode === 'kiro' ? 'bg-[#005145] text-white shadow-sm' : 'text-[#3f4946]'
              }`}
            >
              Kiro (Rent)
            </button>
            <button
              onClick={() => setMode('iib')}
              className={`py-2 rounded-xl font-bold text-xs transition ${
                mode === 'iib' ? 'bg-[#005145] text-white shadow-sm' : 'text-[#3f4946]'
              }`}
            >
              Iib (Sale)
            </button>
          </div>
        </div>

        {/* Kebele Selection for Jigjiga */}
        <div>
          <label className="block text-xs font-bold text-[#3f4946] mb-2 uppercase tracking-wider">
            Kebele / Xaafada Jigjiga:
          </label>
          <div className="flex flex-wrap gap-2">
            {kebeles.map((k) => (
              <button
                key={k}
                onClick={() => setKebele(k)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  kebele === k
                    ? 'bg-[#005145] text-white border-[#005145]'
                    : 'bg-[#fcf9f8] text-[#3f4946] border-[#bec9c5]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-[#3f4946] mb-2 uppercase tracking-wider">
            Nooca Guriga (Property Category):
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  category === cat
                    ? 'bg-[#005145] text-white border-[#005145]'
                    : 'bg-[#fcf9f8] text-[#3f4946] border-[#bec9c5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Max Price Slider ETB */}
        <div>
          <div className="flex justify-between text-xs font-bold text-[#3f4946] mb-2">
            <span>Qiimaha Ugu Sareeya (ETB):</span>
            <span className="text-[#005145] font-poppins">{maxPriceEtb.toLocaleString()} ETB</span>
          </div>
          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={maxPriceEtb}
            onChange={(e) => setMaxPriceEtb(Number(e.target.value))}
            className="w-full accent-[#005145]"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-bold text-[#3f4946] mb-2 uppercase tracking-wider">
            Tirada Qolalka (Bedrooms):
          </label>
          <div className="flex justify-between bg-[#f0eded] p-1 rounded-2xl">
            {['any', '1', '2', '3', '4+'].map((b) => (
              <button
                key={b}
                onClick={() => setBeds(b)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase ${
                  beds === b ? 'bg-[#005145] text-white' : 'text-[#3f4946]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Checkboxes */}
        <div className="space-y-3 pt-2 border-t border-[#bec9c5]/40">
          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#1b1b1c]">
            <input
              type="checkbox"
              checked={waterRequired}
              onChange={(e) => setWaterRequired(e.target.checked)}
              className="w-4 h-4 rounded text-[#005145] focus:ring-[#005145]"
            />
            <span className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-[18px] text-[#005145]">water_drop</span>
              <span>Biyaha Wakaallada Jigjiga</span>
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer text-xs font-semibold text-[#1b1b1c]">
            <input
              type="checkbox"
              checked={powerRequired}
              onChange={(e) => setPowerRequired(e.target.checked)}
              className="w-4 h-4 rounded text-[#005145] focus:ring-[#005145]"
            />
            <span className="flex items-center space-x-1">
              <span className="material-symbols-outlined text-[18px] text-amber-600">bolt</span>
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
              setMaxPriceEtb(100000);
              setBeds('any');
              setWaterRequired(false);
              setPowerRequired(false);
            }}
            className="flex-1 py-3 rounded-2xl bg-[#e5e2e1] text-[#3f4946] font-bold text-xs hover:bg-[#eae7e7]"
          >
            Reset
          </button>

          <button
            onClick={handleApply}
            className="flex-2 py-3 px-6 rounded-2xl bg-[#005145] text-white font-bold text-xs shadow-md hover:bg-[#0f6b5c]"
          >
            Aruuri Guryaha (Apply Filters)
          </button>
        </div>

      </div>
    </div>
  );
};
