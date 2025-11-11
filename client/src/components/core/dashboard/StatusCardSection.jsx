import React, { useEffect,useState } from 'react'
import { getRequest } from '../../../services/apiServices';

const StatusCardSection = () =>{
  const [subscriptionStatus, setSubscriptionStatus] = useState();
  const getsubscriptionStatus = async() => {
        const response = await getRequest('/subscription/get');
        if (response.status === 200) {
          setSubscriptionStatus(response.data.data);
        }
        return 'Error fetching status'; 
  };
  useEffect(() => {
    const status = getsubscriptionStatus();
  }, []);
    return  (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded shadow">
          <Card label="WhatsApp Business API Status" value={subscriptionStatus?.wabaAPIStatus} color="green" />
          <Card label="Quality Rating" value={subscriptionStatus?.qualityRating} color="green" />
          <Card label="Remaining Quota" value={subscriptionStatus?.wccBalance} />
        </div>
      );
};
  
  const Card = ({ label, value, color }) => (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-lg font-semibold ${color ? `text-${color}-600` : ''}`}>
        {value}
      </span>
    </div>
  );
  
export default StatusCardSection
