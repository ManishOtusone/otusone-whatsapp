import { useState, useEffect } from "react";
import CampaignName from "../../components/core/campaign/CampaignName";
import SelectAudience from "../../components/core/campaign/StepSelectAudience";
import CreateMessage from "../../components/core/campaign/StepCreateMessage";
import TestCampaign from "../../components/core/campaign/TestCampaignStep";
import PreviewAndSend from "../../components/core/campaign/PreviewAndSendStep";
import toast from "react-hot-toast";
import { postApplicationJsonRequest } from "../../services/apiServices";
import { useNavigate } from "react-router-dom";

const CampaignWizard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contactList, setContactList] = useState([])
  const [scheduledData, setScheduledData] = useState({
    scheduledAt: null,
    repeat: 'none',
    intervalMinutes: null,
  });

  const [messageData, setMessageData] = useState({
    templateName: "",
    headerText: '',
    headerImageUrl: "",
    bodyText: '',
    footerText: '',
    buttons: [],
    variables: [],
    headerType: null,
    language: "en_US",
    templateId: null
  })
  const [form, setForm] = useState({
    campaignName: "",
    audienceSize: 2,
    messagePreview: "",
    estimatedCost: 0.26,
    wccBalance: 45.24,
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSendNow = async () => {
    try {
      const payload = {
        name: form.campaignName,
        templateName: messageData.templateName,
        language: messageData.language || "en_US",
        bodyVariables: messageData.variables,
        contactListId: contactList,
        scheduledAt: scheduledData.scheduledAt || null,
        repeat: scheduledData.repeat || 'none',
        intervalMinutes: scheduledData.repeat === 'custom_interval' ? scheduledData.intervalMinutes : null,
        headerImageUrl: messageData.headerImageUrl,
        buttons: messageData.buttons || [],
      };
      const response = await postApplicationJsonRequest(`/campaign/create-new`, payload);
      if (response.status === 201) {
        toast.success(response?.data?.message || "Campaign created successfully");
        setForm({
          campaignName: "",
          audienceSize: 2,
          messagePreview: "",
          estimatedCost: 0.26,
          wccBalance: 45.24,
        });

        setMessageData({
          templateName: "",
          headerText: '',
          headerImageUrl: "",
          bodyText: '',
          footerText: '',
          buttons: [],
          variables: [],
          headerType: null,
          language: "en_US",
          templateId: null
        });

        setScheduledData({
          scheduledAt: null,
          repeat: 'none',
          intervalMinutes: null,
        });

        setContactList([]);
        setSelectedTemplate(null);
        setFilters({});
        setStep(1); // Go back to step 1
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Faild to create campaign")
    }
  };

  // console.log("contactList",contactList)
  // console.log("form", form)
  // console.log("messageData", messageData)

  return (
    <div>

      <div className=" mx-auto mt-8 px-6">
        <div className="mb-4">
        <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
          >
            ← Back to Campaign List
          </button>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-gray-800">Create a New Campaign</h1>
            <p className="text-gray-600 mt-1">
              Follow the steps to create, test, and send your campaign. Your campaign can be scheduled or sent immediately after preview.
            </p>
          </div>
         
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-6 space-y-6 bg-gray-50 shadow rounded-lg mt-6">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <div className="flex justify-between items-center text-sm text-gray-500 border-b pb-2">
          <span className={step >= 1 ? "text-blue-600 font-semibold" : ""}>Campaign Name</span>
          <span className={step >= 2 ? "text-blue-600 font-semibold" : ""}>Select Audience</span>
          <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>Create Message</span>
          <span className={step >= 4 ? "text-blue-600 font-semibold" : ""}>Test Campaign</span>
          <span className={step >= 5 ? "text-blue-600 font-semibold" : ""}>Preview & Send</span>
        </div>

        {step === 1 && (
          <CampaignName
            campaignName={form.campaignName}
            onChange={(val) => handleChange("campaignName", val)}
            onNext={nextStep}
          />

        )}

        {step === 2 && (
          <SelectAudience
            filters={filters}
            setFilters={setFilters}
            // audienceSize={form.audienceSize}
            audienceSize={setContactList}
            onChange={(val) => handleChange("audienceSize", val)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {step === 3 && (
          <CreateMessage
            setMessageData={setMessageData}
            messageData={messageData}
            setTemplate={setSelectedTemplate}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {step === 4 && (
          <TestCampaign
            selectedTemplate={messageData}
            logoUrl="/logo.png"
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {step === 5 && (
          <PreviewAndSend
            campaignName={form.campaignName}
            estimatedCost={form.estimatedCost}
            audienceSize={contactList}
            wccBalance={form.wccBalance}
            onSend={handleSendNow}
            onPrev={prevStep}
            setScheduledData={setScheduledData}
          />
        )}
      </div>
    </div>

  );
};

export default CampaignWizard;
