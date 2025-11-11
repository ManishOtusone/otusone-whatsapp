import React, { useState } from 'react';
import { FiPlus, FiChevronDown, FiCheck, FiX, FiImage, FiVideo, FiFile, FiMapPin } from 'react-icons/fi';
import { languageData } from '../../../utils/languageList';
import axios from 'axios';
import { postApplicationJsonRequest } from '../../../services/apiServices';

const NewTemplateForm = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('Standard');
    const [broadcastType, setBroadcastType] = useState('None');
    const [formData, setFormData] = useState({
        name: '',
        category: 'MARKETING',
        language: 'en_US',
        headerText: '',
        bodyText: '',
        footerText: '',
        variables: [],
        buttons: [],
        broadcastTitle: '',
        broadcastMediaUrl: ''
    });
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeVariable, setActiveVariable] = useState(null);
    const [variableInput, setVariableInput] = useState('');

    const templateOptions = ['Standard', 'Catalog', 'Carousel', 'Limited time offers'];
    const broadcastOptions = ['None', 'Text', 'Image', 'Video', 'Document', 'Location', 'Carousel'];
    const categories = ['MARKETING', 'UTILITY', 'AUTHENTICATION'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addVariable = () => {
        if (!variableInput.trim()) return;

        const newVariable = {
            id: Date.now(),
            name: variableInput,
            example: `Example ${variableInput}`
        };

        setFormData(prev => ({
            ...prev,
            variables: [...prev.variables, newVariable],
            bodyText: `${prev.bodyText}{{${prev.variables.length + 1}}}`
        }));

        setVariableInput('');
        setActiveVariable(null);
    };

    const removeVariable = (id) => {
        setFormData(prev => ({
            ...prev,
            variables: prev.variables.filter(v => v.id !== id),
            bodyText: prev.bodyText.replace(new RegExp(`\\{\\{${prev.variables.findIndex(v => v.id === id) + 1}\\}\\}`, 'g'), '')
        }));
    };

    const addButton = (type) => {
        const newButton = {
            type: type === 'QUICK_REPLY' ? 'QUICK_REPLY' : 'URL',
            text: type === 'QUICK_REPLY' ? 'Quick Reply' : 'Visit Website'
        };

        setFormData(prev => ({
            ...prev,
            buttons: [...prev.buttons, newButton]
        }));
    };

    const removeButton = (index) => {
        setFormData(prev => ({
            ...prev,
            buttons: prev.buttons.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const components = [];

            // Add header if exists
            if (formData.headerText) {
                components.push({
                    type: 'HEADER',
                    format: 'TEXT',
                    text: formData.headerText
                });
            }

            // Add body with variables
            if (formData.bodyText) {
                const bodyComponent = {
                    type: 'BODY',
                    text: formData.bodyText
                };

                if (formData.variables.length > 0) {
                    bodyComponent.example = {
                        body_text: [formData.variables.map(v => v.example)]
                    };
                }

                components.push(bodyComponent);
            }

            // Add footer if exists
            if (formData.footerText) {
                components.push({
                    type: 'FOOTER',
                    text: formData.footerText
                });
            }

            // Add buttons if exists
            if (formData.buttons.length > 0) {
                components.push({
                    type: 'BUTTONS',
                    buttons: formData.buttons
                });
            }

            const payload = {
                name: formData.name,
                category: formData.category,
                language: formData.language,
                components
            };

            const response = await postApplicationJsonRequest(``)
            if (response.status === 200) {
                const result = response.data
                setResponse(result);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render media preview based on broadcast type
    const renderMediaPreview = () => {
        switch (broadcastType) {
            case 'Image':
                return (
                    <div className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-40">
                        <FiImage className="text-4xl text-gray-500 mb-2" />
                        <span className="text-sm text-gray-600">Image Preview</span>
                        {formData.broadcastMediaUrl && (
                            <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                                {formData.broadcastMediaUrl}
                            </span>
                        )}
                    </div>
                );
            case 'Video':
                return (
                    <div className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-40">
                        <FiVideo className="text-4xl text-gray-500 mb-2" />
                        <span className="text-sm text-gray-600">Video Preview</span>
                        {formData.broadcastMediaUrl && (
                            <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                                {formData.broadcastMediaUrl}
                            </span>
                        )}
                    </div>
                );
            case 'Document':
                return (
                    <div className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-40">
                        <FiFile className="text-4xl text-gray-500 mb-2" />
                        <span className="text-sm text-gray-600">Document Preview</span>
                        {formData.broadcastMediaUrl && (
                            <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                                {formData.broadcastMediaUrl}
                            </span>
                        )}
                    </div>
                );
            case 'Location':
                return (
                    <div className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-40">
                        <FiMapPin className="text-4xl text-gray-500 mb-2" />
                        <span className="text-sm text-gray-600">Location Preview</span>
                        {formData.broadcastTitle && (
                            <span className="text-sm font-medium mt-2">{formData.broadcastTitle}</span>
                        )}
                    </div>
                );
            case 'Carousel':
                return (
                    <div className="bg-gray-200 p-4 rounded-lg flex flex-col items-center justify-center h-40">
                        <div className="flex gap-2">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="w-16 h-16 bg-white rounded flex items-center justify-center">
                                    <span className="text-xs">Item {item}</span>
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 mt-2">Carousel Preview</span>
                    </div>
                );
            default:
                return null;
        }
    };

    // Format body text with line breaks and variables
    const formatBodyText = (text) => {
        return text.split('\n').map((line, lineIndex) => {
            const parts = line.split(/(\{\{\d+\}\})/);
            return (
                <div key={lineIndex}>
                    {parts.map((part, i) => {
                        const match = part.match(/\{\{(\d+)\}\}/);
                        if (match) {
                            const varIndex = parseInt(match[1]) - 1;
                            const variable = formData.variables[varIndex];
                            return (
                                <span key={i} className="text-blue-600">
                                    {variable ? variable.example : `{{${varIndex + 1}}}`}
                                </span>
                            );
                        }
                        return part;
                    })}
                </div>
            );
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50 p-6 gap-6">
            <div className="flex-1 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">New Templates</h2>

                {response && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                        <p>Template created successfully!</p>
                        <p>ID: {response.id}</p>
                        <p>Status: {response.status}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
                        <p>Error: {error.message || error}</p>
                        {error.error_user_msg && <p>{error.error_user_msg}</p>}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded mt-1 p-2"
                                    placeholder="Template Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded mt-1 p-2"
                                    required
                                >
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded mt-1 p-2"
                                    required
                                >
                                    {languageData && languageData.map((item, index) => (
                                        <option key={index} value={item.value}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Marketing template</label>
                        <div className="flex gap-4 flex-wrap">
                            {templateOptions.map((option) => (
                                <button
                                    key={option}
                                    className={`px-4 py-2 border rounded ${selectedTemplate === option
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border-gray-300'
                                        }`}
                                    onClick={() => setSelectedTemplate(option)}
                                >
                                    {option} {option !== 'Standard' ? <span className="text-xs ml-2 text-yellow-500">PRO</span> : ''}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Broadcast title (Optional)</label>
                        <p className="text-sm text-gray-500 mb-2">Highlight your brand here, use images or videos, to stand out</p>
                        <div className="flex flex-wrap gap-4 mb-4">
                            {broadcastOptions.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setBroadcastType(type)}
                                    className={`px-4 py-2 border rounded flex items-center gap-2 ${broadcastType === type
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300'
                                        }`}
                                >
                                    {type === 'Image' && <FiImage />}
                                    {type === 'Video' && <FiVideo />}
                                    {type === 'Document' && <FiFile />}
                                    {type === 'Location' && <FiMapPin />}
                                    {type}
                                </button>
                            ))}
                        </div>

                        {broadcastType !== 'None' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="broadcastTitle"
                                        value={formData.broadcastTitle}
                                        onChange={handleInputChange}
                                        placeholder="Enter broadcast title"
                                        className="w-full border border-gray-300 p-2 rounded"
                                    />
                                </div>

                                {(broadcastType === 'Image' || broadcastType === 'Video' || broadcastType === 'Document') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
                                        <input
                                            type="text"
                                            name="broadcastMediaUrl"
                                            value={formData.broadcastMediaUrl}
                                            onChange={handleInputChange}
                                            placeholder="Enter media URL"
                                            className="w-full border border-gray-300 p-2 rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Header Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Header (Optional)</label>
                        <input
                            type="text"
                            name="headerText"
                            value={formData.headerText}
                            onChange={handleInputChange}
                            placeholder="Header text"
                            className="w-full border border-gray-300 p-2 rounded"
                            maxLength={60}
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">{formData.headerText.length}/60</div>
                    </div>

                    {/* Body Editor */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                        <p className="text-sm text-gray-500 mb-2">
                            Make your messages personal using variables like <span className="text-green-600 font-mono">{'{name}'}</span> and get more replies!
                        </p>
                        <textarea
                            name="bodyText"
                            value={formData.bodyText}
                            onChange={handleInputChange}
                            placeholder="Template Message..."
                            rows={5}
                            maxLength={550}
                            className="w-full border border-gray-300 p-3 rounded resize-none"
                            required
                        ></textarea>
                        <div className="text-sm text-gray-500 text-right mt-1">{formData.bodyText.length}/550</div>

                        {/* Variables Section */}
                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.variables.map((variable, index) => (
                                    <div key={variable.id} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                        <span className="mr-1">{`{{${index + 1}}}`}</span>
                                        <span>{variable.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeVariable(variable.id)}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {activeVariable ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={variableInput}
                                        onChange={(e) => setVariableInput(e.target.value)}
                                        placeholder="Variable name"
                                        className="border border-gray-300 p-2 rounded flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={addVariable}
                                        className="bg-blue-600 text-white px-3 rounded"
                                    >
                                        <FiCheck />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveVariable(false)}
                                        className="bg-gray-200 px-3 rounded"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setActiveVariable(true)}
                                    className="text-sm text-green-600"
                                >
                                    + Add Variable
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer (Optional)</label>
                        <p className="text-sm text-gray-500 mb-1">Footers are great to add any disclaimers or to add a thoughtful PS</p>
                        <input
                            type="text"
                            name="footerText"
                            value={formData.footerText}
                            onChange={handleInputChange}
                            placeholder="Powered by OTUSONE LLP"
                            className="w-full border border-gray-300 p-2 rounded"
                            maxLength={60}
                        />
                        <div className="text-sm text-gray-500 text-right mt-1">{formData.footerText.length}/60</div>
                    </div>

                    {/* Buttons Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Buttons (Recommended)</label>
                        <p className="text-sm text-gray-500 mb-4">Insert buttons so your customers can take action and engage with your message!</p>

                        <div className="space-y-4">
                            {formData.buttons.map((button, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                                    <div>
                                        <span className="font-medium">{button.type === 'QUICK_REPLY' ? 'Quick Reply' : 'URL Button'}</span>
                                        <p className="text-sm text-gray-600">{button.text}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeButton(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ))}

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => addButton('QUICK_REPLY')}
                                    className="border px-4 py-1 text-sm text-green-600 border-green-600 rounded hover:bg-green-50"
                                >
                                    Add Quick Reply
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addButton('URL')}
                                    className="border px-4 py-1 text-sm text-green-600 border-green-600 rounded hover:bg-green-50"
                                >
                                    Add URL Button
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Buttons */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-100"
                        >
                            Save as draft
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400"
                        >
                            {loading ? 'Submitting...' : 'Save and submit'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Phone Preview */}
            <div className="w-[320px] h-[600px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 relative">
                <div className="bg-green-600 text-white text-center rounded-t-md p-2">WhatsApp</div>
                <div className="bg-gray-100 h-[500px] p-2 overflow-y-auto flex flex-col gap-2">
                    {/* Broadcast Preview */}
                    {broadcastType !== 'None' && (
                        <div className="bg-white rounded-lg overflow-hidden shadow">
                            {renderMediaPreview()}
                            {formData.broadcastTitle && (
                                <div className="p-3">
                                    <h3 className="font-medium">{formData.broadcastTitle}</h3>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Template Preview */}
                    {formData.headerText && (
                        <div className="bg-white text-sm p-2 rounded shadow text-center font-medium">
                            {formData.headerText}
                        </div>
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

                    {formData.buttons.length > 0 && (
                        <div className="flex flex-col gap-2 mt-2">
                            {formData.buttons.map((button, i) => (
                                <button
                                    key={i}
                                    className={`p-2 rounded text-sm ${button.type === 'QUICK_REPLY'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'}`}
                                >
                                    {button.text}
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
    );
};

export default NewTemplateForm;