import { useEffect, useState } from 'react';
import HorizontalTabs from '../../components/core/template/HorizontalTabs';
import TemplateTable from '../../components/core/template/TemplateTable';
import BroadcastAnalytics from '../../components/core/template/BroadCastAnalytics';
import { getRequest } from '../../services/apiServices';
import Tags from '../../components/core/tags/Tags';

const Template = () => {
  const [selectedTab, setSelectedTab] = useState('Template Messages');
 

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <HorizontalTabs selected={selectedTab} onSelect={setSelectedTab} />
      {selectedTab === 'Template Messages' && <TemplateTable />}
      {selectedTab === 'Broadcast Analytics' && <BroadcastAnalytics/>}
      {selectedTab === 'Scheduled Broadcasts' && <div>Scheduled Broadcasts View (coming soon)</div>}
      {selectedTab === 'Tags' && <Tags/>}
    </div>
  );
};

export default Template;
