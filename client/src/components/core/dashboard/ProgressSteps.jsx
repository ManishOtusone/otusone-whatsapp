import React from 'react'

const steps = [
    { step: 'Step 1', label: 'Get Your API Live', status: 'done' },
    { step: 'Step 2', label: 'Get FBM Verified', status: 'pending' },
    { step: 'Step 3', label: 'Recharge WCC', status: 'pending' },
    { step: 'Step 4', label: 'Spend 500 WCC', status: 'pending' },
  ];
  
  const ProgressSteps = () => {
    return (
        <div className="bg-teal-800 text-white rounded p-4 shadow">
          <div className="flex justify-between items-center">
            {steps.map(({ step, label, status }) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full ${status === 'done' ? 'bg-green-500' : 'bg-yellow-400'}`} />
                <span className="text-xs mt-1">{step}</span>
              </div>
            ))}
          </div>
        </div>
      );
  }
  

export default ProgressSteps
