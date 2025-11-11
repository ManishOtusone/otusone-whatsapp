import React from 'react'

const CallToActions = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h4 className="font-bold">OTUSONE Training Call</h4>
            <p>Schedule your platform onboarding call</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h4 className="font-bold">Refer & Earn 💸</h4>
            <p>Share your referral with your friends & earn ₹2000</p>
          </div>
        </div>
      );
}

export default CallToActions
