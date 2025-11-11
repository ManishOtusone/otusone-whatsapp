import React, { useEffect, useState } from "react";
import AddContactModal from "../../components/core/contact/AddContactModal";
import DropdownMenu from "../../components/core/contact/DropdownMenu";
import ContactTable from "../../components/core/contact/ContactTable";
import FilterModal from "../../components/core/contact/FilterModal";
import { getRequest, postApplicationJsonRequest, postMultipartFormRequest } from "../../services/apiServices";
import { useSelector } from "react-redux";
import { FaFilter } from 'react-icons/fa';
import toast from "react-hot-toast";
import ImportContactModal from "../../components/core/contact/ImportContactModal";
import * as XLSX from "xlsx";

const ContactManager = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const filters = useSelector((state) => state.contactFilters);

  const handleAddContact = () => {
    getContactList()
  };

  const importOptions = [
    { label: "Import Contact", onClick: () => setImportModalOpen(true) },
    { label: "Import and Broadcast New", onClick: () => alert("Import and Broadcast New") },
  ];

  const actionOptions = [
    { label: "Export", onClick: () => handleExportToExcel() },
    { label: "History", onClick: () => alert("History") },
    { label: "Manage Tags", onClick: () => alert("Manage Tags") },
    { label: "Edit Contact", onClick: () => alert("Edit Contact") },
  ];

  const getContactList = async () => {
    try {
      const response = await getRequest(`/contact/list`)
      if (response.status === 200) {
        const result = response?.data?.contacts || []
        setContacts(result)
      }
    } catch (error) {
      console.log("error", error)
      setContacts([])

    }
  }
  useEffect(() => {
    getContactList()
  }, []);

  const importContact = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await postMultipartFormRequest(`/contact/import-contact-file`, formData);
      if (response.status === 200) {
        toast.success(response.data?.message || "Contact imported successfully");
        getContactList();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to import contact");
    }
  };


  const handleExportToExcel = () => {
    console.log("export",selectedContacts)
    if (selectedContacts.length === 0) {
      toast.error("No contacts selected for export");
      return;
    }
  
    const dataToExport = selectedContacts.map(({ name, whatsAppNumber, countryCode, tags, source }) => ({
      Name: name,
      WhatsAppNumber: whatsAppNumber,
      CountryCode: countryCode,
      Tags: tags?.join(", "),
      Source: source,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
  
    XLSX.writeFile(workbook, "contacts_export.xlsx");
  };
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-10">
          <h1 className="text-xl font-bold">Contacts</h1>

          <button onClick={() => setFilterOpen(true)} className="px-4 py-2 border rounded flex items-center gap-2">
            <FaFilter className="w-4 h-4" /> Filter
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add Contact
          </button>
          <DropdownMenu label="Import" options={importOptions} />
          <DropdownMenu label="Actions" options={actionOptions} />
        </div>
      </div>

      <ContactTable contacts={contacts} onSelectionChange={setSelectedContacts}  />
      <AddContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddContact}
      />
      <FilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
      <ImportContactModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={importContact}
      />

    </div>
  );
};

export default ContactManager;
