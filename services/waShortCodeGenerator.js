const crypto = require('crypto');

function generateShortCode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

module.exports = generateShortCode;
