import React, { useEffect, useState } from 'react'
import StatusCardSection from '../../components/core/dashboard/StatusCardSection';
import OfferAccessCode from '../../components/core/dashboard/OfferAccessCode';
import ProgressSteps from '../../components/core/dashboard/ProgressSteps';
import CallToActions from '../../components/core/dashboard/CallToActions';
import SetupWhatsAppAccount from '../../components/core/dashboard/SetupWhatsAppAccount';

import QRDownloadApp from '../../components/core/dashboard/QRDownloadApp';
import UserProfileCard from '../../components/core/dashboard/UserProfileCard';
import CreditStats from '../../components/core/dashboard/CreditStats';
import CurrentPlan from '../../components/core/dashboard/CurrentPlan';
import ConnectMetaBusiness from '../../components/metaAuth/connectMeta';
import { getRequest } from '../../services/apiServices';
import PlatformTutorials from '../../components/common/Platformtutorial';
import WhatsAppLinkGenerator from '../../components/common/WhatsAppLinkGenerator';
import WhatsAppButtonLinkGenerator from '../../components/common/WhatsAppButtonLinkGenerator';



const UserDashboard = () => {
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  useEffect(() => {
    if (window.location.hash === '#_=_') {
      history.replaceState
        ? window.history.replaceState(null, null, window.location.href.split('#')[0])
        : (window.location.hash = '');
    }
    const fetchUserData = async () => {
      try {
        const res = await getRequest('/user/meta-connected/profile', { withCredentials: true });
        if (res.data.isMetaConnected) {
          const result = res.data.user || {}
          setIsMetaConnected(true);
          setUserProfile(result || {})
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <StatusCardSection />
        <OfferAccessCode />
        <ProgressSteps />
        <SetupWhatsAppAccount />
        <CallToActions />
        <PlatformTutorials />

      </div>
      <div className="space-y-4">
        <ConnectMetaBusiness isMetaConnected={isMetaConnected} />
        {/* <QRDownloadApp /> */}
         <WhatsAppLinkGenerator />
        <WhatsAppButtonLinkGenerator />
        <UserProfileCard user={userProfile || { name: 'Vidhya Drishti', whatsAppNumber: '+91874006648', profileUrl: '/admin/dashboard/profile' }} profileUrl='/admin/dashboard/profile' />
        <CreditStats wcc="45.37" adCredits="0" />
        <CurrentPlan />
       
      </div>

      {/* <div className="md:col-span-2  space-y-4">
         <PlatformTutorials/>
      </div> */}
    </div>

  )
}

export default UserDashboard