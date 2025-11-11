import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirm = async () => {
      const plan = searchParams.get('plan');
      if (plan) {
        await axios.get(`/api/payments/confirm-subscription?plan=${plan}`);
      }
    };
    confirm();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">🎉 Subscription Successful</h1>
      <p className="mt-2 text-gray-600">Thank you for subscribing!</p>
    </div>
  );
}
