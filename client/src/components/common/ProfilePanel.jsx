import { useEffect, useRef } from 'react';
import SubscribeWebhookButton from './WebhookButton';

const ProfilePanel = ({ isOpen, onClose }) => {
  const panelRef = useRef();
  const user=localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  const {name,language,timeZone,whatsAppNumber,address,email,clientId}=user;

  // Close if clicked outside the panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSignout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0  bg-opacity-30 z-20" />

      {/* Sliding Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full max-w-full w-150 bg-white shadow-lg z-30 transition-transform duration-300"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{name}</h2>
            <p className="text-sm text-gray-500">{whatsAppNumber}</p>
            <p className="text-sm text-gray-500">{email}</p>
            <p className="text-xs text-gray-400">Client ID: {clientId || 436302}</p>
            <p className="text-xs text-gray-400">Address: {address}</p>

          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">&times;</button>
        </div>

        <div className="p-4 space-y-3">
          <button className="w-full bg-green-500 text-white py-2 rounded">Channel Status</button>
          <button className="w-full border border-green-500 text-green-600 py-2 rounded">Add WhatsApp Chat Button</button>
          <SubscribeWebhookButton/>
          <hr />
          <div className="space-y-2">
            <button className="w-full text-left text-gray-600">Settings</button>
            <button className="w-full text-left text-gray-600">Copy click-to-chat link</button>
            <button className="w-full text-left text-gray-600">Change Info</button>
            <button className="w-full text-left text-gray-600">Manage Notifications</button>
          </div>
          <hr />
          <div className="space-y-2 text-sm text-gray-500">
            <p>Language: {language}</p>
            <div className="flex gap-2 flex-wrap">
              <button className="bg-gray-200 px-3 py-1 rounded">Help center</button>
              <button className="bg-gray-200 px-3 py-1 rounded">Watch tutorials</button>
              <button className="bg-gray-200 px-3 py-1 rounded">Email us</button>
            </div>
          </div>
          <hr />
          <button className="w-full bg-red-500 text-white py-2 rounded" onClick={handleSignout}>Sign out</button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
