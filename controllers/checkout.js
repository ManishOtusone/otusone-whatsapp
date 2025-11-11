const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/subscriptionPlan');

exports.createCheckoutSession = async (req, res) => {
  const { _id: userId } = req.user;
  const { plan } = req.body;

  const prices = {
    Basic: 20, // ₹1699.00 (in paise)
    Pro: 45      // ₹3849.00
  };

  if (!['Basic', 'Pro'].includes(plan)) {
    return res.status(400).json({ success: false, message: 'Invalid plan' });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: `Subscription Plan - ${plan.toUpperCase()}`
        },
        unit_amount: prices[plan]
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/subscription/success?plan=${plan}`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`
  });

  res.json({ success: true, url: session.url });
};

exports.confirmSubscription = async (req, res) => {
  const { _id: userId } = req.user;
  const { plan } = req.query;

  const updated = await Subscription.findOneAndUpdate(
    { userId },
    { plan },
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, message: 'Subscription upgraded', data: updated });
};



exports.upgradePlan = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { plan } = req.body;

    if (!['Basic', 'Pro'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { userId },
      {
        plan,
        creditsLastUpdated: new Date(),
        qualityRating: 'high',
        wccBalance: plan === 'Basic' ? 20 : 45
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, message: 'Plan upgraded', data: updatedSubscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
