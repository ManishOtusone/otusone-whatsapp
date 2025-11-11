import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import ProfilePanel from './ProfilePanel';

const Header = ({ toggleSidebar, currentPlan = "Free Plan" }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user=localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  const {name,language,timeZone,whatsAppNumber,address,email,clientId}=user;

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <>
      <header className="bg-white shadow p-4 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-xl" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <span className="font-semibold text-gray-700">{name}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{currentPlan}</span>
          <div className="hidden md:block font-semibold">Welcome!</div>
          <button
            className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
            onClick={toggleProfile}
          >
            <FiUser />
          </button>
        </div>
      </header>

      <ProfilePanel isOpen={isProfileOpen} onClose={toggleProfile} />
    </>
  );
};

export default Header;
