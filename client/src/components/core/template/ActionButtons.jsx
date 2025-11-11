import { FaEdit, FaTrash, FaCopy, FaCheck } from 'react-icons/fa';

const ActionButtons = ({ status }) => (
  <div className="flex space-x-2">
    {status === 'Draft' && (
      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center">
        <FaCheck className="mr-1" /> Submit
      </button>
    )}
    <button className="text-gray-500 hover:text-black" ><FaCopy /></button>
    <button className="text-gray-500 hover:text-red-600" onCli><FaTrash /></button>
    <button className="text-gray-500 hover:text-blue-600"><FaEdit /></button>
  </div>
);

export default ActionButtons;
