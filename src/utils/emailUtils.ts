import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import { generateOtp } from "./otpUtils";

const transporter: Transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // true for SSL, false for TLS
  auth: {
    user: "support-taskflow@jayashan.website",
    pass: "XjmPB6a1RCEB",
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
    from: "support-taskflow@jayashan.website",
    to: recipientEmail,
    subject: "Your OTP for TaskFlow",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: white; border-radius: 8px; padding: 20px; text-align: center;">
          <h2 style="color: #007bff;">Welcome to TaskFlow!</h2>
          <p style="color: #333;">Thank you for signing up. Please verify your email using the OTP below:</p>
          <p style="font-size: 24px; color: #333; font-weight: bold;">${otp}</p>
          <p style="color: #333;">Or click the link to verify:</p>
          <a href="${otpLink}" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verify Email</a>
          <p style="color: #333; font-size: 12px;">This OTP will expire in 10 minutes.</p>
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
