import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRDownloadApp = () => {
  const appDownloadUrl = 'https://yourapp.com/download'; // Replace with your actual app download link

  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="text-lg font-semibold mb-2">Scan to download the Mobile app</h3>
      <div className="flex justify-center">
        <QRCodeCanvas value={appDownloadUrl} size={100} />
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        <img
          src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-play-app-icon-vector-png-image_9183316.png"
          alt="Google Play"
          className="w-24"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3PHgC6IQOgvyIZdq-DS3jr8VprWjzm7zxnw&s"
          alt="App Store"
          className="w-24"
        />
      </div>
      <p className="text-xs mt-2">Real-time notifications • Ads Management • Live Chat • Analytics Dashboard</p>
    </div>
  );
};

export default QRDownloadApp;
