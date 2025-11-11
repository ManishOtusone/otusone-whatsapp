import { useState, useEffect } from 'react';
import { FiClock, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const launchDate = new Date('2023-12-31T00:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-[#881660] flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl shadow-lg">
              <FiMessageSquare className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-300">
            WhatsApp Business API Platform
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            We're building powerful tools to supercharge your business communications
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white bg-opacity-15 p-6">
          <div className="flex justify-center space-x-4 md:space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.days}</div>
              <div className="text-sm opacity-80">Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm opacity-80">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm opacity-80">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.seconds}</div>
              <div className="text-sm opacity-80">Seconds</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-5 p-6 rounded-xl border border-white border-opacity-10">
            <FiMail className="text-2xl text-cyan-300 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Bulk Messaging</h3>
            <p className="text-indigo-100 opacity-90">
              Send notifications, alerts and campaigns to thousands at once
            </p>
          </div>
          <div className="bg-white bg-opacity-5 p-6 rounded-xl border border-white border-opacity-10">
            <FiPhone className="text-2xl text-purple-300 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Two-Way Chat</h3>
            <p className="text-indigo-100 opacity-90">
              Real-time customer support through WhatsApp Business API
            </p>
          </div>
          <div className="bg-white bg-opacity-5 p-6 rounded-xl border border-white border-opacity-10">
            <FiClock className="text-2xl text-pink-300 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Scheduled Messages</h3>
            <p className="text-indigo-100 opacity-90">
              Plan and automate your communication workflows
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 text-center bg-white bg-opacity-10">
          <h2 className="text-2xl font-bold mb-4">Get Notified When We Launch</h2>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-l-lg bg-white bg-opacity-20 border-none text-white placeholder-indigo-200 focus:ring-2 focus:ring-cyan-400 outline-none"
            />
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 rounded-r-lg font-medium hover:opacity-90 transition-opacity">
              Notify Me
            </button>
          </div>
          <p className="mt-4 text-indigo-200 text-sm">
            We'll send you early access and special offers
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-indigo-200 text-sm">
        <p>© {new Date().getFullYear()} OTUSONE LLP. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ComingSoon;