import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { patchRequest, postApplicationJsonRequest } from '../../services/apiServices';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';

const Registration = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const progress = localStorage.getItem("signupProgress");
    if (progress) {
      const parsed = JSON.parse(progress);
      setWhatsAppNumber(parsed.whatsAppNumber);
      setStep(3);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    language: 'English',
    timeZone: '(GMT+05:30), Chennai, Kolkata, New Delhi',
    businessIndustry: '',
    businessDescription: '',
    websiteUrl: ''
  });

  const handleSendOtp = async () => {
    try {
      const response = await postApplicationJsonRequest(`/user/send-otp`, { whatsAppNumber })
      if (response.status === 200) {
        toast.success(response?.data?.message || "OTP Sent Successfully")
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const payload = {
        whatsAppNumber, otp
      }
      const response = await postApplicationJsonRequest(`/user/verify-otp`, payload)
      if (response.status === 200) {
        const token = response.data.token
        toast.success(response?.data?.message || "OTP verified successfully")
        localStorage.setItem("signupProgress", JSON.stringify({
          whatsAppNumber,
          isSignupComplete: false
        }));
        localStorage.setItem('token', token);
        setStep(3);
      } 
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data.message || 'Invalid OTP');

    }
  };

  const handleSignup = async () => {
    try {
      const token=localStorage.getItem("token")
      const payload = {
        ...formData
      }
      // const response = await patchRequest(`/user/complete-signup`, payload)
      const response = await axios.patch(`${baseUrl}/user/complete-signup`,payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        toast.success(response?.data?.message || 'Signup successful!');
        const userData=response?.data.user;
        const token=response?.data.token;
        localStorage.removeItem("signupProgress");
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem('isSignupCompleted', userData?.isSignupComplete || false);
        navigate("/admin/dashboard")
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data.message || 'Failed to complete the signup');
    }
  };


  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto my-12 bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="md:w-1/2 p-8 bg-green-100 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-900">Welcome to OTUSONE</h2>
          <p className="text-green-800 mb-6">
            OTUSONE is your smart WhatsApp marketing and customer engagement solution.
            Register today to automate, grow, and support your business.
          </p>
          <img
            src="https://www.otusone.com/static/media/home_welcome.019fc632a821c4f67bdc.png"
            alt="About OTUSONE"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Register to OTUSONE</h2>

          {/* Step 1: WhatsApp Number */}
          {step === 1 && (
            <div>
              <label className="block mb-2 font-medium">WhatsApp Number</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
              />
              <button
                onClick={handleSendOtp}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Send OTP
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <label className="block mb-2 font-medium">Enter OTP</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={handleVerifyOtp}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Step 3: Complete Signup */}
          {step === 3 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
              }}
            >
              {[
                { label: 'Name', name: 'name' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Address', name: 'address' },
                { label: 'Business Industry', name: 'businessIndustry' },
                { label: 'Business Description', name: 'businessDescription' },
                { label: 'Website URL', name: 'websiteUrl' },
              ].map(({ label, name, type = 'text' }) => (
                <div className="mb-4" key={name}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <input
                    type={type}
                    className="w-full border p-2 rounded"
                    value={formData[name]}
                    onChange={(e) =>
                      setFormData({ ...formData, [name]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="mb-4">
                <label className="block mb-1 font-medium">Language</label>
                <select
                  className="w-full border p-2 rounded"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Time Zone</label>
                <select
                  className="w-full border p-2 rounded"
                  value={formData.timeZone}
                  onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                >
                  <option>(GMT+05:30), Chennai, Kolkata, New Delhi</option>
                  <option>(GMT+01:00), London</option>
                  <option>(GMT-08:00), Pacific Time (US & Canada)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Complete Signup
              </button>
            </form>
          )}

          {/* Link to Login */}
          <p className="text-sm text-center mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;
