import React, { useState } from 'react';

const DateFilter = ({ onFilterChange }) => {
  const [rangeType, setRangeType] = useState('last7days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleRangeChange = (e) => {
    const value = e.target.value;
    setRangeType(value);

    setStartDate('');
    setEndDate('');

    onFilterChange({ range: value, startDate: '', endDate: '' });
  };

  const handleDateChange = (field, value) => {
    let updatedStart = startDate;
    let updatedEnd = endDate;

    if (field === 'start') {
      updatedStart = value;
      setStartDate(value);
    } else {
      updatedEnd = value;
      setEndDate(value);
    }

    setRangeType('custom');

    if (updatedStart && updatedEnd) {
      onFilterChange({
        range: null,
        startDate: updatedStart,
        endDate: updatedEnd,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={rangeType}
        onChange={handleRangeChange}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="last7days">Last 7 days</option>
        <option value="last30days">Last 30 days</option>
      </select>

      <span className="text-sm text-gray-500">OR</span>

      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange('start', e.target.value)}
          className="border px-2 py-2 rounded text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange('end', e.target.value)}
          className="border px-2 py-2 rounded text-sm"
        />
      </div>
    </div>
  );
};

export default DateFilter;
