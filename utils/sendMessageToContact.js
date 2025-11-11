exports.sendMessageToContact=async(contact, campaign)=> {
    console.log(`Sending message to ${contact.name} (${contact.whatsAppNumber}) for campaign ${campaign.name}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve();
  };
  