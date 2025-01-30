import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).send("Access denied");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).send("Forbidden");
      }
      next();
    } catch (err) {
      res.status(400).send("Invalid token");
    }
  };
};

export default authenticate;
