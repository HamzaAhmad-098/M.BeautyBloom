import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Get base URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://www.mbeautybloom.shop';
const STORE_NAME = 'M Beauty Bloom';

// ==================
// EMAIL TEMPLATES
// ==================
const templates = {
  emailVerification: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ec4899, #db2777); padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .button { 
          display: inline-block; 
          padding: 14px 35px; 
          background: #ec4899; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover { background: #db2777; }
        .link-box { 
          background: #f3f4f6; 
          padding: 15px; 
          border-radius: 5px; 
          margin: 20px 0;
          word-break: break-all;
          font-size: 13px;
          color: #6b7280;
        }
        .footer { 
          padding: 20px; 
          text-align: center; 
          background: #f9f9f9; 
          color: #666; 
          font-size: 12px; 
          border-top: 1px solid #e5e7eb;
        }
        .warning { 
          background: #fef3c7; 
          border-left: 4px solid #f59e0b; 
          padding: 12px; 
          margin: 15px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ ${STORE_NAME}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        <div class="content">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${data.name}! 👋</h2>
          <p style="color: #4b5563; font-size: 16px;">
            Thank you for registering with ${STORE_NAME}! We're excited to have you join our beauty community.
          </p>
          <p style="color: #4b5563; font-size: 16px;">
            Please verify your email address to complete your registration and start shopping for premium cosmetics.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <div class="link-box">${data.verificationUrl}</div>
          <div class="warning">
            <strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons.
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 25px;">
            If you didn't create an account with ${STORE_NAME}, please ignore this email.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">
            <strong>${STORE_NAME}</strong>
          </p>
          <p style="margin: 5px 0;">Premium Cosmetics & Beauty Products</p>
          <p style="margin: 5px 0;">Urdu Bazaar Kasur, Pakistan 🇵🇰</p>
          <p style="margin: 15px 0 5px 0; color: #9ca3af;">
            © ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
          </p>
          <p style="margin: 5px 0;">
            <a href="${FRONTEND_URL}" style="color: #ec4899; text-decoration: none;">Visit Our Store</a> | 
            <a href="${FRONTEND_URL}/contact" style="color: #ec4899; text-decoration: none;">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .button { 
          display: inline-block; 
          padding: 14px 35px; 
          background: #3b82f6; 
          color: white !important; 
          text-decoration: none; 
          border-radius: 5px; 
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover { background: #1d4ed8; }
        .link-box { 
          background: #f3f4f6; 
          padding: 15px; 
          border-radius: 5px; 
          margin: 20px 0;
          word-break: break-all;
          font-size: 13px;
          color: #6b7280;
        }
        .warning { 
          background: #fee2e2; 
          border-left: 4px solid #ef4444; 
          padding: 12px; 
          margin: 20px 0;
          border-radius: 4px;
          color: #991b1b;
        }
        .info { 
          background: #dbeafe; 
          border-left: 4px solid #3b82f6; 
          padding: 12px; 
          margin: 20px 0;
          border-radius: 4px;
          color: #1e40af;
        }
        .footer { 
          padding: 20px; 
          text-align: center; 
          background: #f9f9f9; 
          color: #666; 
          font-size: 12px; 
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 ${STORE_NAME}</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        <div class="content">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${data.name},</h2>
          <p style="color: #4b5563; font-size: 16px;">
            We received a request to reset the password for your ${STORE_NAME} account.
          </p>
          <p style="color: #4b5563; font-size: 16px;">
            Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" class="button">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Or copy and paste this link into your browser:
          </p>
          <div class="link-box">${data.resetUrl}</div>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> This password reset link will expire in 10 minutes for your security.
          </div>
          <div class="info">
            <strong>💡 Didn't request this?</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </div>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;"><strong>${STORE_NAME}</strong></p>
          <p style="margin: 5px 0;">Premium Cosmetics & Beauty Products</p>
          <p style="margin: 15px 0 5px 0; color: #9ca3af;">
            © ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
          </p>
          <p style="margin: 5px 0;">
            <a href="${FRONTEND_URL}/contact" style="color: #3b82f6; text-decoration: none;">Need Help?</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcome: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { 
          background: linear-gradient(135deg, #10b981, #059669); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { margin: 0; font-size: 32px; }
        .content { padding: 30px; }
        .button { 
          display: inline-block;
          background: #10b981; 
          color: white !important; 
          padding: 14px 35px; 
          text-decoration: none; 
          border-radius: 5px;
          font-weight: bold;
        }
        .button:hover { background: #059669; }
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 25px 0;
        }
        .feature {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .footer { 
          padding: 20px; 
          text-align: center; 
          background: #f9f9f9; 
          color: #666; 
          font-size: 12px; 
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome ${data.name}!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.95;">
            Your email has been verified successfully
          </p>
        </div>
        <div class="content">
          <p style="color: #4b5563; font-size: 16px;">
            Welcome to ${STORE_NAME}! We're thrilled to have you as part of our beauty community.
          </p>
          <p style="color: #4b5563; font-size: 16px;">
            You now have full access to our premium cosmetics collection and exclusive offers.
          </p>
          
          <div class="features">
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">🛍️</div>
              <strong>Shop Premium Products</strong>
            </div>
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">🎁</div>
              <strong>Exclusive Deals</strong>
            </div>
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">🚚</div>
              <strong>Fast Delivery</strong>
            </div>
            <div class="feature">
              <div style="font-size: 24px; margin-bottom: 8px;">💝</div>
              <strong>Loyalty Rewards</strong>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/shop" class="button">Start Shopping Now</a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 25px;">
            Need help? Our customer support team is here for you!
          </p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;"><strong>${STORE_NAME}</strong></p>
          <p style="margin: 5px 0;">Premium Cosmetics & Beauty Products</p>
          <p style="margin: 15px 0 5px 0; color: #9ca3af;">
            © ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
          </p>
          <p style="margin: 5px 0;">
            <a href="${FRONTEND_URL}/shop" style="color: #10b981; text-decoration: none;">Shop</a> | 
            <a href="${FRONTEND_URL}/contact" style="color: #10b981; text-decoration: none;">Support</a> | 
            <a href="${FRONTEND_URL}/profile" style="color: #10b981; text-decoration: none;">My Account</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderConfirmation: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { 
          background: linear-gradient(135deg, #7c3aed, #6d28d9); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { margin: 0; font-size: 32px; }
        .content { padding: 30px; }
        .order-info {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .order-info p {
          margin: 10px 0;
          color: #374151;
        }
        .order-id {
          font-size: 24px;
          color: #7c3aed;
          font-weight: bold;
          text-align: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background: #7c3aed;
          color: white !important;
          padding: 14px 35px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .button:hover { background: #6d28d9; }
        .footer { 
          padding: 20px; 
          text-align: center; 
          background: #f9f9f9; 
          color: #666; 
          font-size: 12px; 
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.95;">
            Thank you for your purchase
          </p>
        </div>
        <div class="content">
          <p style="color: #4b5563; font-size: 16px;">
            Hi <strong>${data.name}</strong>,
          </p>
          <p style="color: #4b5563; font-size: 16px;">
            Your order has been received and is being processed. We'll send you another email when your order ships!
          </p>
          
          <div class="order-id">
            Order #${data.orderId}
          </div>

          <div class="order-info">
            <p><strong>📦 Order Total:</strong> Rs. ${data.total.toLocaleString()}</p>
            <p><strong>💳 Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>📍 Shipping Address:</strong></p>
            <p style="padding-left: 20px; color: #6b7280;">${data.shippingAddress}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/orders/${data.orderId}" class="button">Track Your Order</a>
          </div>

          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            Questions about your order? <a href="${FRONTEND_URL}/contact" style="color: #7c3aed;">Contact our support team</a>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;"><strong>${STORE_NAME}</strong></p>
          <p style="margin: 5px 0;">Premium Cosmetics & Beauty Products</p>
          <p style="margin: 15px 0 5px 0; color: #9ca3af;">
            © ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.
          </p>
          <p style="margin: 5px 0;">
            <a href="${FRONTEND_URL}/orders" style="color: #7c3aed; text-decoration: none;">My Orders</a> | 
            <a href="${FRONTEND_URL}/contact" style="color: #7c3aed; text-decoration: none;">Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `,

  orderShipped: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { 
          background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .content { padding: 30px; }
        .tracking-box {
          background: #dbeafe;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .tracking-number {
          font-size: 20px;
          font-weight: bold;
          color: #1e40af;
          margin: 10px 0;
        }
        .button {
          display: inline-block;
          background: #3b82f6;
          color: white !important;
          padding: 14px 35px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer { 
          padding: 20px; 
          text-align: center; 
          background: #f9f9f9; 
          color: #666; 
          font-size: 12px; 
          border-top: 1px solid #e5e7eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Your Order is On Its Way!</h1>
        </div>
        <div class="content">
          <p style="color: #4b5563; font-size: 16px;">
            Hi <strong>${data.name}</strong>,
          </p>
          <p style="color: #4b5563; font-size: 16px;">
            Great news! Your order <strong>#${data.orderId}</strong> has been shipped and is on its way to you.
          </p>
          
          ${data.trackingNumber ? `
          <div class="tracking-box">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">Tracking Number</p>
            <div class="tracking-number">${data.trackingNumber}</div>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/track-order/${data.orderId}" class="button">Track Your Package</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>${STORE_NAME}</strong></p>
          <p>© ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// ==================
// SEND SINGLE EMAIL
// ==================
const sendEmail = async (options) => {
  try {
    console.log("📧 Attempting to send email...");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("Template:", options.template);

    const html = templates[options.template]
      ? templates[options.template](options.data)
      : options.message;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || `${STORE_NAME} <noreply@mbeautybloom.shop>`,
      to: options.email,
      subject: options.subject,
      html,
      attachments: options.attachments || [],
    });

    console.log("✅ Email sent successfully!");
    console.log("Email ID:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Error:", error.message);
    console.error("Full error:", error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

// ==================
// SEND BULK EMAIL
// ==================
const sendBulkEmail = async (emails, options) => {
  try {
    console.log(`📧 Attempting to send bulk email to ${emails.length} recipients...`);

    const html = templates[options.template](options.data);

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || `${STORE_NAME} <noreply@mbeautybloom.shop>`,
      bcc: emails,
      subject: options.subject,
      html,
    });

    console.log(`✅ Bulk email sent successfully to ${emails.length} users`);
    console.log("Email ID:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Bulk email sending failed:");
    console.error("Error:", error.message);
    throw new Error(`Bulk email could not be sent: ${error.message}`);
  }
};

// ==================
// TEST EMAIL FUNCTION
// ==================
const sendTestEmail = async (toEmail) => {
  try {
    return await sendEmail({
      email: toEmail,
      subject: '🎉 Test Email from M Beauty Bloom',
      template: 'welcome',
      data: {
        name: 'Test User',
      }
    });
  } catch (error) {
    console.error("Test email failed:", error);
    throw error;
  }
};

export default sendEmail;
export { sendBulkEmail, templates, sendTestEmail };