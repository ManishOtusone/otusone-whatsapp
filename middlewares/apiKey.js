const ApiKey = require("../models/apiKey");
const User = require("../models/user");

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const apiSecret = req.headers['x-api-secret'];
    
    if (!apiKey || !apiSecret) {
      return res.status(401).json({ error: 'API key and secret required' });
    }
    
    const keyData = await ApiKey.findOne({ key: apiKey }).populate('userId');
    if (!keyData || !keyData.isActive) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    const isValid = await keyData.verifySecret(apiSecret);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid API credentials' });
    }
    
    // Update last used timestamp
    keyData.lastUsedAt = new Date();
    await keyData.save();
    
    // Attach user and key permissions to request
    req.user = keyData.userId;
    req.keyData = keyData;
    req.keyPermissions = keyData.scopes;
    
    next();
  } catch (error) {
    console.error('API key auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const checkAPILimit = async (req, res, next) => {
  try {
    const keyData = req.keyData;
    
    // Reset usage if it's a new day
    const today = new Date().toDateString();
    const lastUsedDay = keyData.lastUsedAt?.toDateString();
    if (lastUsedDay !== today) {
      keyData.usageToday = 0;
      await keyData.save();
    }
    
    if (keyData.usageToday >= keyData.dailyLimit) {
      return res.status(429).json({ 
        error: 'Daily limit exceeded',
        limit: keyData.dailyLimit,
        remaining: 0
      });
    }
    
    // Increment usage
    keyData.usageToday += 1;
    await keyData.save();
    
    // Add rate limit info to response headers
    res.set({
      'X-RateLimit-Limit': keyData.dailyLimit,
      'X-RateLimit-Remaining': keyData.dailyLimit - keyData.usageToday
    });
    
    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const checkPermission = (requiredScope) => {
  return (req, res, next) => {
    if (!req.keyPermissions.includes(requiredScope)) {
      return res.status(403).json({ 
        error: 'Permission denied',
        required: requiredScope,
        available: req.keyPermissions
      });
    }
    next();
  };
};


module.exports = {
    checkPermission,
    checkAPILimit,
    apiKeyAuth
}