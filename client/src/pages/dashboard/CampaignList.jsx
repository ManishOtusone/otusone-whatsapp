import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChartBar } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { HiSpeakerphone, HiCode } from "react-icons/hi";
import { getRequest } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaPauseCircle, FaTrash } from "react-icons/fa";


const tabs = [
  { value: "All", label: "All" },
  { value: "BROADCAST", label: "BROADCAST" },
  { value: "API", label: "API" },
  { value: "SCHEDULE", label: "SCHEDULE (PRO)" }
];


const CampaignsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [campaignList, setCampaignList] = useState([]);

  const filteredCampaigns = campaignList.filter((c) => {
    if (activeTab === "All") return true;
    return c.type === activeTab.toUpperCase();
  });

  const getAllCampaign = async () => {
    try {
      const response = await getRequest("/campaign/list");
      if (response.status === 200) {
        const result = response?.data?.campaigns || [];
        setCampaignList(result);
      }
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message || "Failed to fetch campaigns");
    }
  };

  useEffect(() => {
    getAllCampaign();
  }, []);

  const naviagetToLaunchCampaign = () => {
    navigate("create")
  }

  const countByType = (type) =>
    campaignList.filter((c) => c.type === type).length;

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex gap-10">
          <h1 className="text-3xl font-bold text-gray-800">All Campaigns</h1>
          <button
            onClick={naviagetToLaunchCampaign}
            className="flex items-center gap-2 px-3 py-2 border bg-[#0e4c52] rounded text-sm text-white cursor-pointer"
          >
            Launch Campaign
          </button>
        </div>
        <p className="text-gray-600 text-sm">
          View and manage your campaigns across channels
        </p>
      </div>

      {/* Hero Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FaChartBar className="text-blue-500 text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Total Campaigns</p>
              <p className="text-xl font-semibold">{campaignList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-3">
            <HiSpeakerphone className="text-indigo-500 text-xl" />
            <div>
              <p className="text-gray-500 text-sm">Broadcast Campaigns</p>
              <p className="text-xl font-semibold">{countByType("BROADCAST")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center gap-3">
            <HiCode className="text-green-500 text-xl" />
            <div>
              <p className="text-gray-500 text-sm">API Campaigns</p>
              <p className="text-xl font-semibold">{countByType("API")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab.value
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Campaigns</h2>
          <button
            onClick={getAllCampaign}
            className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">Campaign</th>
                <th className="p-3">Type</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Status</th>
                <th className="p-3">Audience</th>
                <th className="p-3">Success</th>
                <th className="p-3">Failed</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2">
                    <FaChartBar className="text-gray-500" />
                    {c.name}
                  </td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs ${c.campaignStatus === "Live" ? "bg-green-500" : "bg-blue-500"
                        }`}
                    >
                      {c.campaignStatus}
                    </span>
                  </td>
                  <td className="p-3">{c.totalContacts}</td>
                  <td className="p-3">{c.successCount}</td>
                  <td className="p-3">{c.failedCount}</td>
                  <td className="p-3 space-x-2 flex items-center">
                    <button className="text-blue-600 hover:text-blue-800" title="View">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-800" title="Pause">
                      <FaPauseCircle />
                    </button>
                    <button className="text-red-600 hover:text-red-800" title="Delete">
                      <FaTrash />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          {filteredCampaigns.length === 0 && (
            <p className="text-center text-gray-500 py-4">No campaigns found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;
