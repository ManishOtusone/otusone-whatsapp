import {
  FaTh, FaComments, FaHistory, FaAddressBook, FaBullhorn,
  FaFacebook, FaProjectDiagram, FaRupeeSign, FaCog, FaPuzzlePiece,
  FaTags, FaRedo, FaBars
} from 'react-icons/fa';
import classNames from 'classnames';

import { FaRobot } from 'react-icons/fa';        // Robot/chatbot
import { BsChatDots } from 'react-icons/bs';     // Chat bubble with dots


const menuItems = [
  { name: 'Dashboard', icon: <FaTh />, path: "/admin/dashboard" },
  { name: 'Live Chat', icon: <FaComments />, path: "/admin/dashboard/live-chat" },
  { name: 'Chatboat', icon: <FaRobot />, path: "/admin/dashboard/chat-boat" },
  { name: 'History', icon: <FaHistory />, path: "/admin/dashboard/history" },
  { name: 'Contacts', icon: <FaAddressBook />, path: "/admin/dashboard/contacts" },
  { name: 'Campaigns', icon: <FaBullhorn />, path: "/admin/dashboard/campaigns" },
  { name: 'Ads Manager', icon: <FaFacebook />, path: "/admin/dashboard/ads-manager" },
  // { name: 'Flows', icon: <FaProjectDiagram />, path: "/admin/dashboard/flows" },
  { name: 'WA Pay', icon: <FaRupeeSign />, path: "/admin/dashboard/wa-pay" },
  { name: 'Manage', icon: <FaCog />, path: "/admin/dashboard/manage/template" },
  { name: 'Integrations', icon: <FaPuzzlePiece />, path: "/admin/dashboard/integrations" },
  // { name: 'EComm+', icon: <FaTags />, path: "/admin/dashboard/ecomm" },
];

const Sidebar = ({ isOpen, toggleSidebar, activeMenu, onMenuSelect }) => {
  return (
    <aside
      className={classNames(
        'fixed md:static top-0 left-0 z-40 bg-[#0E4C52] text-white h-full w-30 flex flex-col justify-between transition-transform duration-300 ease-in-out',
        {
          'translate-x-0': isOpen,
          '-translate-x-full md:translate-x-0': !isOpen,
        }
      )}
    >
      {/* Top Logo or Icon */}
      <div className="flex justify-center mt-4 gap-1" >
        <img src="https://www.otusone.com/static/media/image%201.9665bcd0030245e711326e9f305807f8.svg" alt="Logo" className="w-8 h-8" />
        <button className="md:hidden text-xl" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-6 flex flex-col items-center space-y-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => onMenuSelect(item)}
            className={classNames(
              'flex flex-col items-center justify-center cursor-pointer transition-all'
            )}
          >
            <div
              className={classNames('text-md p-2', {
                'bg-white text-[#0E4C52]': activeMenu === item.name,
                'hover:bg-white hover:text-[#0E4C52]': activeMenu !== item.name,
              })}
            >
              {item.icon}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Bottom: All Projects + User Icon */}
      <div className="flex flex-col items-center mb-6 space-y-4">
        <div className="flex flex-col items-center text-xs">
          <FaRedo className="text-xl mb-1" />
          All Projects
        </div>
        <div className="w-10 h-10 rounded-full bg-white text-[#0E4C52] flex items-center justify-center text-lg font-bold">
          N
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
