// import React, { useState, useEffect } from 'react';

// const NodeConfigModal = ({ node, onSave, onClose }) => {
//   const [label, setLabel] = useState(node.data.label || '');
//   const [variableName, setVariableName] = useState(node.data.field?.variableName || '');
//   const [inputType, setInputType] = useState(node.data.field?.inputType || 'text');
//   const [validation, setValidation] = useState(node.data.field?.validation || { required: false, regex: '' });

//   const [buttons, setButtons] = useState(node.data.buttons || []);
//   const [showButtons, setShowButtons] = useState(node.data.type === 'sendMessage' || buttons.length > 0);

//   const addNewButton = () => {
//     setButtons([...buttons, { title: '', payload: '', type: 'postback' }]);
//     setShowButtons(true);
//   };

//   const updateButton = (index, key, value) => {
//     const updated = [...buttons];
//     updated[index][key] = value;
//     setButtons(updated);
//   };

//   const removeButton = (index) => {
//     const updated = buttons.filter((_, i) => i !== index);
//     setButtons(updated);
//     if (updated.length === 0 && node.data.type !== 'sendMessage') {
//       setShowButtons(false);
//     }
//   };

//   const handleSave = () => {
//     const updatedData = {
//       ...node.data,
//       label,
//       field: {
//         variableName,
//         inputType,
//         validation,
//       },
//     };

//     if (showButtons || node.data.type === 'sendMessage') {
//       updatedData.buttons = buttons;
//     } else {
//       delete updatedData.buttons;
//     }

//     onSave({ ...node, data: updatedData });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
//       <div className="bg-white p-6 rounded shadow w-96 ">
//         <h2 className="text-lg font-semibold mb-4">Configure Node</h2>

//         <label className="block text-sm font-medium mb-1">Label</label>
//         <input className="w-full border px-2 py-1 mb-3" value={label} onChange={(e) => setLabel(e.target.value)} />

//         <label className="block text-sm font-medium mb-1">Variable Name</label>
//         <input className="w-full border px-2 py-1 mb-3" value={variableName} onChange={(e) => setVariableName(e.target.value)} />

//         <label className="block text-sm font-medium mb-1">Input Type</label>
//         <select className="w-full border px-2 py-1 mb-3" value={inputType} onChange={(e) => setInputType(e.target.value)}>
//           <option value="text">Text</option>
//           <option value="date">Date</option>
//           <option value="select">Dropdown</option>
//         </select>

//         <label className="block text-sm font-medium mb-1">Validation</label>
//         <div className="flex items-center space-x-2 mb-2">
//           <input
//             type="checkbox"
//             checked={validation.required}
//             onChange={(e) => setValidation((prev) => ({ ...prev, required: e.target.checked }))}
//           />
//           <span>Required</span>
//         </div>
//         <input
//           className="w-full border px-2 py-1"
//           placeholder="Regex (optional)"
//           value={validation.regex}
//           onChange={(e) => setValidation((prev) => ({ ...prev, regex: e.target.value }))}
//         />

//         {/* Add buttons for sendMessage or when explicitly enabled */}
//         {node.data.type !== 'sendMessage' && !showButtons && (
//           <div className="mt-4">
//             <button
//               onClick={() => setShowButtons(true)}
//               className="text-blue-600 text-sm underline"
//             >
//               + Add Buttons
//             </button>
//           </div>
//         )}

//         {(node.data.type === 'sendMessage' || showButtons) && (
//           <div className="mt-4">
//             <h4 className="text-sm font-medium mb-2">Buttons</h4>
//             {buttons.map((btn, index) => (
//               <div key={index} className="flex flex-col gap-1 mb-2 border p-2 rounded">
//                 <label className="text-xs font-medium">Button Title</label>
//                 <input
//                   type="text"
//                   value={btn.title}
//                   onChange={(e) => updateButton(index, 'title', e.target.value)}
//                   placeholder="Button Title"
//                   className="border px-2 py-1 text-sm rounded"
//                 />

//                 <label className="text-xs font-medium">Button Type</label>
//                 <select
//                   value={btn.type}
//                   onChange={(e) => updateButton(index, 'type', e.target.value)}
//                   className="border px-2 py-1 text-sm rounded"
//                 >
//                   <option value="postback">Postback (Payload)</option>
//                   <option value="url">URL</option>
//                 </select>

//                 <label className="text-xs font-medium">{btn.type === 'url' ? 'URL' : 'Payload'}</label>
//                 <input
//                   type="text"
//                   value={btn.payload}
//                   onChange={(e) => updateButton(index, 'payload', e.target.value)}
//                   placeholder={btn.type === 'url' ? 'https://example.com' : 'payload_value'}
//                   className="border px-2 py-1 text-sm rounded"
//                 />

//                 <button
//                   onClick={() => removeButton(index)}
//                   className="text-red-500 text-xs mt-1 self-end"
//                 >
//                   ✕ Remove
//                 </button>
//               </div>
//             ))}
//             <button onClick={addNewButton} className="text-blue-600 text-sm mt-2 underline">+ Add Button</button>
//           </div>
//         )}

//         <div className="mt-6 flex justify-end space-x-2">
//           <button onClick={onClose} className="text-gray-500">Cancel</button>
//           <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NodeConfigModal;



import React, { useState, useEffect } from 'react';

const NodeConfigModal = ({ node, onSave, onClose }) => {
  const [label, setLabel] = useState(node.data.label || '');
  const [variableName, setVariableName] = useState(node.data.field?.variableName || '');
  const [inputType, setInputType] = useState(node.data.field?.inputType || 'text');
  const [validation, setValidation] = useState(node.data.field?.validation || { required: false, regex: '' });

  const [buttons, setButtons] = useState(node.data.buttons || []);
  const [showButtons, setShowButtons] = useState(node.data.type === 'sendMessage' || buttons.length > 0);

  useEffect(() => {
    if (node.data.type === 'setCondition' && !node.data.conditionRoutes?.length) {
      node.data.conditionRoutes = [{ if: '' }];
    }
  }, []);

  const addNewButton = () => setButtons([...buttons, { title: '', payload: '', type: 'postback' }]);
  const updateButton = (index, key, value) => setButtons(prev => {
    const updated = [...prev];
    updated[index][key] = value;
    return updated;
  });
  const removeButton = (index) => {
    const updated = buttons.filter((_, i) => i !== index);
    setButtons(updated);
    if (updated.length === 0) setShowButtons(false);
  };

  const handleSave = () => {
    const updatedData = {
      ...node.data,
      label,
      field: {
        variableName,
        inputType,
        validation,
      },
      buttons: showButtons ? buttons : undefined
    };

    onSave({ ...node, data: updatedData });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[500px] max-w-full">
        <h2 className="text-lg font-semibold mb-4">Configure Node</h2>

        <label className="block text-sm font-medium mb-1">Label</label>
        <input className="w-full border px-2 py-1 mb-3" value={label} onChange={(e) => setLabel(e.target.value)} />

        {node.data.type !== 'setCondition' && (
          <>
            <label className="block text-sm font-medium mb-1">Variable Name</label>
            <input className="w-full border px-2 py-1 mb-3" value={variableName} onChange={(e) => setVariableName(e.target.value)} />

            <label className="block text-sm font-medium mb-1">Input Type</label>
            <select className="w-full border px-2 py-1 mb-3" value={inputType} onChange={(e) => setInputType(e.target.value)}>
              <option value="text">Text</option>
              <option value="date">Date</option>
              <option value="select">Dropdown</option>
            </select>

            <label className="block text-sm font-medium mb-1">Validation</label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={validation.required}
                onChange={(e) => setValidation((prev) => ({ ...prev, required: e.target.checked }))}
              />
              <span>Required</span>
            </div>
            <input
              className="w-full border px-2 py-1"
              placeholder="Regex (optional)"
              value={validation.regex}
              onChange={(e) => setValidation((prev) => ({ ...prev, regex: e.target.value }))}
            />
          </>
        )}

        {node.data.type !== 'sendMessage' && !showButtons && (
          <div className="mt-4">
            <button onClick={() => setShowButtons(true)} className="text-blue-600 text-sm underline">+ Add Buttons</button>
          </div>
        )}

        {(node.data.type === 'sendMessage' || showButtons) && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Buttons</h4>
            {buttons.map((btn, index) => (
              <div key={index} className="flex flex-col gap-1 mb-2 border p-2 rounded">
                <label className="text-xs font-medium">Title</label>
                <input className="border px-2 py-1 text-sm rounded" value={btn.title} onChange={(e) => updateButton(index, 'title', e.target.value)} />

                <label className="text-xs font-medium">Type</label>
                <select className="border px-2 py-1 text-sm rounded" value={btn.type} onChange={(e) => updateButton(index, 'type', e.target.value)}>
                  <option value="postback">Postback</option>
                  <option value="url">URL</option>
                </select>

                <label className="text-xs font-medium">{btn.type === 'url' ? 'URL' : 'Payload'}</label>
                <input
                  className="border px-2 py-1 text-sm rounded"
                  value={btn.payload}
                  onChange={(e) => updateButton(index, 'payload', e.target.value)}
                />

                <button onClick={() => removeButton(index)} className="text-red-500 text-xs mt-1 self-end">✕ Remove</button>
              </div>
            ))}
            <button onClick={addNewButton} className="text-blue-600 text-sm mt-2 underline">+ Add Button</button>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigModal;
