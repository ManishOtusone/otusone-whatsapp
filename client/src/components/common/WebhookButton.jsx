import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import { postApplicationJsonRequest } from '../../services/apiServices';

const SubscribeWebhookButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await postApplicationJsonRequest('/webhook/subscribe-webhook');
      setMessage(res.data.message || 'Subscription successful');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-300 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <FaSpinner className="animate-spin" />
            Subscribing...
          </span>
        ) : (
          'Subscribe Webhook'
        )}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SubscribeWebhookButton;
