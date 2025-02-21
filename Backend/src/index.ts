import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

import { UserModel } from "./db";
import { signupSchema } from "./zchema";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Invalid input",
        errors: result.error.errors,
      });
      return;
    }
    const { username, password } = result.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
    return;
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "Invalid password",
      });
      return;
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );
    res.status(200).json({
      message: "Login successful",
      acess_token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error);
    return;
  }
});

app.post("/api/v1/content", (req, res) => {});

app.get("/api/v1/content", (req, res) => {});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
