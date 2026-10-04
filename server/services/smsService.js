// BeAurex SMS Gateway Service
// Supports Twilio, Fast2SMS (India), or local server console dispatch

const https = require('https');

class SmsService {
  /**
   * Generate a random 6-digit numeric OTP
   */
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send SMS OTP to a 10-digit Indian or International mobile number
   * @param {string} mobile 10-digit mobile number
   * @param {string} otp 6-digit OTP code
   * @param {string} purpose 'login' | 'signup' | 'reset'
   */
  async sendOtp(mobile, otp, purpose = 'verification') {
    const cleanMobile = String(mobile).replace(/[^0-9]/g, '').slice(-10);
    const message = `Your BeAurex ${purpose} code is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`;

    console.log('\n======================================================');
    console.log(`📱 [SMS GATEWAY DISPATCH]`);
    console.log(`   Recipient: +91 ${cleanMobile}`);
    console.log(`   Purpose  : ${purpose.toUpperCase()}`);
    console.log(`   OTP Code : ${otp}`);
    console.log(`   Message  : "${message}"`);
    console.log('======================================================\n');

    // 1. Fast2SMS Integration (India SMS Gateway)
    if (process.env.FAST2SMS_API_KEY) {
      try {
        await this._sendFast2Sms(cleanMobile, otp);
        return { success: true, method: 'FAST2SMS' };
      } catch (err) {
        console.warn('⚠️ Fast2SMS delivery failed:', err.message);
      }
    }

    // 2. Twilio Integration (Global SMS Gateway)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await this._sendTwilio(cleanMobile, message);
        return { success: true, method: 'TWILIO' };
      } catch (err) {
        console.warn('⚠️ Twilio delivery failed:', err.message);
      }
    }

    // 3. Fallback / Local Development Mode
    return {
      success: true,
      method: 'CONSOLE_DEV',
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    };
  }

  _sendFast2Sms(mobile, otp) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: mobile
      });

      const options = {
        hostname: 'www.fast2sms.com',
        path: '/dev/bulkV2',
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`Fast2SMS responded with status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  _sendTwilio(mobile, message) {
    return new Promise((resolve, reject) => {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      const toNumber = mobile.startsWith('+') ? mobile : `+91${mobile}`;

      const postData = new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        Body: message
      }).toString();

      const options = {
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`Twilio error ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

module.exports = new SmsService();
