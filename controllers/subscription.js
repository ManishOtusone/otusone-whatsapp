const Subscription = require('../models/subscriptionPlan');

exports.getSubscription = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    let subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      // Auto-create if not found
      subscription = await Subscription.create({ userId });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message:error?.message || 'Failed to fetch subscription' });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { plan } = req.body;

    if (!['free', 'starter', 'pro'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      { plan },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Plan updated', data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message:error?.message || 'Failed to update plan' });
  }
};

exports.rechargeCredits = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { amount } = req.body; // ₹45.37 = 45.37 credits

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        $inc: { wccBalance: amount },
        creditsLastUpdated: new Date()
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Credits added', data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message:error?.message || 'Recharge failed' });
  }
};
