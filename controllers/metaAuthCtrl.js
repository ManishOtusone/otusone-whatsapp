const axios = require('axios');
const User = require('../models/user');
const dotenv=require("dotenv")
const jwt = require("jsonwebtoken");

dotenv.config();

const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const REDIRECT_URI = process.env.META_REDIRECT_URI;
const STATE_SECRET = process.env.JWT_SECRET;


exports.getMetaLoginUrl = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const stateToken = jwt.sign({ userId }, STATE_SECRET, { expiresIn: '1d' });
  
      const metaLoginUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
        `client_id=${META_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&state=${stateToken}` +
        `&scope=whatsapp_business_management,business_management,whatsapp_business_messaging,pages_messaging,pages_show_list`;
  
      res.json({ loginUrl: metaLoginUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not generate Meta login URL' });
    }
  };

exports.metaAuthCallback = async (req, res) => {
    try {
      const { code, state } = req.query;
  
      // Step 1: Decode the state token
      let userId;
      try {
        const decoded = jwt.verify(state, STATE_SECRET);
        userId = decoded.userId;
        console.log("userId",userId)
      } catch (err) {
        return res.status(400).json({ error: 'Invalid or expired state token' });
      }
  
      // Step 2: Exchange code for access token
      const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token`, {
        params: {
          client_id: META_APP_ID,
          client_secret: process.env.META_APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      });
  
      const { access_token, expires_in } = tokenRes.data;

      console.log("access_token, expires_in",access_token, expires_in)
  
      // Step 3–5: Get business, WABA, phone number
      const businessRes = await axios.get(`https://graph.facebook.com/v19.0/me/businesses`, {
        params: { access_token },
      });
  
      const businessId = businessRes.data.data?.[0]?.id;
      if (!businessId) return res.status(400).json({ message: 'No business found' });
  
      const wabaRes = await axios.get(`https://graph.facebook.com/v19.0/${businessId}/owned_whatsapp_business_accounts`, {
        params: { access_token },
      });
  
      const waba = wabaRes.data.data?.[0];
      if (!waba) return res.status(400).json({ message: 'No WABA found' });
  
      const phoneRes = await axios.get(`https://graph.facebook.com/v19.0/${waba.id}/phone_numbers`, {
        params: { access_token },
      });
  
      const phoneNumberId = phoneRes.data.data?.[0]?.id;
      if (!phoneNumberId) return res.status(400).json({ message: 'No phone number found' });
  
      const saveUser=await User.findByIdAndUpdate(userId, {
        metaAccessToken: access_token,
        metaTokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        whatsappBusinessAccountId: waba.id,
        phoneNumberId,
        isSignupComplete: true,
      });
  
    //   console.log("saveUser",saveUser)
      res.redirect('http://localhost:5173/admin/dashboard');
    } catch (err) {
      console.error('Meta OAuth Error:', err.response?.data || err.message);
      res.status(500).json({ message: 'Meta authentication failed' });
    }
  };
  
