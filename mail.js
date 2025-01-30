const nodemailer = require("nodemailer");

// Create a transporter using Zoho SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465, // 465 for SSL or 587 for TLS
  secure: true, // true for SSL, false for TLS
  auth: {
    user: "support-taskflow@jayashan.website", // The Zoho email you want to send from
    pass: "XjmPB6a1RCEB", // The password or app password you set for this email
  },
});

// Set up email data with an HTML body
const mailOptions = {
  from: "support-taskflow@jayashan.website", // Sender address
  to: "jayashan2018130@gmail.com", // List of recipients
  subject: "Welcome to TaskFlow!", // Subject line
  // HTML body content (this can include styling, images, etc.)
  html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: white; border-radius: 8px; padding: 20px; text-align: center;">
          <h2 style="color: #007bff;">Welcome to TaskFlow!</h2>
          <p style="color: #333;">Thank you for signing up with TaskFlow. We're excited to have you on board!</p>
          <p style="color: #333;">Click the button below to get started:</p>
          <a href="https://taskflow.com" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Get Started</a>
        </div>
      </body>
    </html>
  `,
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
