import React from 'react';
import {
  FiCheck,
  FiEye,
  FiRepeat,
  FiSend,
  FiXCircle,
  FiRefreshCw,
  FiMessageCircle,
} from 'react-icons/fi';



const BroadcastStatsGrid = ({statsAnalitics}) => {

const stats = [
  { label: 'Sent', icon: <FiCheck />, count: statsAnalitics?.totalSent || 0 },
  { label: 'Delivered', icon: <FiCheck />, count: statsAnalitics?.sent || 0 },
  { label: 'Read', icon: <FiEye />, count: statsAnalitics?.read || 0 },
  { label: 'Replied', icon: <FiMessageCircle />, count:statsAnalitics?.replied || 0 },
  { label: 'Sending', icon: <FiSend />, count:statsAnalitics?.sending|| 0 },
  { label: 'Failed', icon: <FiXCircle />, count:statsAnalitics?.failed || 0 },
  { label: 'Processing', icon: <FiRefreshCw />, count:statsAnalitics?.processing || 0 },
  { label: 'Queued', icon: <FiRepeat />, count:statsAnalitics?.queue || 0 },
];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, icon, count }, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center bg-white p-4 rounded shadow-sm text-center"
        >
          <span className="text-xl text-green-500">{icon}</span>
          <p className="text-lg font-bold">{count}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default BroadcastStatsGrid;
