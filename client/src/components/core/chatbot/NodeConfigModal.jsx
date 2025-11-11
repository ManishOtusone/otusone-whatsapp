import React, { useState } from 'react';

const NodeConfigModal = ({ node, onSave, onClose, allNodes = [] }) => {
    const [label, setLabel] = useState(node.data.label || '');
    const [variableName, setVariableName] = useState(node.data.field?.variableName || '');
    const [inputType, setInputType] = useState(node.data.field?.inputType || 'text');
    const [validation, setValidation] = useState(node.data.field?.validation || { required: false, regex: '' });
    const [buttons, setButtons] = useState(node.data.buttons || []);
    const [showButtons, setShowButtons] = useState(node.data.type === 'sendMessage' || buttons.length > 0);

    // Function to get connected node information
    const getConnectedNode = (btn) => {
        if (!btn.nextNodeId) return null;
        const connectedNode = allNodes.find(n => n.id === btn.nextNodeId);
        return {
            label: connectedNode?.data?.label || 'Unknown Node',
            id: connectedNode?.id || btn.nextNodeId
        };
    };

    // Function to remove a connection
    const removeConnection = (index) => {
        const updated = [...buttons];
        updated[index].nextNodeId = '';
        setButtons(updated);
    };

    const addNewButton = () => {
        setButtons([...buttons, { title: '', payload: '', type: 'postback', nextNodeId: '' }]);
        setShowButtons(true);
    };

    const updateButton = (index, key, value) => {
        const updated = [...buttons];
        updated[index][key] = value;
        
        // Clear nextNodeId if changing to URL type
        if (key === 'type' && value === 'url') {
            updated[index].nextNodeId = '';
        }
        
        setButtons(updated);
    };

    const removeButton = (index) => {
        const updated = buttons.filter((_, i) => i !== index);
        setButtons(updated);
        if (updated.length === 0 && node.data.type !== 'sendMessage') {
            setShowButtons(false);
        }
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
        };

        if (showButtons || node.data.type === 'sendMessage') {
            updatedData.buttons = buttons;
        } else {
            delete updatedData.buttons;
        }

        onSave({ ...node, data: updatedData });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Configure Node</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Label</label>
                        <input 
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={label} 
                            onChange={(e) => setLabel(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Variable Name</label>
                        <input 
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={variableName} 
                            onChange={(e) => setVariableName(e.target.value)} 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Input Type</label>
                        <select 
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputType} 
                            onChange={(e) => setInputType(e.target.value)}
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="email">Email</option>
                            <option value="date">Date</option>
                            <option value="select">Dropdown</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Validation</label>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={validation.required}
                                onChange={(e) => setValidation(prev => ({ ...prev, required: e.target.checked }))}
                                className="mr-2"
                            />
                            <span>Required</span>
                        </div>
                        <input
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Regex (optional)"
                            value={validation.regex}
                            onChange={(e) => setValidation(prev => ({ ...prev, regex: e.target.value }))}
                        />
                    </div>

                    {node.data.type !== 'sendMessage' && !showButtons && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowButtons(true)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                                + Add Buttons
                            </button>
                        </div>
                    )}

                    {(node.data.type === 'sendMessage' || showButtons) && (
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-medium">Buttons</h4>
                                <div className="flex items-center">
                                    <div className="flex items-center mr-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                        <span className="text-xs text-gray-500">Connected</span>
                                    </div>
                                    <div className="flex items-center mr-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
                                        <span className="text-xs text-gray-500">Not Connected</span>
                                    </div>
                                    <button 
                                        onClick={addNewButton}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        + Add Button
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {buttons.map((btn, index) => {
                                    const connectedNode = getConnectedNode(btn);
                                    
                                    return (
                                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                                            <div className="grid grid-cols-1 gap-2 mb-2">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Button Title</label>
                                                    <input
                                                        type="text"
                                                        value={btn.title}
                                                        onChange={(e) => updateButton(index, 'title', e.target.value)}
                                                        placeholder="Button Title"
                                                        className="w-full border px-3 py-1.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Button Type</label>
                                                    <select
                                                        value={btn.type}
                                                        onChange={(e) => updateButton(index, 'type', e.target.value)}
                                                        className="w-full border px-3 py-1.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="postback">Postback (Payload)</option>
                                                        <option value="url">URL</option>
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">
                                                        {btn.type === 'url' ? 'URL' : 'Payload'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={btn.payload}
                                                        onChange={(e) => updateButton(index, 'payload', e.target.value)}
                                                        placeholder={btn.type === 'url' ? 'https://example.com' : 'payload_value'}
                                                        className="w-full border px-3 py-1.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {btn.type === 'postback' && (
                                                <div className="mt-2">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-medium text-gray-600">Connection Status</span>
                                                        {connectedNode && (
                                                            <button 
                                                                onClick={() => removeConnection(index)}
                                                                className="text-xs text-red-500 hover:text-red-700"
                                                            >
                                                                Remove Connection
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className={`text-xs px-3 py-2 rounded ${
                                                        connectedNode 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {connectedNode ? (
                                                            <div>
                                                                <div className="font-medium">Connected to:</div>
                                                                <div className="mt-1 flex items-center">
                                                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                                                    <div className="truncate">
                                                                        <span className="font-semibold">{connectedNode.label}</span>
                                                                        <span className="ml-2 text-gray-600 text-xs">(ID: {connectedNode.id})</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="font-medium flex items-center">
                                                                <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                                                                <span>Not connected to any node</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="mt-2 flex justify-end">
                                                <button
                                                    onClick={() => removeButton(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Remove Button
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NodeConfigModal;