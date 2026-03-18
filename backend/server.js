import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/* ============================================================
   MIDDLEWARE
============================================================ */

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:8000",
    credentials: true,
  })
);

/* ============================================================
   SESSION SETUP
============================================================ */

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

/* ============================================================
   DATABASE CONNECTION
============================================================ */

const db = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

console.log("✅ Database pool created");

/* ============================================================
   AUTH ROUTES (TEMP TEST)
============================================================ */

// simulate login
app.post("/api/login-test", (req, res) => {
  req.session.user = {
    id: 1,
    full_name: "Test User",
    email: "test@example.com",
  };
  res.json({ message: "Logged in successfully" });
});

// current user
app.get("/api/me", (req, res) => {
  if (req.session.user) return res.json(req.session.user);
  res.status(401).json({ message: "Not authenticated" });
});

// logout
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

/* ============================================================
   BLOOD BANK MODULE
============================================================ */

app.get("/api/bloodbanks", async (req, res) => {
  const { page = 1, limit = 50, state, district, search } = req.query;
  const offset = (page - 1) * limit;

  let conditions = [];
  let values = [];

  if (state) {
    values.push(`%${state}%`);
    conditions.push(`LOWER(state) LIKE LOWER($${values.length})`);
  }

  if (district) {
    values.push(`%${district}%`);
    conditions.push(`LOWER(district) LIKE LOWER($${values.length})`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`LOWER(h_name) LIKE LOWER($${values.length})`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  try {
    const dataQuery = `
      SELECT *
      FROM bloodbanks
      ${whereClause}
      ORDER BY id
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const countQuery = `SELECT COUNT(*) FROM bloodbanks ${whereClause}`;

    const dataResult = await db.query(dataQuery, [
      ...values,
      limit,
      offset,
    ]);

    const countResult = await db.query(countQuery, values);

    res.json({
      total: parseInt(countResult.rows[0].count),
      page: Number(page),
      data: dataResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bloodbanks" });
  }
});

/* -------- NEAREST BLOODBANK -------- */
app.get("/api/nearest", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude & Longitude required" });
  }

  try {
    const result = await db.query(
      `
      SELECT *,
      (
        6371 * acos(
          cos(radians($1)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) *
          sin(radians(latitude))
        )
      ) AS distance
      FROM bloodbanks
      WHERE latitude IS NOT NULL
      ORDER BY distance
      LIMIT 10;
      `,
      [lat, lon]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nearest search failed" });
  }
});

/* ============================================================
   BLOOD CAMP MODULE
============================================================ */

/* -------- GET CAMPS -------- */
app.get("/api/camps", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM camps ORDER BY camp_date ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch camps" });
  }
});

/* -------- CREATE CAMP -------- */
app.post("/api/camps", async (req, res) => {
  const {
    title,
    organizer,
    location,
    city,
    state,
    camp_date,
    start_time,
    end_time,
    contact,
  } = req.body;

  try {
    await db.query(
      `INSERT INTO camps
      (title, organizer, location, city, state, camp_date, start_time, end_time, contact)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        title,
        organizer,
        location,
        city,
        state,
        camp_date,
        start_time,
        end_time,
        contact,
      ]
    );

    res.json({ message: "Camp created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create camp" });
  }
});

/* -------- REGISTER FOR CAMP -------- */
app.post("/api/camps/register", async (req, res) => {
  const { campId } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: "Login required" });
  }

  try {
    await db.query(
      `INSERT INTO camp_registrations (user_id, camp_id)
       VALUES ($1,$2)
       ON CONFLICT (user_id, camp_id) DO NOTHING`,
      [req.session.user.id, campId]
    );

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

/* -------- CAMP REGISTRATION COUNT -------- */
app.get("/api/camps/:id/registrations", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM camp_registrations WHERE camp_id=$1",
      [req.params.id]
    );

    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

/* ============================================================
   HEALTH CHECK
============================================================ */

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Backend is running" });
});

/* ============================================================
   SERVER
============================================================ */

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});