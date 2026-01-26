import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ec4899, #db2777); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #ec4899; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; background: #f9f9f9; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Cosmetics Store</h1>
          <p>Email Verification</p>
        </div>
        <div class="content">
          <h2>Hello ${data.name},</h2>
          <p>Thank you for registering with Cosmetics Store! Please verify your email address to complete your registration.</p>
          <div style="text-align: center;">
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${data.verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetics Store. All rights reserved.</p>
          <p>Karachi, Pakistan</p>
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
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Cosmetics Store</h1>
          <p>Password Reset</p>
        </div>
        <div class="content">
          <h2>Hello ${data.name},</h2>
          <p>You requested a password reset.</p>
          <div style="text-align: center;">
            <a href="${data.resetUrl}" class="button">Reset Password</a>
          </div>
          <p>${data.resetUrl}</p>
          <div class="warning">
            <strong>This link expires in 10 minutes.</strong>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetics Store.</p>
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
        .container { max-width: 600px; margin: auto; background: white; border-radius: 10px; }
        .header { background: #10b981; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome ${data.name}!</h1>
        </div>
        <div class="content">
          <p>Your email has been verified successfully 🎉</p>
          <a href="${process.env.FRONTEND_URL}/shop" class="button">Start Shopping</a>
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
        .container { max-width: 600px; margin: auto; background: white; border-radius: 10px; }
        .header { background: #7c3aed; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed</h1>
        </div>
        <div class="content">
          <p>Hi ${data.name},</p>
          <p>Your order <strong>#${data.orderId}</strong> has been received.</p>
          <p><strong>Total:</strong> Rs. ${data.total}</p>
          <p><strong>Payment:</strong> ${data.paymentMethod}</p>
          <p><strong>Shipping:</strong> ${data.shippingAddress}</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// ==================
// SEND SINGLE EMAIL
// ==================
const sendEmail = async (options) => {
  try {
    console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

    const html = templates[options.template]
      ? templates[options.template](options.data)
      : options.message;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      html,
      attachments: options.attachments || [],
    });

    console.log("📧 Email sent:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

// ==================
// SEND BULK EMAIL
// ==================
const sendBulkEmail = async (emails, options) => {
  try {
    const html = templates[options.template](options.data);

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      bcc: emails,
      subject: options.subject,
      html,
    });

    console.log(`📧 Bulk email sent to ${emails.length} users`);
    return response;
  } catch (error) {
    console.error("❌ Bulk email sending failed:", error);
    throw new Error("Bulk email could not be sent");
  }
};

export default sendEmail;
export { sendBulkEmail, templates };
