import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { postApplicationJsonRequest } from '../../../services/apiServices';
import toast from 'react-hot-toast';

const TestCampaignStep = ({ selectedTemplate, onPrev, onNext }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // console.log("selectedTemplate",selectedTemplate)
  const handleTest = async () => {
    try {
      const {templateId } = selectedTemplate
      const response = await postApplicationJsonRequest(`/campaign/test-campaign-scheduler/${templateId}`, {
        whatsAppNumber: phone,
        template: selectedTemplate
      })
      if (response.status === 200) {
        toast.success(response.data?.message || "Campaign successfully triggered")
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "Faild to trigger campaign test")
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Test Campaign</h2>

      <div className="flex gap-4 items-center flex-wrap">
        <input
          type="text"
          placeholder="Name"
          className="px-4 py-2 border rounded bg-blue-50"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <PhoneInput
          country={'in'}
          value={phone}
          onChange={(phone) => setPhone(phone)}
          inputClass="bg-blue-50 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
          containerStyle={{ width: 'fit-content' }}
        />

        <button
          className={`px-4 py-2 rounded ${name && phone ? 'bg-green-900 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          disabled={!name || !phone}
          onClick={handleTest}
        >
          Test
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="border px-4 py-2 rounded">Prev</button>
        <button onClick={onNext} className="bg-green-900 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default TestCampaignStep;
