import React from 'react';
import { FiZap, FiShield } from 'react-icons/fi';
import { RiVipCrownLine } from 'react-icons/ri';

const OverviewSection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="border p-4 rounded-lg flex items-center gap-3 bg-white shadow-sm">
        <RiVipCrownLine className="text-green-500 text-xl" />
        <div>
          <p className="text-sm font-semibold">Your daily Meta messaging limit</p>
          <p className="text-xs text-gray-500">Tier Information Unavailable</p>
        </div>
      </div>
      <div className="border p-4 rounded-lg flex items-center gap-3 bg-white shadow-sm">
        <FiZap className="text-orange-500 text-xl" />
        <div>
          <p className="text-sm font-semibold">Consecutive days of messaging</p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-orange-300' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="border p-4 rounded-lg flex items-center gap-3 bg-white shadow-sm">
        <FiShield className="text-blue-500 text-xl" />
        <div>
          <p className="text-sm font-semibold">Messaging Quality</p>
          <p className="text-xs text-gray-500">Quality Unavailable</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
