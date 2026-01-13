import nodemailer from 'nodemailer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

// Email templates
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
          <p>Click the button below to verify your email:</p>
          <div style="text-align: center;">
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${data.verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
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
        .footer { padding: 20px; text-align: center; background: #f9f9f9; color: #666; font-size: 12px; }
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
          <p>You recently requested to reset your password for your Cosmetics Store account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${data.resetUrl}" class="button">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${data.resetUrl}</p>
          <div class="warning">
            <p><strong>Important:</strong> This password reset link will expire in 10 minutes.</p>
          </div>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetics Store. All rights reserved.</p>
          <p>Karachi, Pakistan</p>
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
        body { font-family: Arial, sans-serif; line-height: 1.6; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; background: #f9f9f9; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Cosmetics Store</h1>
          <p>Welcome Aboard!</p>
        </div>
        <div class="content">
          <h2>Welcome ${data.name}!</h2>
          <p>Thank you for verifying your email and joining Cosmetics Store!</p>
          <p>We're excited to have you as part of our beauty community. Here's what you can do:</p>
          <ul>
            <li>Browse our premium collection of cosmetics</li>
            <li>Save items to your wishlist</li>
            <li>Enjoy exclusive member discounts</li>
            <li>Track your orders easily</li>
          </ul>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/shop" class="button">Start Shopping</a>
          </div>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetics Store. All rights reserved.</p>
          <p>Karachi, Pakistan</p>
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
        body { font-family: Arial, sans-serif; line-height: 1.6; background: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; }
        .order-details { background: #f8fafc; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; background: #f9f9f9; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Cosmetics Store</h1>
          <p>Order Confirmation</p>
        </div>
        <div class="content">
          <h2>Thank you for your order, ${data.name}!</h2>
          <p>Your order <strong>#${data.orderId}</strong> has been received and is being processed.</p>
          <div class="order-details">
            <p><strong>Order Total:</strong> Rs. ${data.total}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>Shipping Address:</strong> ${data.shippingAddress}</p>
          </div>
          <p>You can track your order in your account dashboard.</p>
          <p>If you have any questions, contact our support team.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetics Store. All rights reserved.</p>
          <p>Karachi, Pakistan</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email service (e.g., SendGrid, Mailgun, etc.)
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development - Mailtrap or similar
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: process.env.EMAIL_PORT || 2525,
      auth: {
        user: process.env.EMAIL_USER || 'your_mailtrap_user',
        pass: process.env.EMAIL_PASS || 'your_mailtrap_pass',
      },
    });
  }
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    // Get email template
    let html;
    if (templates[options.template]) {
      html = templates[options.template](options.data);
    } else {
      html = options.message;
    }

    const mailOptions = {
      from: `"Cosmetics Store" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html,
    };

    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Send batch emails
const sendBulkEmail = async (emails, options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Cosmetics Store" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      bcc: emails, // BCC to protect recipient privacy
      subject: options.subject,
      html: templates[options.template](options.data),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`📧 Bulk email sent to ${emails.length} recipients: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Bulk email sending failed:', error);
    throw new Error('Bulk email could not be sent');
  }
};

export default sendEmail;
export { sendBulkEmail, templates };