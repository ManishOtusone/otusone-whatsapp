import React, { useEffect, useState } from 'react';
import { deleteRequest, getRequest, postApplicationJsonRequest } from '../../services/apiServices';
import { FiCopy, FiChevronDown, FiChevronUp, FiCode } from 'react-icons/fi';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { codeSnippets } from '../../utils/integrationData';
import toast from 'react-hot-toast';

const Integration = () => {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [activeTab, setActiveTab] = useState('curl');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const [expandedSections, setExpandedSections] = useState({
    curl: true,
    javascript: false,
    python: false,
    php: false,
    java: false
  });

  const getUserAPIKey = async () => {
    try {
      const response = await getRequest("/intigration/api-key");
      if (response.status === 200) {
        setKeys(response.data.apiKeys);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    }
  };
  const toggleSection = (language) => {
    setExpandedSections(prev => ({
      ...prev,
      [language]: !prev[language]
    }));
  };

  const generateKey = async () => {
    try {
      const response = await postApplicationJsonRequest("/intigration/generate-api-key", {
        name: newKeyName,
        scopes: []
      });

      if (response.status === 201) {
        const newKey = response.data.data;
        setNewlyGeneratedKey(newKey);
        setShowKeyModal(true);
        setNewKeyName('');
        getUserAPIKey();
        toast.success(`API Key Generated!`);
      }
    } catch (error) {
      console.error("Error generating key:", error);
      toast.error(error?.response?.data?.message || "Failed to generate API key");
    }
  };

  const revokeKey = async (keyId) => {
    try {
      const response = await deleteRequest(`/intigration/revoke-api-key/${keyId}`);
      if (response.status === 200) {
        toast.success(response.data?.message);
        setKeys([])
      }
    } catch (error) {
      console.error("Error revoking key:", error);
      toast.error(error?.response?.data?.message || "Failed to Delete");
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000); // reset after 2 seconds
  };


  useEffect(() => {
    getUserAPIKey();
  }, []);


  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API Keys Management</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., 'Production Server'"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={generateKey}
                disabled={!newKeyName.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate New API Key
              </button>
            </div>
          </div>

          {keys && keys.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Your Active API Keys</h3>
              <div className="space-y-3">
                {keys.map(key => (
                  <div key={key._id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Key ID:</span> {key.key}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {new Date(key.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => revokeKey(key._id)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded-md hover:bg-red-50"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Integration Guide */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API Integration Guide</h2>

        <div className="mb-6">
          <label className="text-sm font-medium">API Endpoint</label>
          <div className="flex items-center bg-gray-100 p-2 rounded">
            <input
              type="text"
              readOnly
              value="https://otusone-whatsapp.onrender.com/api/v1/otusone/intigration/send-message"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={() =>
                copyToClipboard(
                  "https://otusone-whatsapp.onrender.com/api/v1/otusone/intigration/send-message",
                  'apiEndpoint'
                )
              }
            >
              {copiedField === 'apiEndpoint' ? (
                <span className="ml-2 text-green-600">✔</span>
              ) : (
                <FiCopy className="ml-2 text-gray-600 hover:text-black" />
              )}
            </button>
          </div>
        </div>


        <p className="text-gray-600 mb-6">
          Use these code samples to integrate with our WhatsApp Business API. Replace <code className="bg-gray-100 px-1 rounded">YOUR_API_KEY</code> and <code className="bg-gray-100 px-1 rounded">YOUR_API_SECRET</code> with your actual credentials.
        </p>

        {/* Language Tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {Object.keys(codeSnippets).map(lang => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-4 py-2 rounded-md ${activeTab === lang ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        {/* Code Samples */}
        <div className="space-y-4">
          {Object.entries(codeSnippets).map(([language, code]) => (
            <div key={language} className="border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center bg-gray-50 p-3 cursor-pointer"
                onClick={() => toggleSection(language)}
              >
                <div className="flex items-center">
                  <FiCode className="mr-2" />
                  <span className="font-medium">
                    {language.charAt(0).toUpperCase() + language.slice(1)} Example
                  </span>
                </div>
                {expandedSections[language] ? <FiChevronUp /> : <FiChevronDown />}
              </div>

              {expandedSections[language] && (
                <div className="relative">
                  <SyntaxHighlighter
                    language={language === 'curl' ? 'bash' : language}
                    style={atomOneDark}
                    customStyle={{ margin: 0, borderRadius: 0 }}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <button
                    onClick={() => copyToClipboard(code)}
                    className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded hover:bg-gray-800"
                    title="Copy to clipboard"
                  >
                    <FiCopy size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation Link */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Need More Help?</h2>
        <p className="text-blue-700 mb-4">
          Check out our comprehensive API documentation for all available endpoints, parameters, and response formats.
        </p>
        <a
          href="/api-docs"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Full API Documentation
        </a>
      </div>


      {showKeyModal && newlyGeneratedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Save Your API Credentials</h2>
            <p className="text-gray-700 mb-4">This is the only time you'll see your secret key. Make sure to copy and store it securely.</p>

            <div className="mb-4">
              <label className="text-sm font-medium">API Key</label>
              <div className="flex items-center bg-gray-100 p-2 rounded">
                <span className="flex-1 break-all">{newlyGeneratedKey.key}</span>
                <button onClick={() => copyToClipboard(newlyGeneratedKey.key)}>
                  <FiCopy className="ml-2 text-gray-600 hover:text-black" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium">Secret Key</label>
              <div className="flex items-center bg-gray-100 p-2 rounded">
                <span className="flex-1 break-all">{newlyGeneratedKey.secret}</span>
                <button onClick={() => copyToClipboard(newlyGeneratedKey.secret)}>
                  <FiCopy className="ml-2 text-gray-600 hover:text-black" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowKeyModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                I Have Saved It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Integration;