import { Request, Response } from "express";
import User from "../models/userModel";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, mobileNumber, address, password, role } =
    req.body;
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      mobileNumber,
      address,
      password,
      role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
};
