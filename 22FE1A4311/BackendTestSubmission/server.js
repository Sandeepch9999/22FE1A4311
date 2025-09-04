const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const urls = {};

// Create short URL
app.post("/shorturls", (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const id = nanoid(6);
  const shortLink = `http://localhost:${PORT}/${id}`;
  urls[id] = { original: url, clicks: 0 };
  res.json({ shortLink, expiry: "24h" });
});

// Redirect to original
app.get("/:id", (req, res) => {
  const { id } = req.params;
  const record = urls[id];
  if (!record) {
    return res.status(404).send("URL not found");
  }
  record.clicks++;
  res.redirect(record.original);
});

// Stats
app.get("/shorturls/:id", (req, res) => {
  const { id } = req.params;
  const record = urls[id];
  if (!record) {
    return res.status(404).json({ error: "URL not found" });
  }
  res.json({ original: record.original, clicks: record.clicks });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
