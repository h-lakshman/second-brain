import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import mongoose from "mongoose";
import * as crypto from "node:crypto";
import {
  GoogleGenerativeAI,
  GenerateContentResult,
} from "@google/generative-ai";

import {
  ContentModel,
  LinkModel,
  TagModel,
  UserModel,
  ChatSessionModel,
} from "./db";
import { contentSchema, signupSchema, chatMessageSchema } from "./zchema";
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

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    const content = await ContentModel.find({ userId: req.userId })
      .populate("userId", "username")
      .populate("tags", "title");
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
    const hash = crypto.randomBytes(8).toString("hex");
    await LinkModel.create({ hash, userId: req.userId });
    res.status(201).json({
      hash,
      message: "Link created successfully",
    });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
});

const shareLinkMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { shareLink } = req.params;
  try {
    const link = await LinkModel.findOne({ hash: shareLink });
    if (!link) {
      res.status(404).json({ message: "Share link not found" });
      return;
    }
    // @ts-ignore
    req.userId = link.userId.toString();
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

app.get(
  "/api/v1/brain/:shareLink",
  shareLinkMiddleware,
  async (req: Request, res) => {
    try {
      // @ts-ignore
      const content = await ContentModel.find({ userId: req.userId })
        .populate("userId", "username")
        .populate("tags", "title");

      res.status(200).json({
        message: "Content fetched successfully",
        content,
      });
    } catch (err) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// Chat endpoints
app.post("/api/v1/chat/session", authMiddleware, async (req, res) => {
  try {
    const session = await ChatSessionModel.create({
      userId: req.userId,
      messages: [],
    });

    res.status(200).json({
      sessionId: session._id,
      message: "Chat session created successfully",
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({
      message: "Failed to create chat session",
    });
  }
});

app.post("/api/v1/chat", authMiddleware, async (req, res) => {
  try {
    const result = chatMessageSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Invalid input",
        errors: result.error.errors,
      });
      return;
    }

    const { content, sessionId } = result.data;

    // Verify session belongs to user
    const session = await ChatSessionModel.findOne({
      _id: sessionId,
      userId: req.userId,
    });

    if (!session) {
      res.status(404).json({
        message: "Chat session not found",
      });
      return;
    }

    // Get user's content for context with full details
    const userContent = await ContentModel.find({ userId: req.userId })
      .select("title type tags")
      .populate("tags", "title")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const contextPrompt = `You are a friendly AI assistant named Brain. Engage in natural conversation with the user.

    Personality traits:
    - Friendly and casual in tone
    - Responds appropriately to the conversation context
    - Engages in normal back-and-forth dialogue
    - Uses saved content context when relevant to the conversation

    User's saved content context:
    ${userContent
      .map(
        (c, i) => `
    ${i + 1}. Title: ${c.title}
       Type: ${c.type}
       Tags: ${c.tags.map((tag: any) => tag.title).join(", ")}
    `
      )
      .join("\n")}

    Use the above content context to enrich the conversation naturally. Do not wait for specific questions about the content. Instead, weave in relevant information when it fits the flow of the conversation.

    Previous conversation context:
    ${session.messages
      .slice(-5)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n")}
    
    Current user message: ${content}
    Respond naturally as a conversational AI, using the content context to enhance the dialogue.`;

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Send message with timeout
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 30000)
    );

    try {
      const result = (await Promise.race([
        model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: contextPrompt }],
            },
          ],
        }),
        timeout,
      ])) as GenerateContentResult;

      const text = result.response.text();

      // Save messages to session
      const userMessage = {
        content,
        role: "user",
        timestamp: new Date(),
      };

      const assistantMessage = {
        content: text,
        role: "assistant",
        timestamp: new Date(),
      };

      session.messages.push(userMessage, assistantMessage);
      session.lastActivity = new Date();
      await session.save();

      res.status(200).json({
        messages: [
          {
            _id: session.messages[session.messages.length - 2]._id,
            ...userMessage,
          },
          {
            _id: session.messages[session.messages.length - 1]._id,
            ...assistantMessage,
          },
        ],
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        message: "Failed to generate response",
        error: error?.message || "Unknown error",
      });
    }
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({
      message: "Failed to process chat message",
      error: error?.message || "Unknown error",
    });
  }
});

app.get("/api/v1/chat/:sessionId", authMiddleware, async (req, res) => {
  try {
    const session = await ChatSessionModel.findOne({
      _id: req.params.sessionId,
      userId: req.userId,
    });

    if (!session) {
      res.status(404).json({
        message: "Chat session not found",
      });
      return;
    }

    res.status(200).json({
      messages: session.messages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({
      message: "Failed to fetch chat messages",
    });
  }
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
