// BeAurex Transactional Email & SMTP Service
// Supports Dynamic Config from Super Admin (Gmail SMTP, Custom SMTP, Resend)
// Graceful Fallback: When no credentials are configured, logs to console without throwing errors.

const nodemailer = require('nodemailer');
const systemStore = require('./systemStore');

class EmailService {
  /**
   * Send transactional email
   * @param {string} to Recipient email
   * @param {string} subject Email subject
   * @param {string} html HTML body
   * @param {string} text Plain text body
   */
  async sendEmail({ to, subject, html, text }) {
    console.log('\n======================================================');
    console.log(`📧 [EMAIL SERVICE DISPATCH]`);
    console.log(`   Recipient: ${to}`);
    console.log(`   Subject  : ${subject}`);
    console.log('======================================================\n');

    try {
      const config = await systemStore.getConfig();
      const isConfigured = systemStore.isSmtpConfigured(config);

      if (isConfigured) {
        const host = config.smtpHost || process.env.SMTP_HOST;
        const port = Number(config.smtpPort || process.env.SMTP_PORT || 587);
        const user = config.smtpUser || process.env.SMTP_USER;
        const pass = config.smtpPass || process.env.SMTP_PASS;
        const secure = Boolean(config.smtpSecure || port === 465);
        const from = config.smtpFrom || config.emailSenderAddress || '"BeAurex Loyalty" <notifications@beaurex.com>';

        if (host && user && pass) {
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
            tls: { rejectUnauthorized: false }
          });

          const info = await transporter.sendMail({
            from,
            to,
            subject,
            text: text || subject,
            html: html || `<p>${subject}</p>`
          });

          console.log('✅ Real Email sent via SMTP:', info.messageId);
          return { success: true, method: 'SMTP', messageId: info.messageId };
        }
      }
    } catch (err) {
      console.warn('⚠️ SMTP Email delivery failed, falling back to console:', err.message);
    }

    // Default Fallback: No SMTP entered / Dev Mode
    console.log(`ℹ️ SMTP not configured or in Dev Mode: Email to ${to} logged to console for test/demo.`);
    return {
      success: true,
      method: 'CONSOLE_DEV',
      isDemo: true
    };
  }

  /**
   * Generate 6-digit numeric OTP code
   */
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send Email OTP with stylish responsive HTML template
   */
  async sendOtpEmail(toEmail, otp, purpose = 'login') {
    const subject = `Your BeAurex OTP Code: ${otp}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #8B0000; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">BeAurex Loyalty</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Customer & Merchant Verification Hub</p>
        </div>
        <p style="font-size: 15px; color: #1e293b; margin-bottom: 12px;">Hello,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
          Use the 6-digit One-Time Password (OTP) below to complete your ${purpose} to your BeAurex account:
        </p>
        <div style="text-align: center; margin: 28px 0; background: #fdf2f2; border: 2px dashed #f87171; border-radius: 12px; padding: 20px;">
          <span style="font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #8B0000; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 24px;">
          ⏱️ This code is valid for <strong>5 minutes</strong>. Do not share this OTP with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
          If you did not request this OTP, please ignore this email or contact support@beaurex.com.
        </p>
      </div>
    `;
    const text = `Your BeAurex ${purpose} code is: ${otp}. Valid for 5 minutes. Do not share this OTP.`;
    return this.sendEmail({ to: toEmail, subject, html, text });
  }

  /**
   * Send test email to verify credentials from Super Admin
   */
  async sendTestEmail(toEmail) {
    const config = await systemStore.getConfig();
    const host = config.smtpHost || process.env.SMTP_HOST;
    const port = Number(config.smtpPort || process.env.SMTP_PORT || 587);
    const user = config.smtpUser || process.env.SMTP_USER;
    const pass = config.smtpPass || process.env.SMTP_PASS;
    const secure = Boolean(config.smtpSecure || port === 465);
    const from = config.smtpFrom || config.emailSenderAddress || '"BeAurex Loyalty" <notifications@beaurex.com>';

    if (!host || !user || !pass) {
      return {
        success: false,
        message: 'Incomplete SMTP credentials. Please enter SMTP Host, User (Email), and Password.'
      };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    // Verify connection first
    await transporter.verify();

    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: '✅ BeAurex SMTP Connection Test Successful',
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 16px;">
          <h2 style="color: #74111d; margin-top: 0;">BeAurex Platform Notification</h2>
          <p>Your SMTP mail server configuration is <strong>active and working perfectly</strong>!</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 13px;">
            <p><strong>Host:</strong> ${host}:${port}</p>
            <p><strong>Sender:</strong> ${from}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 24px;">This is an automated test message from the BeAurex Super Admin panel.</p>
        </div>
      `
    });

    return {
      success: true,
      messageId: info.messageId,
      message: `Test email successfully sent to ${toEmail} via ${host}!`
    };
  }
}

module.exports = new EmailService();
