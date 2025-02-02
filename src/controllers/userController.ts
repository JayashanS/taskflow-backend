import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { sendOtpEmail } from "../utils/emailUtils";
import { generateOtp } from "../utils/otpUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, mobileNumber, address, password } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await User.countDocuments();
    const user = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      password: hashedPassword,
      role: userCount === 0 ? "admin" : "user",
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const existingUser: IUser | null = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({ message: "User not found." });
    }

    const otp = generateOtp(6);
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiration = otpExpiration;
      existingUser.isEnabled = false;

      await existingUser.save();
    }

    const response = await sendOtpEmail(email, otp);
    console.log("OTP email sent:", response);

    res.status(200).json({
      message:
        "Invitation sent successfully. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error("Error inviting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: "All users have been deleted." });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;
  try {
    const existingUser: IUser | null = await User.findOne({ email });

    if (existingUser) {
      if (
        !existingUser.otpExpiration ||
        existingUser.otp !== otp ||
        existingUser.otpExpiration < new Date()
      ) {
        res.status(400).json({ message: "Invalid or expired OTP." });
      }

      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.otp = null;
      existingUser.otpExpiration = null;
      await existingUser.save();

      res.status(200).json({ message: "Password reset successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
      }

      const expiresIn = "1h";

      const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn,
        }
      );

      res.json({ token });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsersWithPagination = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit);

    const totalRecords = await User.countDocuments();

    res.status(200).json({
      users,
      totalRecords,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMultipleUsers = async (req: Request, res: Response) => {
  const users = req.body;

  try {
    const userCount = await User.countDocuments();

    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user: any, index: any) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword,
          role: userCount + index === 0 ? "admin" : "user",
        };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    res.status(201).json(createdUsers);
  } catch (error) {
    res.status(400).json({ error: "Error creating users" });
  }
};
