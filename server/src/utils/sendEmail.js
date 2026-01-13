import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Cosmetics Store <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (order, userEmail) => {
  const itemsList = order.orderItems
    .map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price}</td>
      </tr>
    `)
    .join('');

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .order-details { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        .total { font-weight: bold; font-size: 18px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="order-details">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          
          <h3>Shipping Address:</h3>
          <p>${order.shippingAddress.name}<br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}</p>
          
          <h3>Order Items:</h3>
          <table>
            <thead>
              <tr>
                <th style="text-align: left; padding: 10px; border-bottom: 2px solid #333;">Product</th>
                <th style="text-align: center; padding: 10px; border-bottom: 2px solid #333;">Qty</th>
                <th style="text-align: right; padding: 10px; border-bottom: 2px solid #333;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <p>Subtotal: Rs. ${order.itemsPrice}</p>
            <p>Shipping: Rs. ${order.shippingPrice}</p>
            <p>Tax: Rs. ${order.taxPrice}</p>
            <p class="total">Total: Rs. ${order.totalPrice}</p>
          </div>
        </div>
        
        <div class="footer">
          <p>You can track your order using the following link:</p>
          <p><a href="${process.env.FRONTEND_URL}/order/${order._id}">View Order Details</a></p>
          <p>If you have any questions, please contact our customer support.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: userEmail,
    subject: `Order Confirmation - #${order._id}`,
    message,
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #007bff; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 20px 0; 
        }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </div>
        
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        
        <div class="footer">
          <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
          <p>${resetUrl}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    message,
  });
};

export default sendEmail;