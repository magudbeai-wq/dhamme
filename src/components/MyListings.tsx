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
    <main className="max-w-screen-xl mx-auto p-5 pb-24 space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center bg-[#fcf9f8] p-5 rounded-3xl listing-card-shadow">
        <div>
          <span className="text-[10px] font-bold text-[#005145] uppercase tracking-wider block">
            Maamulka Guryahaaga
          </span>
          <h1 className="font-poppins text-2xl font-bold text-[#1b1b1c]">
            Guryahayga (My Listings)
          </h1>
        </div>

        <button
          onClick={onStartNewListing}
          className="px-4 py-2 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs shadow-md flex items-center space-x-1"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Soo Dhig Guri</span>
        </button>
      </div>

      {userListings.length === 0 ? (
        <div className="text-center py-16 bg-[#fcf9f8] rounded-3xl border border-[#bec9c5]/40 p-6 space-y-3">
          <span className="material-symbols-outlined text-[48px] text-[#005145]">domain</span>
          <h3 className="font-poppins font-bold text-lg text-[#1b1b1c]">
            Weli Ma Jirto Guryo Aad Soo Dhigtay Jigjiga
          </h3>
          <p className="text-xs text-[#3f4946]">
            Taabo badhanka "Soo Dhig Guri" si aad guri cusub ugu soo add garayso DHAMME.
          </p>
          <button
            onClick={onStartNewListing}
            className="px-6 py-3 rounded-2xl bg-[#005145] text-white font-poppins font-bold text-xs uppercase shadow-md"
          >
            Soo Dhig Gurigii Ugu Horeeyay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userListings.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property)}
              className="bg-[#fcf9f8] p-4 rounded-2xl listing-card-shadow flex gap-4 cursor-pointer hover:border hover:border-[#005145]/40 transition"
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-28 h-24 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-poppins font-bold text-sm text-[#1b1b1c]">{property.title}</h4>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#99e8d5]/40 text-[#00201a]">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-[#005145] font-semibold">{property.city}, {property.kebele}</span>
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
