const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Hello from AZ-204 Node App deployed via GitHub Actions!");
});

app.get("/health", (req, res) => {
  res.json({ status: "Healthy" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
