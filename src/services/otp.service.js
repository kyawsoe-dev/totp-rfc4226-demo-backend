const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

class OTPService {
  async generate(userId, deviceName = 'Primary Device') {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `TOTP RFC4226 DEMO APP (${userId})`,
    });

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return {
      id: crypto.randomUUID(),
      base32: secret.base32,
      qr,
      deviceName,
      createdAt: new Date(),
    };
  }

  verify(token, base32) {
    return speakeasy.totp.verify({
      secret: base32,
      encoding: 'base32',
      token,
      window: 1,
    });
  }

  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }
}

module.exports = new OTPService();
