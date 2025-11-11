import { useState,useEffect } from 'react';
import TemplateRow from './TemplateRow';
import { FaFilter } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom'
import { getRequest } from '../../../services/apiServices';


const quickStatuses = ['All', 'DRAFT', 'PENDING', 'APPROVED'];
const allStatuses = ['All', 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'Deleted', 'Paused', 'Disabled'];

const TemplateTable = () => {
  const navigate=useNavigate()
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const [templateList,setTemplateList]=useState([])

  const getTemplate=async()=>{
    try {
      const response=await getRequest(`/wa-meta/templates`)
      if(response.status===200){
        const result=response?.data?.templates
        setTemplateList(result)
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getTemplate()
  },[])

  const filteredTemplates =
    selectedStatus === 'All'
      ? templateList
      : templateList.filter((template) => template.status === selectedStatus);


      const handleNewTemplate=()=>{
        navigate("create")
      }

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Templates</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleNewTemplate}>New Template Message</button>
      </div>

      {/* Tabs for Filtering */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          {quickStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Filter dropdown on right */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
          >
            <FaFilter />
            Filter
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg z-10 rounded">
              {allStatuses.map((status) => (
                <div
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsFilterOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedStatus === status ? 'bg-blue-100' : ''
                  }`}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto text-left">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="py-2">Template Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Language</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((item, index) => (
              <TemplateRow key={index} template={item} />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No templates found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TemplateTable;
