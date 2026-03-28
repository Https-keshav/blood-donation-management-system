import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

/* ================= DATABASE ================= */
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

/* ================= AUTH MIDDLEWARE ================= */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret123");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

/* ================= REGISTER ================= */
app.post("/api/register", async (req, res) => {
  const {
    full_name,
    email,
    phone,
    password,
    blood_group,
    location,
    last_donation,
    is_available,
  } = req.body;

  try {
    const existing = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length)
      return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users 
      (full_name,email,phone,password,blood_group,location,last_donation,is_available)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        full_name,
        email,
        phone,
        hashed,
        blood_group,
        location,
        last_donation,
        is_available,
      ]
    );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Register failed" });
  }
});

/* ================= LOGIN ================= */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!result.rows.length)
      return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secret123",
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

/* ================= CURRENT USER ================= */
app.get("/api/me", authMiddleware, async (req, res) => {
  const user = await db.query(
    "SELECT id,email,full_name FROM users WHERE id=$1",
    [req.user.id]
  );

  res.json(user.rows[0]);
});

/* ================= BLOOD BANK ================= */
app.get("/api/bloodbanks", async (req, res) => {
  const result = await db.query("SELECT * FROM bloodbanks LIMIT 50");
  res.json({ data: result.rows });
});

/* ================= SERVER ================= */
app.listen(port, () =>
  console.log(`🚀 Server running on ${port}`)
);