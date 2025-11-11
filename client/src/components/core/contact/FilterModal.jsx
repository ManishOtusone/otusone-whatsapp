import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilter, clearFilters } from "../../../redux/slices/contactFilterSlice";

const FilterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    lastSeen: '',
    createdAt: '',
    optedIn: 'All',
    incomingBlocked: 'All',
    attributes: []
  });

  const applyFilters = () => {
    dispatch(setFilter(formState));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl">
        <div className="text-lg font-semibold mb-4">Filter Contacts</div>

        <div className="mb-3">
          <label className="font-medium block mb-1">Last Seen</label>
          <select
            value={formState.lastSeen}
            onChange={(e) => setFormState({ ...formState, lastSeen: e.target.value })}
            className="border rounded px-3 py-1 w-full"
          >
            <option value="">Select</option>
            <option value="24hr">In 24hr</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Opted In</label>
          <div className="flex gap-4">
            {["Yes", "No", "All"].map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name="optedIn"
                  value={opt}
                  checked={formState.optedIn === opt}
                  onChange={(e) => setFormState({ ...formState, optedIn: e.target.value })}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block mb-1">Incoming Blocked</label>
          <div className="flex gap-4">
            {["Yes", "No", "All"].map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name="incomingBlocked"
                  value={opt}
                  checked={formState.incomingBlocked === opt}
                  onChange={(e) => setFormState({ ...formState, incomingBlocked: e.target.value })}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => { dispatch(clearFilters()); onClose(); }} className="px-4 py-2 border rounded">
            Clear All
          </button>
          <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-white rounded">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
