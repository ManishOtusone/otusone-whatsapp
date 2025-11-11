import React from 'react';
import { getRequest } from '../../services/apiServices';

const ConnectMetaBusiness = ({ isMetaConnected }) => {
  const handleConnect = async () => {
    try {
      const res = await getRequest('/meta/login-url', { withCredentials: true });
      window.location.href = res.data.loginUrl;
    } catch (error) {
      console.error('Error generating Meta login URL:', error);
      alert('Failed to connect to Meta Business. Please try again.');
    }
  };

  if (isMetaConnected) {
    return <p className="text-green-600 font-medium">Meta Business is connected</p>;
  }

  return (
    <button
      onClick={handleConnect}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
    >
      Connect Meta Business
    </button>
  );
};

export default ConnectMetaBusiness;
