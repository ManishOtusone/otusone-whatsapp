import React from 'react'

const OfferAccessCode = () => {
    return (
        <div className="bg-orange-50 p-4 rounded flex flex-col md:flex-row items-center gap-2 shadow">
          <span className="text-sm font-medium">Got any offer access code?</span>
          <input type="text" className="border rounded px-2 py-1" placeholder="Enter access code" />
          <button className="bg-orange-400 text-white px-4 py-1 rounded">Activate</button>
          <button className="text-orange-600 underline">View Offers</button>
        </div>
      );
}
  

export default OfferAccessCode
