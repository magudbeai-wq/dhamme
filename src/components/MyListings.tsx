import React from 'react';
import type { PropertyListing } from '../types';

interface MyListingsProps {
  userListings: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
  onStartNewListing: () => void;
}

export const MyListings: React.FC<MyListingsProps> = ({
  userListings,
  onSelectProperty,
  onStartNewListing
}) => {
  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-4 pb-28 space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center bg-[#fcf9f8] p-5 sm:p-6 rounded-3xl listing-card-shadow border border-[#bec9c5]/40">
        <div>
          <span className="text-[10px] font-extrabold text-[#005145] uppercase tracking-wider block">
            Maamulka Guryahaaga
          </span>
          <h1 className="font-poppins text-2xl font-black text-[#1b1b1c]">
            Guryahayga (My Listings)
          </h1>
        </div>

        <button
          onClick={onStartNewListing}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#005145] to-[#0f6b5c] text-white font-poppins font-bold text-xs shadow-md flex items-center space-x-1.5 hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Soo Dhig Guri</span>
        </button>
      </div>

      {userListings.length === 0 ? (
        <div className="text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f0eded] text-[#005145] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[36px]">domain</span>
          </div>
          <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
            Weli Ma Jirto Guryo Aad Soo Dhigtay
          </h3>
          <p className="text-xs text-[#3f4946] max-w-xs mx-auto">
            Taabo badhanka "Soo Dhig Guri" si aad guri cusub ugu soo add garayso DHAMME.
          </p>
          <button
            onClick={onStartNewListing}
            className="px-6 py-3.5 rounded-2xl bg-[#005145] hover:bg-[#0f6b5c] text-white font-poppins font-bold text-xs uppercase shadow-md transition-all active:scale-95"
          >
            Soo Dhig Gurigii Ugu Horeeyay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userListings.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="bg-[#fcf9f8] p-4 rounded-3xl listing-card-shadow flex gap-4 cursor-pointer border border-[#bec9c5]/40 hover:border-[#005145] transition-all hover:-translate-y-0.5"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-28 h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-poppins font-bold text-sm text-[#1b1b1c] line-clamp-1">{property.title}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#005145]/10 text-[#005145]">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-[#005145] font-semibold block">{property.city}, {property.kebele}</span>
                </div>
                <div className="font-poppins font-black text-sm text-[#005145]">
                  {property.priceLocalFormatted}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </main>
  );
};
