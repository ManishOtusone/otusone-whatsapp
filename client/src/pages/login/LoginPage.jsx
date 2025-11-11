import { useState,useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import FAQSection from '../../components/common/FAQSection';
import Footer from '../../components/common/Footer';
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postApplicationJsonRequest } from '../../services/apiServices';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await postApplicationJsonRequest("/user/login", {
        whatsAppNumber,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const userData = response.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem('isSignupCompleted', userData?.isSignupComplete || false);
        dispatch(setToken(token));
        dispatch(setUser(userData));
        dispatch(setToken(token));

        console.log("Login successful. Token stored:", token);
        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side: About OTUSONE */}
        <div className="w-full lg:w-1/2 bg-green-100 p-8 flex flex-col justify-center items-center text-center">
          <img
            src="https://www.otusone.com/static/media/home_welcome.019fc632a821c4f67bdc.png"
            alt="Otusone"
            className="w-32 h-32 mb-6"
          />
          <h2 className="text-3xl font-bold text-green-800 mb-4">Welcome to OTUSONE</h2>
          <p className="text-gray-700 text-lg">
            We offer intelligent software solutions to empower businesses digitally.
            Connect with our WhatsApp services to boost productivity and support.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 p-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login to OTUSONE WhatsApp Service
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="whatsAppNumber"
              className="w-full px-4 py-2 border rounded"
              value={whatsAppNumber}
              onChange={e => setWhatsAppNumber(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Login
            </button>
          </form>

          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <Link to="/forgot-password" className="hover:underline text-green-700">
              Forgot Password?
            </Link>
            <Link to="/registration" className="hover:underline text-green-700">
              New here? Sign Up
            </Link>
          </div>
        </div>
      </div>
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LoginPage;
