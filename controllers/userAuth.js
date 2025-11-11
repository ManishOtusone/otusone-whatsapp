const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Subscription = require('../models/subscriptionPlan');

exports.sendOtp = async (req, res) => {
  try {
    const { whatsAppNumber } = req.body;
    if (!whatsAppNumber) {
      return res.status(400).json({ message: 'WhatsApp number required' });
    }

    let user = await User.findOne({ whatsAppNumber });

    if (user) {
      if (user.isSignupComplete) {
        return res.status(400).json({ message: 'User already exists. Please login with your credentials.' });
      } else {
        return res.status(200).json({ message: 'OTP sent for signup continuation', otp: '1234' });
      }
    } else {
      user = new User({ whatsAppNumber });
      await user.save();
      return res.status(200).json({ message: 'OTP sent', otp: '1234' });
    }

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ message: error?.message || 'Internal server error. Please try again later' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { whatsAppNumber, otp } = req.body;
    if (otp !== '1234') return res.status(400).json({ message: 'Invalid OTP' });

    const user = await User.findOne({ whatsAppNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = await user.generateAuthToken()
    user.verified = true;
    user.token = token;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully', token });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: error?.message || 'Internal server error. Please Try again later' });
  }
};

exports.completeSignup = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { name, email, password, address, language, timeZone, businessIndustry,
      businessDescription, websiteUrl
    } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.verified) return res.status(400).json({ message: 'User not verified' });

    if (user.isSignupComplete) return res.status(400).json({ message: 'Signup already completed' });
    Object.assign(user, {
      name,
      email,
      password,
      address,
      language,
      timeZone,
      businessIndustry,
      businessDescription,
      websiteUrl,
      isSignupComplete: true
    });
    await user.save();

    const plan = 'free';
    const freeBalance = 10;
    await Subscription.findOneAndUpdate(
      { userId },
      {
        plan,
        creditsLastUpdated: new Date(),
        qualityRating: 'high',
        wccBalance: freeBalance
      },
      { upsert: true, new: true }
    );


    const token = await user.generateAuthToken();
    res.status(200).json({ message: 'Signup completed', token, user });
  } catch (error) {
    console.error('Complete Signup Error:', error);

    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already in use. Please use a different email address.' });
    }

    res.status(500).json({ message: error?.message || 'Internal Server Error. Please try agai later' });
  }
};

exports.login = async (req, res) => {
  try {
    const { whatsAppNumber, password } = req.body;

    const user = await User.findOne({ whatsAppNumber });
    if (!user) return res.status(404).json({ message: 'Invalid Credentials' });
    if (!user.verified) return res.status(401).json({ message: 'User not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid Credentials' });

    const token = await user.generateAuthToken();
    user.token = token;
    res.status(200).json({ message: "User Login Successfully", token, user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: error?.message || 'Login Failed. Please try again later' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: "User profile found successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        whatsAppNumber: user.whatsAppNumber,
        address: user.address,
        avatar: user.avatar,
        language: user.language,
        timeZone: user.timeZone,
        businessIndustry: user.businessIndustry,
        businessDescription: user.businessDescription,
        websiteUrl: user.websiteUrl,
        isSignupComplete: user.isSignupComplete,
        isTermsAndConditionsAccepted: user.isTermsAndConditionsAccepted,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: error?.message || 'Internal server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password -token');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMetaConnected = Boolean(user.metaAccessToken && user.metaAccessToken.length > 0);

    return res.json({
      user,
      isMetaConnected,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: error?.message || 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const updates = req.body;

    const allowedUpdates = ['name', 'email', 'address', 'language',
      'timeZone', 'businessIndustry', 'businessDescription', 'websiteUrl',
    ];

    for (let key of Object.keys(updates)) {
      if (allowedUpdates.includes(key)) {
        user[key] = updates[key];
      }
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error?.message || 'Server error while updating profile. Please try again later' });
  }
};


// --------------------------------------webhook--------------------------------------------------------------------------------

exports.updateMetaWebhookConfig = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { webhookUrl, whatsappVerifyToken } = req.body;

    if (!webhookUrl || !whatsappVerifyToken) {
      return res.status(400).json({ message: "Both webhookUrl and whatsappVerifyToken are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        webhookUrl,
        whatsappVerifyToken
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Webhook configuration updated successfully.",
      data: {
        webhookUrl: updatedUser.webhookUrl,
        whatsappVerifyToken: updatedUser.whatsappVerifyToken
      }
    });
  } catch (error) {
    console.error("Error updating webhook config:", error);
    res.status(500).json({ message: error?.message || "Internal server error." });
  }
};
