import React from 'react';

const StepCampaignName=({ campaignName, onChange, onNext }) =>{

  const handleInputChange = (e) => {
    const lowercaseValue = e.target.value.toLowerCase();
    onChange(lowercaseValue);
  };
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={campaignName}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="bg-green-900 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  

export default StepCampaignName 
