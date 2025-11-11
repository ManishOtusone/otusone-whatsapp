import React ,{useState} from 'react'
import ChatbotFlowBuilder from '../../components/core/chatbot/ChatbotFlowBuilder'
import ChatbotList from '../../components/core/chatbot/ChatbotList'
import { postApplicationJsonRequest } from '../../services/apiServices';

const ChatBot = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [chatbotName, setChatbotName] = useState('');
    const [error, setError] = useState('');
    const [startBuilder, setStartBuilder] = useState(false);


    const handleCreateClick = () => {
        setShowModal(true);
        setChatbotName('');
        setError('');
    };

     const handleCancelCreateClick = () => {
        setShowModal(false);
        setChatbotName('');
        setError('');
        setActiveTab('all')
    };

    const validateAndStart = async () => {
        if (!chatbotName.trim()) {
            setError('Chatbot name is required.');
            return;
        }
        try {
            const payload={
                name:chatbotName
            }
            const response = await postApplicationJsonRequest(`/meta-chatbot/validate-chatboat-name`,payload);
            if (!response.status===200 || !response?.data?.isValid) {
                setError(response?.data?.message || 'Name validation failed.');
            } else {
                setShowModal(false);
                setStartBuilder(true);
            }
        } catch (err) {
            setError('Failed to validate name.');
        }
    };
    return (
        <div className="p-4">
            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                    onClick={() => {
                        setActiveTab('all');
                        setStartBuilder(false);
                    }}
                >
                    All Chatbots
                </button>
                <button
                    className={`px-4 py-2 ml-4 ${activeTab === 'new' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                    onClick={() => {
                        setActiveTab('new');
                        handleCreateClick();
                    }}
                >
                    Create New
                </button>
            </div>

            {startBuilder ? (
                <ChatbotFlowBuilder chatbotName={chatbotName} setActiveTab={setActiveTab} setStartBuilder={setStartBuilder}  />
            ) : activeTab === 'all' ? (
                <ChatbotList />
            ) : null}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-md">
                        <h2 className="text-lg font-bold mb-4">Enter Chatbot Name</h2>
                        <input
                            type="text"
                            value={chatbotName}
                            onChange={(e) => setChatbotName(e.target.value)}
                            className="w-full border rounded p-2 mb-2"
                            placeholder="e.g. Lead Generator Bot"
                        />
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <div className="flex justify-end space-x-2">
                            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => handleCancelCreateClick()}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={validateAndStart}>Continue</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBot