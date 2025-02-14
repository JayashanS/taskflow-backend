import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import { sendOtpEmail } from "../utils/emailUtils";
import { generateOtp } from "../utils/otpUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createFirstUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, mobileNumber, address, password, role } =
    req.body;

  try {
    const userCount = await User.countDocuments();

    if (userCount > 0) {
      res.status(400).json({ error: "First user already created." });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      password: hashedPassword,
      role: "admin",
    });

    await user.save();
    res
      .status(201)
      .json({ message: "First admin user created successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : "error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, mobileNumber, address, password, role } =
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
      role: role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : "error" });
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
      existingUser.isEnabled = true;

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

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp, password } = req.body;

  try {
    const existingUser: IUser | null = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (
      !existingUser.otpExpiration ||
      existingUser.otp !== otp ||
      existingUser.otpExpiration < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired OTP." });
      return;
    }

    existingUser.password = await bcrypt.hash(password, 10);
    existingUser.otp = null;
    existingUser.otpExpiration = null;
    await existingUser.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Invalid email or password" });
      } else {
        const expiresIn = "1d";
        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn }
        );

        res.json({ token, expiresIn });
      }
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

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .select("-password")
      .sort({ _id: -1 });

    const modifiedUsers = users.map((user) => {
      const userObj = user.toObject();
      userObj.password = "Password restricted";
      return userObj;
    });

    const totalRecords = await User.countDocuments();

    res.status(200).json({
      users: modifiedUsers,
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

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, mobileNumber, address, role } = req.body;

  try {
    const user = await User.findById(id);

    if (user) {
      user.firstName = firstName ?? user.firstName;
      user.lastName = lastName ?? user.lastName;
      user.email = email ?? user.email;
      user.mobileNumber = mobileNumber ?? user.mobileNumber;
      user.address = address ?? user.address;
      user.role = role ?? user.role;

      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUserIds = async (req: Request, res: Response) => {
  try {
    const userIds = await User.find({}, { _id: 1 });
    const ids = userIds.map((user) => user._id);

    res.status(200).json(ids);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUsersByFilter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm || typeof searchTerm !== "string") {
      const users = await User.find().sort({ _id: -1 });
      res.status(200).json(users);
    } else {
      const filter = {
        $or: [
          { firstName: { $regex: new RegExp(searchTerm, "i") } },
          { lastName: { $regex: new RegExp(searchTerm, "i") } },
          { email: { $regex: new RegExp(searchTerm, "i") } },
        ],
      };

      const users = await User.find(filter).sort({ _id: -1 });

      if (users.length === 0) {
        res
          .status(404)
          .json({ message: "No users found matching the search term." });
        return;
      }

      res.status(200).json(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleIsEnabled = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.isEnabled = !user.isEnabled;
    await user.save();

    res.status(200).json({
      message: `User ${user.isEnabled ? "enabled" : "disabled"} successfully`,
      isEnabled: user.isEnabled,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    let filter = {};
    if (query && typeof query === "string") {
      filter = {
        $or: [
          { firstName: { $regex: new RegExp(query, "i") } },
          { lastName: { $regex: new RegExp(query, "i") } },
          { email: { $regex: new RegExp(query, "i") } },
        ],
      };
    }

    const users = await User.find(filter)
      .limit(10)
      .select("_id firstName lastName email")
      .sort({ _id: -1 });

    if (users.length === 0) {
      res
        .status(404)
        .json({ message: "No users found matching the search query." });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsersIDs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find(
      {},
      { firstName: 1, lastName: 1, _id: 1 }
    ).lean();

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found." });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email is already taken" });
    } else {
      res.status(200).json({ message: "Email is available" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
