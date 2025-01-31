import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface JwtPayload {
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};

export const checkAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { role } = req.user || {};

  if (role !== "admin") {
    res.status(403).json({ message: "Forbidden. Admin access required." });
    return;
  }

  next();
};
