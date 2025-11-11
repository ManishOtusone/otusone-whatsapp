import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import { getRequest } from '../../../services/apiServices';

const StepCreateMessage = ({ messageData, setMessageData, onPrev, onNext, setTemplate }) => {
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(
    messageData?.templateId
      ? { value: messageData.templateId, label: messageData.templateName }
      : null
  );
  const [detectedVariables, setDetectedVariables] = useState([]);
  const [formData, setFormData] = useState({
    templateName: '',
    headerText: '',
    headerImageUrl:'',
    bodyText: '',
    footerText: '',
    buttons: [],
    variables: [],
    headerType: null,
    templateId: null,
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...messageData,
    }));

    if (messageData?.variables?.length > 0) {
      setDetectedVariables(messageData.variables);
    }
  }, [messageData]);


  useEffect(() => {
    getTemplates();
  }, []);

  const getTemplates = async () => {
    try {
      const response = await getRequest(`/wa-meta/templates`);
      if (response.status === 200) {
        setTemplateList(response.data?.templates || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to get template');
    }
  };

  const handleTemplateChange = (selected) => {
    const template = templateList.find(t => t.id === selected.value);
    console.log("template", template)
    if (!template) return;

    setSelectedTemplate(selected); // Persist selection 
    setTemplate(template);

    const header = template.components.find(c => c.type === 'HEADER');
    const body = template.components.find(c => c.type === 'BODY');
    const footer = template.components.find(c => c.type === 'FOOTER');
    const buttons = template.components.find(c => c.type === 'BUTTONS');

    const bodyText = body?.text || '';
    const matches = [...bodyText.matchAll(/{{(\d+)}}/g)];
    const variables = matches.map((match, i) => ({
      index: match[1],
      name: '',
      example: body?.example?.body_text?.[0]?.[i] || '',
    }));

    const updatedForm = {
      templateId: template.id,
      templateName: template.name,
      // headerText: header?.format === 'IMAGE' ? header?.example?.header_handle?.[0] : '',
      headerText: header?.format === 'IMAGE' ? "" : header?.text,
      headerImageUrl: "",
      headerType: header?.format || null,
      bodyText,
      footerText: footer?.text || '',
      buttons: buttons?.buttons || [],
      variables,
    };

    setFormData(updatedForm);
    setDetectedVariables(variables);
  };

  const handleVariableChange = (index, field, value) => {
    const updatedVars = formData.variables.map(v =>
      v.index === index ? { ...v, [field]: value } : v
    );

    setFormData(prev => ({ ...prev, variables: updatedVars }));
    setDetectedVariables(updatedVars);
  };


  const formatBodyText = (text) => {
    return text.replace(/{{(\d+)}}/g, (_, index) => {
      const variable = formData.variables.find(v => v.index === index);
      return variable?.example || `{{${index}}}`;
    });
  };

  const handleNext = () => {
    setMessageData({ ...formData }); // Sync data to parent
    onNext();
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Create Message</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Template Name</label>
        <Select
          value={selectedTemplate}
          options={templateList.map(template => ({
            value: template.id,
            label: template.name,
          }))}
          onChange={handleTemplateChange}
          placeholder="Search and select template..."
        />
      </div>

      {detectedVariables.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Variable Examples</h3>
          <div className="space-y-3">
            {detectedVariables.map((variable) => {
              const currentVar = formData.variables.find(v => v.index === variable.index) || variable;
              return (
                <div key={variable.index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {`Variable {{${variable.index}}} Name`}
                    </label>
                    <input
                      type="text"
                      value={currentVar.name}
                      onChange={(e) => handleVariableChange(variable.index, 'name', e.target.value)}
                      placeholder={`Name for {{${variable.index}}}`}
                      className="w-full border border-gray-300 p-2 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Example Value</label>
                    <input
                      type="text"
                      value={currentVar.example}
                      onChange={(e) => handleVariableChange(variable.index, 'example', e.target.value)}
                      placeholder={`Example for {{${variable.index}}}`}
                      className="w-full border border-gray-300 p-2 rounded text-sm"
                      required
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className='space-y-3'>
        {formData.headerType && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Header {formData.headerType === 'IMAGE' ? 'Image URL' : 'Text'}</h3>

            {formData.headerType === 'TEXT' ? (
              <input
                type="text"
                placeholder="Enter header text"
                value={formData.headerText}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, headerText: e.target.value }))
                }
                className="w-full border border-gray-300 p-2 rounded text-sm"
              />
            ) : (
              <input
                type="text"
                placeholder="Enter image URL"
                value={formData.headerImageUrl}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, headerImageUrl: e.target.value }))
                }
                className="w-full border border-gray-300 p-2 rounded text-sm"
              />
            )}
          </div>
        )}

      </div>
      {/*  ------------------------------------------------------------- preview section ---------------------------------------------------------------------------- */}
      <div className="border rounded p-4 mt-4 w-full max-w-sm">
        <div className="w-[320px] h-[650px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 relative">
          <div className="bg-green-600 text-white text-center rounded-t-md p-2">WhatsApp</div>
          <div className="bg-gray-100 h-[500px] p-2 overflow-y-auto flex flex-col gap-2">
            {formData.headerText && (
              <img
                src={formData.headerText}
                alt="Header"
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            {formData.bodyText && (
              <div className="bg-white text-sm p-2 rounded shadow whitespace-pre-wrap">
                {formatBodyText(formData.bodyText)}
              </div>
            )}
            {formData.footerText && (
              <div className="bg-white text-sm p-2 rounded shadow text-center text-gray-500 text-xs">
                {formData.footerText}
              </div>
            )}
            {formData.buttons && formData.buttons.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {formData.buttons.map((btn, i) => (
                  <button
                    key={i}
                    className={`p-2 rounded text-sm ${btn.type === 'QUICK_REPLY'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {btn.text}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 p-2 rounded-full border border-gray-300"
            />
            <div className="flex gap-2 text-gray-600">
              <FiPlus />
              <FiChevronDown />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="border px-4 py-2 rounded">Prev</button>
        <button onClick={handleNext} className="bg-green-900 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default StepCreateMessage;
