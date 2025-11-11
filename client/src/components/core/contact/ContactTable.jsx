import React, { useEffect, useState } from "react";

const ContactTable = ({ contacts, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  // Sync selection with parent
  useEffect(() => {
    const selectedContacts = contacts.filter(contact =>
      selectedIds.includes(contact._id)
    );
    onSelectionChange?.(selectedContacts);
  }, [selectedIds, contacts, onSelectionChange]);

  // Toggle individual row
  const handleCheckboxChange = (contactId, checked) => {
    setSelectedIds(prev =>
      checked ? [...prev, contactId] : prev.filter(id => id !== contactId)
    );
  };

  // Toggle select all
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const allIds = contacts.map(contact => contact._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected = contacts.length > 0 && selectedIds.length === contacts.length;

  return (
    <div className="overflow-auto">
      <table className="w-full text-left border mt-4">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-3">Name</th>
            <th className="p-3">Mobile Number</th>
            <th className="p-3">Tags</th>
            <th className="p-3">Source</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {contacts.map((contact) => (
            <tr key={contact._id} className="even:bg-gray-50">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(contact._id)}
                  onChange={(e) =>
                    handleCheckboxChange(contact._id, e.target.checked)
                  }
                />
              </td>
              <td className="p-3">{contact.name}</td>
              <td className="p-3">{contact.countryCode}{contact.whatsAppNumber}</td>
              <td className="p-3">{contact.tags.join(', ')}</td>
              <td className="p-3">{contact.source}</td>
              <td className="p-3">{contact.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
