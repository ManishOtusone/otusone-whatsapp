const Campaign = require('../models/campaign');


exports.getCampaignStats = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const stats = await Campaign.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: '$status',
            total: { $sum: 1 },
            totalContacts: { $sum: '$totalContacts' },
            successCount: { $sum: '$successCount' },
            failedCount: { $sum: '$failedCount' },
          },
        },
      ]);
  
      res.status(200).json({ stats });
    } catch (error) {
      console.error('Campaign stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  