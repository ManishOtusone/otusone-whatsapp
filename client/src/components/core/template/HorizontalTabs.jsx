import React from 'react';

const tabs = ['Template Messages', 'Broadcast Analytics', 'Scheduled Broadcasts','Tags'];

const HorizontalTabs = ({ selected, onSelect }) => {
  return (
    <div className="flex space-x-4 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          className={`pb-2 px-4 text-sm font-medium ${
            selected === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default HorizontalTabs;
