import { useEffect } from 'react';
import { useState } from 'react';
import { FiEdit, FiSave, FiUser, FiMail, FiPhone, FiGlobe, FiBriefcase, FiClock, FiMapPin, FiCheckCircle, FiShield } from 'react-icons/fi';
import { getRequest } from '../../services/apiServices';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email:'',
    whatsAppNumber: '',
    address:  '',
    language:'English',
    businessIndustry:  '',
    businessDescription:  '',
    websiteUrl: ''
  })
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email:'',
    whatsAppNumber: '',
    address:  '',
    language:'English',
    businessIndustry:  '',
    businessDescription:  '',
    websiteUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update the user
    console.log('Updated data:', formData);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getRequest(`/user/profile`);
        if (response.status == 200) {
          const userData = response.data.user || {};
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            whatsAppNumber: userData.whatsAppNumber,
            address: userData.address,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
    fetchUserData();
  }
    , []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-[#75195f] h-32 relative">
            <div className="absolute -bottom-16 left-6">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
                {user && user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="text-indigo-400 text-6xl" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-indigo-600 flex items-center mt-1">
                  <FiMail className="mr-2" /> {user.email}
                </p>
                {user.verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    <FiCheckCircle className="mr-1" /> Verified Account
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 bg-[#75195f] hover:bg-[#0e4c52] text-white rounded-lg transition-colors"
              >
                {isEditing ? (
                  <>
                    <FiSave className="mr-2" /> Save Changes
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2 " /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiUser className="text-indigo-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      name="whatsAppNumber"
                      value={formData.whatsAppNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp Number</p>
                  <p className="text-gray-800">{user.whatsAppNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{user.address || 'Not provided'}</p>
                </div>
              </div>
            )}
          </div>

          {/* General Settings Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiGlobe className="text-indigo-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">General Settings</h2>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Zone</p>
                  <p className="text-gray-800 flex items-center">
                    <FiClock className="mr-2" /> {user.timeZone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-800">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="text-gray-800">{user.language}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Zone</p>
                  <p className="text-gray-800 flex items-center">
                    <FiClock className="mr-2" /> {user.timeZone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="text-gray-800">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Business Information Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiBriefcase className="text-indigo-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Business Information</h2>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    name="businessIndustry"
                    value={formData.businessIndustry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="text-gray-800">{user.businessIndustry || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-800">{user.businessDescription || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-gray-800">
                    {user.websiteUrl ? (
                      <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {user.websiteUrl}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account & Security Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiShield className="text-indigo-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Account & Security</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Account Status</p>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <p className="text-gray-800">{user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Signup Completed</p>
                <p className="text-gray-800">{user.isSignupComplete ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terms Accepted</p>
                <p className="text-gray-800">{user.isTermsAndConditionsAccepted ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;