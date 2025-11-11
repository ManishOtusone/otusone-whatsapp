import React from 'react';
import { FiFilter } from 'react-icons/fi';

const BroadcastList = () => {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-2">
        <h3 className="text-base font-semibold">Broadcast list</h3>
        <div className="flex items-center gap-2">
          <select className="border px-2 py-1 rounded text-sm">
            <option>Latest</option>
            <option>Oldest</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1.5 rounded text-sm"
          />
          <button className="p-2 border rounded">
            <FiFilter />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white border-b text-gray-600">
            <tr>
              <th className="p-2">Broadcast name</th>
              <th className="p-2">Total recipients</th>
              <th className="p-2">Successful</th>
              <th className="p-2">Read</th>
              <th className="p-2">Replied</th>
              <th className="p-2">Website clicks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="text-center py-10">
                <img
                  src="/empty-placeholder.svg"
                  alt="No data"
                  className="mx-auto mb-2 w-40"
                />
                <p className="text-gray-500">No broadcast data available</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BroadcastList;
