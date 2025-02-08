import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpEmail = async (
  recipientEmail: string,
  otp: string
): Promise<string> => {
  const otpLink = `http://localhost:4000/welcome/verify?email=${encodeURIComponent(
    recipientEmail
  )}&otp=${otp}`;
  const mailOptions: SendMailOptions = {
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: "Your OTP for TaskFlow",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">

        <h2 style="color: #9003fc;">Welcome to TaskFlow!</h2>
        <p style="color: #333;">Thank you for signing up. Please verify your email by clicking the link below:</p>

        <p style="color: #333; font-size: 12px; margin-top: 20px;">This OTP will expire in 10 minutes.</p>
      
        <a href="${otpLink}" style="display: inline-block; background-color: #9003fc; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Verify Email</a>
     
        </div>
      </body>
    </html>
  `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.log("Error:", error);
    throw new Error("Error sending OTP email");
  }
};
