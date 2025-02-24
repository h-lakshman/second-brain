import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT secret not configured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
