import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { postApplicationJsonRequest } from '../../../services/apiServices';
import Modal from '../../common/Modal';

const StepSelectAudience = ({ audienceSize, filters, setFilters, onPrev, onNext }) => {
  const [contactList, setContactList] = useState([]);
  const [lastSeen, setLastSeen] = useState('');
  const [optedIn, setOptedIn] = useState('');
  const [field, setField] = useState('name');
  const [operator, setOperator] = useState('contains');
  const [inputValue, setInputValue] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [showModal, setShowModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const filterContact = async () => {
    try {
      const payload = {
        lastSeen:
          lastSeen === 'In 24hr'
            ? '24h'
            : lastSeen === 'This Week'
              ? 'this_week'
              : lastSeen === 'This Month'
                ? 'this_month'
                : dateRange.from && dateRange.to
                  ? 'date_range'
                  : null,
        dateRange:
          dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined,
        optedIn:
          optedIn === 'yes'
            ? true
            : optedIn === 'no'
              ? false
              : undefined,
        [`${field}Filter`]: {
          operator,
          value: inputValue,
        },
      };

      const response = await postApplicationJsonRequest('/contact/filter-contact', payload);

      if (response.status === 200) {
        setContactList(response.data.contacts || []);
        audienceSize(response.data.contacts || [])
      }
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message || "Failed to filter contact");
    }
  };


  useEffect(() => {
    if (filters) {
      setLastSeen(filters.lastSeen || '');
      setOptedIn(filters.optedIn || '');
      setField(filters.field || 'name');
      setOperator(filters.operator || 'contains');
      setInputValue(filters.inputValue || '');
      setDateRange(filters.dateRange || { from: '', to: '' });
      setContactList(filters.contactList || []);
      audienceSize(filters.contactList || [])

    }
  }, [filters]);




  useEffect(() => {
    if (contactList.length) {
      setSelectedContacts(contactList.map(contact => contact._id)); // default: all selected
    }
  }, [contactList]);

  const toggleContactSelection = (id) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleModalSave = () => {
    const selected = contactList.filter(contact => selectedContacts.includes(contact._id));
    setContactList(selected);
    audienceSize(selected || [])

    setShowModal(false);
  };
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Select Audience</h2>

      <div>
        <label className="font-medium">Last Seen</label>
        <div className="flex space-x-2 mt-1">
          {['In 24hr', 'This Week', 'This Month'].map((label) => (
            <button
              key={label}
              className={`border px-2 py-1 rounded hover:bg-gray-100 ${lastSeen === label ? 'bg-green-100' : ''
                }`}
              onClick={() => setLastSeen(label)}
            >
              {label}
            </button>
          ))}
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="font-medium">Opted In</label>
        {['Yes', 'No', 'All'].map((opt) => (
          <label key={opt} className="inline-flex items-center">
            <input
              type="radio"
              name="optedIn"
              value={opt.toLowerCase()}
              className="mr-1"
              checked={optedIn === opt.toLowerCase()}
              onChange={(e) => setOptedIn(e.target.value)}
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="flex space-x-2">
        <select
          className="border rounded px-2 py-1"
          value={field}
          onChange={(e) => setField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="whatsAppNumber">Mobile Number</option>
        </select>
        <select
          className="border rounded px-2 py-1"
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          <option value="contains">contains</option>
          <option value="is">is</option>
          <option value="is_not">is not</option>
          <option value="not_contains">not contains</option>
        </select>
        <input
          type="text"
          placeholder="Enter value"
          className="border rounded px-2 py-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="bg-green-900 text-white px-3 py-1 rounded"
          onClick={filterContact}
        >
          Apply
        </button>
        <button
          className="text-red-500 px-3 py-1"
          onClick={() => {
            setLastSeen('');
            setOptedIn('');
            setField('name');
            setOperator('contains');
            setInputValue('');
            setDateRange({ from: '', to: '' });
            setContactList([]);
            audienceSize([])
            setFilters({});
          }}

        >
          Clear All
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Number of contacts in filtered audience: <strong>{contactList?.length || 0}</strong>
      </div>

      {contactList.length > 0 && (
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
          onClick={() => setShowModal(true)}
        >
          View & Select Contacts
        </button>
      )}


      <div className="flex justify-between mt-4">
        <button onClick={onPrev} className="border px-4 py-2 rounded">
          Prev
        </button>
        <button onClick={() => {
          setFilters({
            lastSeen,
            optedIn,
            field,
            operator,
            inputValue,
            dateRange,
            contactList,
          });
          onNext();
        }} className="bg-green-900 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>


      <Modal
        isOpen={showModal}
        onRonCloseequestClose={() => setShowModal(false)}
        title="Select Contacts"
        className="bg-white p-6 rounded shadow-lg max-w-2xl mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start z-50"
      >
        <h2 className="text-lg font-semibold mb-4">Select Contacts</h2>
        <div className="max-h-80 overflow-y-auto space-y-2">
          {contactList.map(contact => (
            <label key={contact._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact._id)}
                onChange={() => toggleContactSelection(contact._id)}
              />
              <span>{contact.name} ({contact.whatsAppNumber})</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleModalSave}
            className="px-3 py-1 bg-green-700 text-white rounded"
          >
            Save Selection
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default StepSelectAudience;
