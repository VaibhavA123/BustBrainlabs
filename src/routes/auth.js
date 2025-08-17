import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signUserJwt } from "../utils/jwt.js";
import axios from "axios";
import session from "express-session";
import crypto from "crypto";

const router = Router();

router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash });
  res.json({ token: signUserJwt(user._id.toString()) });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: signUserJwt(u._id.toString()) });
});

// Airtable OAuth start
router.get("/airtable/start", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex"); // generate CSRF protection
  req.session.oauthState = state;

  const authUrl = `https://airtable.com/oauth2/v1/authorize?client_id=${
    process.env.AIRTABLE_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.AIRTABLE_REDIRECT_URI
  )}&response_type=code&scope=${encodeURIComponent(
    process.env.AIRTABLE_SCOPES
  )}&state=${state}`;

  res.redirect(authUrl);
});

// Airtable OAuth callback
router.get("/airtable/callback", async (req, res) => {
  const { code, error, state } = req.query;

  if (error) {
    return res.status(400).json({ error });
  }

  // Validate state to protect against CSRF
  if (!state || state !== req.session.oauthState) {
    return res.status(400).json({ error: "Invalid or missing state parameter" });
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://airtable.com/oauth2/v1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.AIRTABLE_CLIENT_ID,
        client_secret: process.env.AIRTABLE_CLIENT_SECRET,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const tokenData = tokenRes.data;

    // You can save tokens in DB/session here
    console.log("Airtable token response:", tokenData);

    res.json({
      message: "Authentication successful!",
      tokenData,
    });
  } catch (err) {
    console.error("Error exchanging token:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to exchange code for token" });
  }
});

export default router;
