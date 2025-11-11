import { useEffect, useState } from 'react';
import LiveChat from '../../components/core/livechat/LiveChat';
import { getRequest } from '../../services/apiServices';
import { FaRegComments, FaUserFriends, FaHistory, FaCogs } from 'react-icons/fa';

const ChatPage = ({ userId }) => {
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getRequest(`/contact/list`);
        if (response.status === 200) {
          const result = response?.data?.contacts || [];
          setContacts(result);
          if (result.length > 0) setActiveContactId(result[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch contacts', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="h-[95%] flex font-sans">
      <div className="w-64 bg-white border-r">
        <h2 className="p-4 font-semibold border-b text-lg">Contacts</h2>
        <ul className="overflow-y-auto h-full">
          {contacts.map((contact) => (
            <li
              key={contact._id}
              onClick={() => setActiveContactId(contact._id)}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                activeContactId === contact._id ? 'bg-[#e6fffb] font-medium' : ''
              }`}
            >
              {contact.name || contact.whatsAppNumber}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 bg-[#fcfcfc]">
        {activeContactId ? (
          <LiveChat contactId={activeContactId} userId={userId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <img src="/empty-chat.svg" alt="No chats" className="h-48 mb-6" />
            <p className="text-xl">Seems clear!</p>
            <p className="text-sm mt-1">Select a chat to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
