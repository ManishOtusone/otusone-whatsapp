import React, { useState } from 'react';

const PreviewAndSendStep = ({
  campaignName,
  audienceSize,
  estimatedCost,
  wccBalance,
  onSend,
  onPrev,
  setScheduledData,
}) => {
  const [scheduledAt, setScheduledAt] = useState('');
  const [repeat, setRepeat] = useState('none');
  const [intervalMinutes, setIntervalMinutes] = useState('');
  const handleScheduleChange = () => {
    setScheduledData({ scheduledAt, repeat, intervalMinutes: repeat === 'custom_interval' ? Number(intervalMinutes) : null });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Preview & Send</h2>

      <div className="space-y-4">
        <p><span className="font-medium">Campaign Name:</span> {campaignName}</p>
        <p><span className="font-medium">Audience Size:</span> {audienceSize?.length || 0}</p>

        <div className="space-y-2">
          <label className="block font-medium">Schedule At (optional)</label>
          <input
            type="datetime-local"
            className="border px-2 py-1 rounded w-full"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            onBlur={handleScheduleChange}
          />

          <label className="block font-medium mt-2">Repeat</label>
          <select
            className="border px-2 py-1 rounded w-full"
            value={repeat}
            onChange={(e) => {
              setRepeat(e.target.value);
              handleScheduleChange();
            }}
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="twice_a_day">Twice a Day</option>
            <option value="hourly">Hourly</option>
            <option value="custom_interval">Custom Interval</option>
          </select>

          {repeat === 'custom_interval' && (
            <div>
              <label className="block font-medium mt-2">Interval in Minutes</label>
              <input
                type="number"
                min="1"
                className="border px-2 py-1 rounded w-full"
                value={intervalMinutes}
                onChange={(e) => {
                  setIntervalMinutes(e.target.value);
                  handleScheduleChange();
                }}
              />
            </div>
          )}
        </div>

        <button
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          onClick={() => {
            handleScheduleChange();
            onSend();
          }}
        >
          SEND NOW
        </button>
      </div>

      <div className="border rounded-md p-4 bg-white max-w-xl">
        <h3 className="text-md font-semibold mb-2">Estimated Campaign Cost</h3>
        <table className="w-full text-sm text-left text-gray-700 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Country Name</th>
              <th className="px-4 py-2 border">User Count</th>
              <th className="px-4 py-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">India (+91)</td>
              <td className="px-4 py-2 border">{audienceSize?.length || 0}</td>
              <td className="px-4 py-2 border">₹{audienceSize?.length * 0.13}</td>
            </tr>
            <tr className="font-semibold bg-gray-50">
              <td className="px-4 py-2 border" colSpan={2}>Total Estimated Cost:</td>
              <td className="px-4 py-2 border">₹{audienceSize?.length * 0.13}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">Available WCC: ₹{wccBalance}</p>
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={onPrev} className="border px-4 py-2 rounded">Prev</button>
      </div>
    </div>
  );
};

export default PreviewAndSendStep;
