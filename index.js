const express = require("express");
const path = require("path");

// Import todos router
const todosRouter = require("./routes/todos");

const app = express();
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Use the todos router for /api/todos
app.use("/api/todos", todosRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Healthy" });
});

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
