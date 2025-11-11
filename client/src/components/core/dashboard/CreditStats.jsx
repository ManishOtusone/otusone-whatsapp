import React from 'react'

const CreditStats = ({ wcc, adCredits }) => {
    return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm font-semibold">Free Service Conversation</h4>
            <div className="w-full bg-gray-200 h-2 rounded my-1">
              <div className="bg-green-500 h-2 rounded" style={{ width: '30%' }}></div>
            </div>
            <p className="text-sm text-gray-600">WhatsApp Conversation Credits (WCC): ₹ {wcc}</p>
            <button className="text-blue-500 text-sm mt-2">Buy More</button>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm">Advertisement Credits: ₹ {adCredits}</p>
            <button className="text-blue-500 text-sm mt-2">Buy Credits</button>
          </div>
        </div>
      );
}
  
export default CreditStats
