import React, { useEffect, useState } from "react";
import { countryCode } from "../../../utils/countryPhoneCode";
import Select from "react-select";
import { getRequest, postApplicationJsonRequest } from "../../../services/apiServices";
import toast from "react-hot-toast";

const AddContactModal = ({ isOpen, onClose, onSave }) => {
  const [tags,setTags]=useState([])
  const [formData, setFormData] = useState({
    name: "",
    countryCode: "+91",
    mobileNumber: "",
    tags: [],
    source: "API",
  });

  const countryOptions = countryCode.map((country) => ({
    label: `${country.dial_code} (${country.code})`,
    value: country.dial_code,
  }));

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        whatsAppNumber: formData.countryCode + formData.mobileNumber,
        tags: formData.tags,
        source: formData.source,
      };
  
      const response = await postApplicationJsonRequest(`/contact/add-single-contact`, payload);
      
      if (response.status === 201) {
        onClose();
        onSave();
        setFormData({ name: "", countryCode: "+91", mobileNumber: "", tags: [], source: "API" });
        toast.success(response.data?.message || "Contact added successfully");
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Failed to add contact");
    }
  };
  

  const getTags = async () => {
    try {
      const response = await getRequest(`/tag/all`);
      if (response.status === 200) {
        const result = response.data?.tags || [];
        const formattedTags = result.map((item) => ({ label: item.name, value: item.name }));
        setTags(formattedTags);
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.response?.data?.message || "Failed to get tags");
    }
  };
  

  useEffect(()=>{
    getTags()
  },[])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add Contact</h2>
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            className="w-full px-3 py-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
          <div className="flex gap-2">
            <div className="w-1/3">
              <Select
                name="countryCode"
                options={countryOptions}
                value={countryOptions.find(opt => opt.value === formData.countryCode)}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({
                    ...prev,
                    countryCode: selectedOption.value,
                  }))
                }
                className="text-sm"
              />
            </div>
            <input
              name="mobileNumber"
              placeholder="Mobile Number"
              className="flex-1 px-3 py-2 border rounded"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>

          <Select
            isMulti
            name="tags"
            placeholder="Select Tags"
            options={tags}
            value={formData.tags.map(tag => ({ label: tag, value: tag }))}
            onChange={(selectedOptions) =>
              setFormData((prev) => ({
                ...prev,
                tags: selectedOptions.map((opt) => opt.value),
              }))
            }
          />

          <select
            name="source"
            className="w-full px-3 py-2 border rounded"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="API">API</option>
            <option value="ORGANIC">ORGANIC</option>
            <option value="MANUAL">MANUAL</option>
            <option value="IMPORT">IMPORT</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
