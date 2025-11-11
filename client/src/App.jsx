import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './components/layout/Dashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import UserProfile from './pages/dashboard/UserProfile';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import Registration from './pages/registration/Registration';
import Template from './pages/dashboard/Template';
import Contact from './pages/dashboard/Contact';
import LiveChat from './pages/dashboard/LiveChat';
import History from './pages/dashboard/History';
import AdsManager from './pages/dashboard/AdsManager';
import Flows from './pages/dashboard/Flows';
import WAPay from './pages/dashboard/WAPay';
import Integration from './pages/dashboard/Integration';
import EComme from './pages/dashboard/EComme';
import NewTemplateForm from './components/core/template/NewTemplate';
import CreateTagForm from './components/core/tags/CreateTag';
import CampaignWizard from './pages/dashboard/Campaign';
import CampaignList from './pages/dashboard/CampaignList';
import Chatboat from './pages/chatboat/Chatboat';
import ChatbotFlowViewer from './components/core/chatbot/ChatbotFlowViewer';
import ComingSoon from './pages/commingsoon/ComingSoon';
import WhatsAppWidgetForm from './components/core/widget/WhatsAppWidgetForm';
import PrivacyPolicy from './pages/privacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/termsOfService/TermsOfService';
import DataDeletion from './pages/dataDeletion/DataDelition';


function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="font-inter">
    <Routes>
      <Route path="/" element={<HomePage />} />
     <Route path="/login" element={<LoginPage />} />
     <Route path="/registration" element={<Registration />} />
      {/* <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/request-demo" element={<Demo />} /> */}

      <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="manage/template" element={<Template />} />
        <Route path="manage/tag/create" element={<CreateTagForm />} />
        <Route path="manage/template/create" element={<NewTemplateForm />} />
        <Route path="contacts" element={<Contact />} />

        <Route path="chat-boat" element={<Chatboat />} />
        <Route path="chat-boat/flow-viewer/:chatbotId" element={<ChatbotFlowViewer />} />

        {/* <Route path="live-chat" element={<LiveChat />} /> */}
        <Route path="live-chat" element={<LiveChat />} />
        <Route path="history" element={<History />} />
        <Route path="campaigns/create" element={<CampaignWizard />} />
        <Route path="campaigns" element={<CampaignList />} />
        {/* <Route path="ads-manager" element={<AdsManager />} /> */}
        <Route path="flows" element={<Flows />} />
        {/* <Route path="wa-pay" element={<WAPay />} /> */}
        <Route path="integrations" element={<Integration />} />
        <Route path="widget" element={<WhatsAppWidgetForm />} />
        {/* <Route path="ecomm" element={<EComme />} /> */}
        <Route path='*' element={<ComingSoon/>} />
      </Route>

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-services" element={<TermsOfService />} />
        <Route path="/deta-deletion" element={<DataDeletion />} />

    </Routes>
  </div >
  )
}

export default App
