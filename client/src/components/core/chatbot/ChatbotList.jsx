import { useEffect, useState } from "react";
import { deleteRequest, getRequest } from "../../../services/apiServices";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ChatbotList = () => {
  const navigate = useNavigate()
  const [chatbotList, setChatbotList] = useState([]);
  const [filteredBots, setFilteredBots] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [botsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const getChatbots = async () => {
    try {
      const response = await getRequest(`/meta-chatbot/all`);
      if (response.status === 200) {
        const bots = response.data?.chatbots || [];
        setChatbotList(bots);
        setFilteredBots(bots);
      }
    } catch (error) {
      console.error("Failed to fetch chatbots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatbots();
  }, []);

  useEffect(() => {
    filterBots();
    setCurrentPage(1); // reset page on filter
  }, [search, dateFilter, chatbotList]);

  const filterBots = () => {
    const filtered = chatbotList.filter((bot) => {
      const matchSearch =
        bot.name?.toLowerCase().includes(search.toLowerCase()) ||
        bot.description?.toLowerCase().includes(search.toLowerCase());
      const matchDate = dateFilter
        ? new Date(bot.updatedAt).toISOString().slice(0, 10) === dateFilter
        : true;
      return matchSearch && matchDate;
    });

    setFilteredBots(filtered);
  };

  const handleView = (id) => {
    console.log("View chatbot:", id);
    navigate(`flow-viewer/${id}`)
  };

  const handleEdit = (id) => {
    console.log("Edit chatbot:", id);
  };

  const handleDelete = async(id) => {
    try {
      const response=await deleteRequest(`/meta-chatbot/${id}`)
      if(response.status===200){
        toast.success(response.data?.message ||" chatboat deleted successfully");
        getChatbots()
      }
      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete chatboat")
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredBots.length / botsPerPage);
  const indexOfLast = currentPage * botsPerPage;
  const indexOfFirst = indexOfLast - botsPerPage;
  const currentBots = filteredBots.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Chatbots</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/4"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading chatbots...</p>
      ) : filteredBots.length === 0 ? (
        <p className="text-gray-500">No chatbots found.</p>
      ) : (
        <>
          <div className="overflow-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Updated</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBots.map((bot) => (
                  <tr key={bot._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{bot.name}</td>
                    <td className="px-4 py-2 max-w-xs truncate">
                      {bot.description}
                    </td>
                    <td className="px-4 py-2 capitalize">{bot.type}</td>
                    <td className="px-4 py-2 capitalize">
                      {bot.metadata?.status || "draft"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(bot.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3 text-gray-600">
                        <button onClick={() => handleView(bot._id)} title="View">
                          <FaEye className="hover:text-blue-600 transition" />
                        </button>
                        <button onClick={() => handleView(bot._id)} title="Edit">
                          <FaEdit className="hover:text-green-600 transition" />
                        </button>
                        <button onClick={() => handleDelete(bot._id)} title="Delete">
                          <FaTrash className="hover:text-red-600 transition" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotList;
