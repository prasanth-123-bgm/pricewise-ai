const express = require("express");
const dotenv = require("dotenv");
const { searchController } = require("./controllers/searchController");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", frontendOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "pricewise-ai-backend",
  });
});

app.get("/api/search", searchController);
app.post("/api/search", searchController);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.listen(port, () => {
  console.log(`PriceWise AI backend running on http://localhost:${port}`);
});
