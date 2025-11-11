import React, { useState } from "react";
import Modal from "../../common/Modal";

const ImportContactModal = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!selectedFile) return alert("Please select a file.");
    onImport(selectedFile);
    onClose();
    setSelectedFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Contacts">
      <div className="space-y-4">
        <input
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        <button
          onClick={handleImport}
          disabled={!selectedFile}
          className={`w-full px-4 py-2 text-white font-semibold rounded ${
            selectedFile ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Import
        </button>
      </div>
    </Modal>
  );
};

export default ImportContactModal;
