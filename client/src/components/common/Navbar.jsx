import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const navItems = [
    { label: 'Pricing', to: '/' },
    {
      label: 'Product',
      submenu: [
        { label: 'Overview', to: '/product/overview' },
        { label: 'Automation', to: '/product/automation' },
        { label: 'Campaigns', to: '/product/campaigns' },
      ],
    },
    {
      label: 'Resources',
      submenu: [
        { label: 'Blog', to: '/resources/blog' },
        { label: 'Docs', to: '/resources/docs' },
        { label: 'Case Studies', to: '/resources/case-studies' },
      ],
    },
    {
      label: 'Integration',
      submenu: [
        { label: 'Zapier', to: '/integration/zapier' },
        { label: 'API Access', to: '/integration/api' },
        { label: 'CRM', to: '/integration/crm' },
      ],
    },
    {
      label: 'Mobile App',
      submenu: [
        { label: 'Download', to: '/mobile/download' },
        { label: 'Features', to: '/mobile/features' },
        { label: 'Support', to: '/mobile/support' },
      ],
    },
  ];

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow bg-white relative z-50">
      <div className="text-green-600 font-bold text-xl">OTUSONE WhatsApp Service</div>

      <ul className="flex space-x-6 items-center text-gray-700">
        {navItems.map((item, index) => (
          <li key={index} className="relative group">
            {item.submenu ? (
              <>
                <div className="flex items-center cursor-pointer hover:text-green-600 select-none">
                  <span>{item.label}</span>
                  <FiChevronDown className="ml-1 text-gray-500 group-hover:text-green-600" />
                </div>

                <ul className="absolute top-full left-0 bg-white shadow-md rounded mt-2 py-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                  {item.submenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={subItem.to}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link to={item.to} className="hover:text-green-600">{item.label}</Link>
            )}
          </li>
        ))}

        <li>
          <Link
            to="/registration"
            className="bg-[#00a73d] text-white px-4 py-2 rounded-full inline-flex items-center space-x-2 hover:bg-green-700 transition"
          >
            <span>Start For Free</span>
            <FiArrowRight />
          </Link>
        </li>
        <li>
          <Link to="/login" className="px-4 py-2 border rounded hover:bg-gray-100">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
