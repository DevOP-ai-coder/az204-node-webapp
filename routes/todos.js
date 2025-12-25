const express = require("express");
const router = express.Router();
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE;
const containerId = process.env.COSMOS_DB_CONTAINER;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// Get all todos
router.get("/", async (req, res) => {
  try {
    const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Add a new todo
router.post("/", async (req, res) => {
  try {
    const todo = req.body;
    const { resource } = await container.items.create(todo);
    res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { resource } = await container.item(id, id).delete();
    res.json({ deleted: resource.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
