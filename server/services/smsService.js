// BeAurex SMS Gateway Service
// Supports Dynamic Config from Super Admin (Fast2SMS, MSG91, Twilio)
// Graceful Fallback: When no keys are configured, operates in Console Dev mode without breaking.

const https = require('https');
const systemStore = require('./systemStore');

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

    try {
      const config = await systemStore.getConfig();
      const isConfigured = systemStore.isSmsConfigured(config);

      if (isConfigured) {
        const provider = (config.smsProvider || 'FAST2SMS').toUpperCase();
        const apiKey = config.smsApiKey || process.env.FAST2SMS_API_KEY || process.env.MSG91_AUTH_KEY;
        const senderId = config.smsSenderId || 'BEAURE';

        // 1. Fast2SMS (India Quick OTP & DLT)
        if (provider === 'FAST2SMS' || (process.env.FAST2SMS_API_KEY && !config.smsProvider)) {
          const keyToUse = (apiKey && apiKey !== 'sms_live_key_9182736450') ? apiKey : process.env.FAST2SMS_API_KEY;
          if (keyToUse) {
            try {
              const res = await this._sendFast2Sms(cleanMobile, otp, keyToUse);
              console.log('✅ Real SMS dispatched via Fast2SMS:', res);
              return { success: true, method: 'FAST2SMS', delivered: true };
            } catch (smsErr) {
              console.warn('⚠️ Fast2SMS gateway delivery failed, falling back to console:', smsErr.message);
            }
          }
        }

        // 2. MSG91 (India DLT OTP)
        if (provider === 'MSG91') {
          try {
            const res = await this._sendMsg91(cleanMobile, otp, apiKey);
            console.log('✅ Real SMS dispatched via MSG91:', res);
            return { success: true, method: 'MSG91', delivered: true };
          } catch (smsErr) {
            console.warn('⚠️ MSG91 gateway delivery failed, falling back to console:', smsErr.message);
          }
        }

        // 3. Twilio (Global SMS)
        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
        if (provider === 'TWILIO' && twilioSid && twilioToken && twilioFrom) {
          try {
            const res = await this._sendTwilio(cleanMobile, message, twilioSid, twilioToken, twilioFrom);
            console.log('✅ Real SMS dispatched via Twilio:', res);
            return { success: true, method: 'TWILIO', delivered: true };
          } catch (smsErr) {
            console.warn('⚠️ Twilio gateway delivery failed, falling back to console:', smsErr.message);
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Error reading SMS config:', err.message);
    }

    // Default Fallback: No API Key entered / Dev Mode
    console.log(`ℹ️ SMS Gateway not configured or in Dev Mode: OTP ${otp} logged to console for test/demo.`);
    return {
      success: true,
      method: 'CONSOLE_DEV',
      isDemo: true,
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
    };
  }

  /**
   * Test SMS gateway with a sample test message
   */
  async sendTestSms(mobile) {
    const cleanMobile = String(mobile).replace(/[^0-9]/g, '').slice(-10);
    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const config = await systemStore.getConfig();

    const provider = (config.smsProvider || 'FAST2SMS').toUpperCase();
    const apiKey = config.smsApiKey || process.env.FAST2SMS_API_KEY;

    if (!apiKey || apiKey === 'sms_live_key_9182736450') {
      return {
        success: false,
        message: 'No active SMS API Key found. Please enter a valid Fast2SMS, MSG91, or Twilio key in settings.'
      };
    }

    if (provider === 'FAST2SMS') {
      const raw = await this._sendFast2Sms(cleanMobile, testOtp, apiKey);
      return { success: true, provider: 'FAST2SMS', rawResponse: raw, testOtp };
    } else if (provider === 'MSG91') {
      const raw = await this._sendMsg91(cleanMobile, testOtp, apiKey);
      return { success: true, provider: 'MSG91', rawResponse: raw, testOtp };
    } else if (provider === 'TWILIO') {
      const raw = await this._sendTwilio(
        cleanMobile,
        `BeAurex Test SMS: OTP ${testOtp}`,
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
        process.env.TWILIO_PHONE_NUMBER
      );
      return { success: true, provider: 'TWILIO', rawResponse: raw, testOtp };
    }

    return { success: false, message: `Unsupported provider: ${provider}` };
  }

  _sendFast2Sms(mobile, otp, apiKey) {
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
          'authorization': apiKey,
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
            reject(new Error(`Fast2SMS error ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  _sendMsg91(mobile, otp, authKey) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'control.msg91.com',
        path: `/api/v5/otp?template_id=default&mobile=91${mobile}&otp=${otp}`,
        method: 'POST',
        headers: {
          'authkey': authKey,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error(`MSG91 error ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.end();
    });
  }

  _sendTwilio(mobile, message, accountSid, authToken, fromNumber) {
    return new Promise((resolve, reject) => {
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
