import React, { useEffect, useState } from 'react';
import { getRequest } from '../../services/apiServices';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { baseUrl } from '../../utils/baseUrl';

const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f87171', '#a78bfa', '#f472b6'];
const GRAPH_COLORS = ['#086054', '#60a5fa', '#511e53', '#f87171', '#a78bfa', '#f472b6'];


const History = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topContacts, setTopContacts] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [r1, r2, r3] = await Promise.all([
      getRequest(`/livechat/user-message-stats`),
      getRequest(`/livechat/message-trends`),
      getRequest(`/livechat/top-contacts`)
    ]);
    if (r1.data) setStats(r1.data);
    if (r2.data) setTrends(r2.data);
    if (r3.data) setTopContacts(r3.data);
  };

  const pieData = stats ? [
    { name: 'Sent', value: stats.totalSent },
    { name: 'Delivered', value: stats.delivered },
    { name: 'Read', value: stats.read },
    { name: 'Failed', value: stats.failed },
    { name: 'Replied', value: stats.replied },
    { name: 'Seen', value: stats.seen },
  ] : [];


  const downloadCSV = async () => {
  try {
    const response = await fetch(`${baseUrl}/livechat/export-csv`, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'Authorization': `Bearer ${localStorage.getItem('token')}` //
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-messages.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download CSV', error);
  }
};


  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-700">📊 Messaging Analytics</h2>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-gray-700">
          {pieData.map((d, i) => (
            <div className="bg-white shadow rounded-lg p-4 flex items-center" key={i}>
              <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <div className="text-sm">{d.name}: <span className="font-semibold">{d.value}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">Trend: Messages Per Day</h3>
        {trends.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4ade80" />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500">No data to display</p>}
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">Top Contacts</h3>
        <ul className="space-y-2">
          {topContacts.map(c => (
            <li key={c.contactNumber} className="flex justify-between">
              <span>{c.contactName || c.contactNumber}</span>
              <span className="font-medium">{c.count} messages</span>
            </li>
          ))}
        </ul>
        <button
          onClick={downloadCSV}
          className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export Logs as CSV
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((_, idx) => (
                <Cell key={idx} fill={GRAPH_COLORS[idx]} />
              ))}
            </Pie>
            <PieTooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default History;
