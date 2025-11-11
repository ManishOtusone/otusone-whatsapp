const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionPlan');


exports.deductCredit = async (userId, cost = 1) => {
  const subscription = await Subscription.findOne({ userId });

  if (!subscription || subscription.wccBalance < cost) {
    throw new Error('Insufficient WCC balance');
  }

  subscription.wccBalance -= cost;
  await subscription.save();
};

exports.addCredit = async (userId, amount) => {
  if (amount <= 0) {
    throw new Error('Invalid amount to add');
  }

  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      $inc: { wccBalance: amount },
      creditsLastUpdated: new Date()
    },
    { new: true }
  );

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  return subscription;
}

