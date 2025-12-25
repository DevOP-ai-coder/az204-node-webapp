const express = require("express");
const path = require("path");
const { CosmosClient } = require("@azure/cosmos");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;

// Cosmos DB setup
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE;
const containerId = process.env.COSMOS_DB_CONTAINER;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Healthy" });
});

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const { resources: items } = await container.items
      .query("SELECT * FROM c")
      .fetchAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Add a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const todo = req.body;
    const { resource } = await container.items.create(todo);
    res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Delete a todo by id
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { resource } = await container.item(id, id).delete();
    res.json({ deleted: resource.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
