import React ,{useEffect,useState} from 'react';
import OverviewSection from './OverviewSection';
import BroadcastStatsGrid from './BroadcastStatsGrid';
import BroadcastList from './BroadcastList';
import DateFilter from './DateFilter';
import { getRequest } from '../../../services/apiServices';

const BroadcastAnalytics = ({}) => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topContacts, setTopContacts] = useState([]);
  const [filter, setFilter] = useState({ range: 'last7days' });

    const fetchAll = async () => {
      const [r1, r2, r3] = await Promise.all([
        getRequest(`/livechat/user-message-stats?startDate=${filter?.startDate || ""}&endDate=${filter?.endDate || ""}&range${filter?.range || ""}`),
        getRequest(`/livechat/message-trends`),
        getRequest(`/livechat/top-contacts`)
      ]);
      if (r1.data) setStats(r1.data);
      if (r2.data) setTrends(r2.data);
      if (r3.data) setTopContacts(r3.data);
    };


      useEffect(() => {
        fetchAll();
      }, [filter]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">Broadcast Analytics</h1>
        <div className="flex gap-2">
          <button className="text-sm text-blue-600">Watch Tutorial</button>
        </div>
      </div>

      <div className="bg-green-50 p-3 rounded text-sm text-green-700 mb-4">
        Boost your campaign reach! We’re testing a new way to deliver marketing messages & we’d love your help 🧠 <button className="ml-2 underline font-medium">Join the experiment</button>
      </div>

      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <DateFilter onFilterChange={setFilter} />
        <button className="border px-4 py-2 rounded text-sm">Export</button>
      </div>

      <OverviewSection />

      <BroadcastStatsGrid statsAnalitics={stats} />

      <BroadcastList />
    </div>
  );
};

export default BroadcastAnalytics;
