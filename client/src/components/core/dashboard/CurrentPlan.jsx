// import React, { useState } from 'react';
// import axios from 'axios';
// import { postApplicationJsonRequest } from '../../../services/apiServices';

// const CurrentPlan = ({ plan, renewalDate }) => {
//   const [showPlans, setShowPlans] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleUpgradeClick = () => {
//     setShowPlans(true);
//   };

//   const subscribe = async (planName) => {
//     try {
//       setLoading(true);
//       const res = await postApplicationJsonRequest('/checkout/create-checkout-session', { plan: planName });
//       window.location.href = res.data.url; 
//     } catch (err) {
//       console.error(err);
//       alert('Failed to initiate payment.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded shadow mt-4">
//       <h4 className="text-sm font-semibold">Current Plan</h4>
//       <p>{plan} (renews on {renewalDate})</p>
//       {!showPlans ? (
//         <button
//           className="bg-green-500 text-white mt-2 px-4 py-2 rounded"
//           onClick={handleUpgradeClick}
//         >
//           Upgrade Now
//         </button>
//       ) : (
//         <div className="mt-4 space-y-2">
//           <button
//             onClick={() => subscribe('Basic')}
//             className="bg-blue-500 text-white px-4 py-2 rounded w-full"
//             disabled={loading}
//           >
//             Subscribe to Basic – $20
//              {/* (₹499) */}
//           </button>
//           <button
//             onClick={() => subscribe('Pro')}
//             className="bg-purple-500 text-white px-4 py-2 rounded w-full"
//             disabled={loading}
//           >
//             Subscribe to Pro – $45
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CurrentPlan;



import React, { useState } from 'react';
import { postApplicationJsonRequest } from '../../../services/apiServices';
import toast from 'react-hot-toast';

const CurrentPlan = ({ plan, renewalDate }) => {
  const [showPlans, setShowPlans] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(plan);

  const handleUpgradeClick = () => setShowPlans(true);

  const subscribe = async (planName) => {
    try {
      setLoading(true);
      const res = await postApplicationJsonRequest('/checkout/upgrade-plan', { plan: planName });
      alert(`Plan upgraded to ${res.data.data.plan}`);
      toast.success(`Plan upgraded to ${res.data.data.plan}`);
      // Optionally, you can redirect to a success page or refresh the current page 
      // window.location.href = '/subscription/success';
      // or refresh the current page to reflect the new plan
      window.location.reload();  
      // Update the current plan state

      setCurrentPlan(res.data.data.plan);
      setShowPlans(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upgrade plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h4 className="text-sm font-semibold">Current Plan</h4>
      <p>{currentPlan} (renews on {renewalDate})</p>
      {!showPlans ? (
        <button
          className="bg-green-500 text-white mt-2 px-4 py-2 rounded"
          onClick={handleUpgradeClick}
        >
          Upgrade Now
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <button
            onClick={() => subscribe('Basic')}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            Upgrade to Basic – ₹1699
          </button>
          <button
            onClick={() => subscribe('Pro')}
            className="bg-purple-500 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            Upgrade to Pro – ₹3849
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentPlan;
