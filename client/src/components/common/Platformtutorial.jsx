import { useState } from 'react';
import { FiPlay, FiChevronDown, FiChevronUp, FiBookOpen, FiYoutube } from 'react-icons/fi';

const PlatformTutorials = () => {
  const [expandedSections, setExpandedSections] = useState({
    platform: true,
    template: false,
    liveChat: false,
    campaign: false,
    chatbot: false
  });

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const tutorials = {
    platform: [
      { title: "Read Platform Guide", video: "platform-guide" },
      { title: "AISensy Platform Demo", video: "platform-demo" }
    ],
    template: [
      { title: "How to Create WhatsApp Template Message?", video: "create-template" },
      { title: "Use chatbot parameters for leads", video: "chatbot-parameters" },
      { title: "Add Quick Reply to WhatsApp Template Message", video: "quick-reply" },
      { title: "Message formatting guideline (Bold, Italic & more)", video: "formatting" }
    ],
    liveChat: [
      { title: "Add user attributes manually", video: "add-attributes" },
      { title: "Add/Remove Tag & update attribute", video: "manage-tags" },
      { title: "Send & Generate media link", video: "media-links" },
      { title: "How to create & add tags to contacts", video: "contact-tags" }
    ],
    campaign: [
      { title: "Audience segregation for WhatsApp Broadcast", video: "audience-segregation" },
      { title: "Upgrade WhatsApp Tier Limit", video: "tier-upgrade" },
      { title: "Import upto 2 lakh contacts in one go", video: "contact-import" }
    ],
    chatbot: [
      { title: "Setup Welcome WhatsApp Chatbot", video: "welcome-chatbot" },
      { title: "Create WhatsApp Button for Free", video: "whatsapp-button" },
      { title: "Create WhatsApp Link for Free", video: "whatsapp-link" }
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const openVideoModal = (videoId) => {
    setSelectedVideo(videoId);
    setShowModal(true);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Platform Walkthrough & Tutorials</h1>
      
      {/* Platform Section */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center bg-blue-50 p-4 cursor-pointer"
          onClick={() => toggleSection('platform')}
        >
          <div className="flex items-center">
            <FiBookOpen className="text-blue-600 mr-3" />
            <h2 className="font-semibold text-lg text-gray-800">Platform</h2>
          </div>
          {expandedSections.platform ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.platform && (
          <div className="p-4 bg-white">
            {tutorials.platform.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{item.title}</span>
                <button 
                  onClick={() => openVideoModal(item.video)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlay className="mr-1" /> Watch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Template Section */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center bg-blue-50 p-4 cursor-pointer"
          onClick={() => toggleSection('template')}
        >
          <h2 className="font-semibold text-lg text-gray-800">Template</h2>
          {expandedSections.template ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.template && (
          <div className="p-4 bg-white">
            {tutorials.template.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{item.title}</span>
                <button 
                  onClick={() => openVideoModal(item.video)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlay className="mr-1" /> Watch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Chat Section */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center bg-blue-50 p-4 cursor-pointer"
          onClick={() => toggleSection('liveChat')}
        >
          <h2 className="font-semibold text-lg text-gray-800">Live Chat & Attribute</h2>
          {expandedSections.liveChat ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.liveChat && (
          <div className="p-4 bg-white">
            {tutorials.liveChat.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{item.title}</span>
                <button 
                  onClick={() => openVideoModal(item.video)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlay className="mr-1" /> Watch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Section */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center bg-blue-50 p-4 cursor-pointer"
          onClick={() => toggleSection('campaign')}
        >
          <h2 className="font-semibold text-lg text-gray-800">Campaign</h2>
          {expandedSections.campaign ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.campaign && (
          <div className="p-4 bg-white">
            {tutorials.campaign.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{item.title}</span>
                <button 
                  onClick={() => openVideoModal(item.video)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlay className="mr-1" /> Watch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chatbot Section */}
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <div 
          className="flex justify-between items-center bg-blue-50 p-4 cursor-pointer"
          onClick={() => toggleSection('chatbot')}
        >
          <h2 className="font-semibold text-lg text-gray-800">Chatbot & Integration</h2>
          {expandedSections.chatbot ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.chatbot && (
          <div className="p-4 bg-white">
            {tutorials.chatbot.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{item.title}</span>
                <button 
                  onClick={() => openVideoModal(item.video)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FiPlay className="mr-1" /> Watch
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg w-full max-w-4xl overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b bg-white">
              <h3 className="text-lg font-semibold">
                {selectedVideo ? tutorials[Object.keys(tutorials).find(key => 
                  tutorials[key].some(item => item.video === selectedVideo))
                ].find(item => item.video === selectedVideo).title : 'Video Tutorial'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-black">
              {/* Replace with your actual video embed component */}
              <div className="w-full h-96 flex items-center justify-center">
                <div className="text-center">
                  <FiYoutube className="mx-auto text-red-600 text-5xl mb-3" />
                  <p className="text-white">Video Player for: {selectedVideo}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-right">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformTutorials;