import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import mongoose from "mongoose";

import { ContentModel, LinkModel, TagModel, UserModel } from "./db";
import { contentSchema, signupSchema } from "./zchema";
import { authMiddleware } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose
  .connect(process.env.MONGODB_URL ?? "mongodb://localhost:27017/second-brain")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

app.post("/api/v1/signup", async (req, res) => {
  try {

    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(401).json({
        message: "Invalid input",
        errors: result.error.errors,
      });
      return;
    }
    const { username, password } = result.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(403).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await argon2.hash(password);
    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.status(200).json({
      message: "User created successfully",
      userId: user._id,
    });
    return;
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(403).json({
        message: "User not found",
      });
      return;
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      res.status(403).json({
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
      access_token: token,
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

app.post("/api/v1/content", authMiddleware, async (req, res) => {
  const parseResult = contentSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      message: "Invalid input",
    });
    return;
  }
  const { link, title, type, tags } = parseResult.data;
  try {
    let tagIds: mongoose.Types.ObjectId[] = [];
    if (tags.length != 0) {
      tagIds = await Promise.all(
        tags.map(async (tagTitle) => {
          let tag = await TagModel.findOne({ title: tagTitle });

          if (!tag) {
            tag = await TagModel.create({ title: tagTitle });
          }

          return tag._id;
        })
      );
    }

    await ContentModel.create({
      link,
      title,
      type,
      userId: req.userId,
      tags: tagIds,
    });

    res.status(201).json({
      message: "Content created successfully",
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

app.get("/api/v1/content", authMiddleware, async (req, res) => {
  try {
    const content = await ContentModel.find({ userId: req.userId }).populate(
      "userId",
      "username"
    );
    res.status(200).json({
      message: "Content fetched successfully",
      content,
    });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(err);
    return;
  }
});

app.delete("/api/v1/content", authMiddleware, async (req, res) => {
  const { contentId } = req.body;
  try {
    const content = await ContentModel.findOneAndDelete({
      _id: contentId,
      userId: req.userId,
    });
    if (!content) {
      res.status(404).json({
        message: "Content not found or unauthorized",
      });
      return;
    }
    res.status(200).json({
      message: "Content deleted successfully",
    });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(err);
    return;
  }
});

app.post("/api/v1/brain/share", authMiddleware, async (req, res) => {
  try {
    const { share } = req.body;
    if (typeof share !== "boolean") {
      res.status(400).json({
        message: "Invalid input",
      });
      return;
    }
    if (!share) {
      const deleteLink = await LinkModel.deleteOne({
        userId: req.userId,
      });
      if (deleteLink.deletedCount === 0) {
        res.status(404).json({
          message: "There is no shareable link to delete",
        });
        return;
      }
      res.status(200).json({
        message: "Link deleted successfully",
      });
      return;
    } else {
      const existingLink = await LinkModel.findOne({ userId: req.userId });
      if (existingLink) {
        res.status(400).json({
          message: "Link already exists",
          link: `${process.env.BASE_URL || "http://localhost:3000"}/brain/${
            existingLink.hash
          }`,
        });
        return;
      }
      const hash = crypto.randomUUID();
      const link = await LinkModel.create({
        hash,
        userId: req.userId,
      });

      res.status(200).json({
        message: "Link created successfully",
        link: `${process.env.BASE_URL || "http://localhost:3000"}api/v1/brain/${
          link.hash
        }`,
      });

      return;
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(err);
    return;
  }
});

app.get("/api/v1/brain/:shareLink", authMiddleware, async (req, res) => {
  const { shareLink } = req.params;
  try {
    const link = await LinkModel.findOne({ hash: shareLink });
    if (!link) {
      res.status(404).json({
        message: "Link not found",
      });
      return;
    }
    const content = await ContentModel.find({ userId: link.userId }).populate(
      "userId",
      "username"
    );
    res.status(200).json({
      message: "Content fetched successfully",
      content,
    });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(err);
    return;
  }
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
