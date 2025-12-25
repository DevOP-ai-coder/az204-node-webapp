const express = require("express");
const router = express.Router();
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE;
const containerId = process.env.COSMOS_DB_CONTAINER;

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

// GET all todos
router.get("/", async (req, res) => {
  const { resources } = await container.items.query("SELECT * from c").fetchAll();
  res.json(resources);
});

// POST a new todo
router.post("/", async (req, res) => {
  const newItem = { text: req.body.text };
  const { resource } = await container.items.create(newItem);
  res.json(resource);
});

// DELETE a todo by id
router.delete("/:id", async (req, res) => {
  await container.item(req.params.id, req.params.id).delete();
  res.json({ success: true });
});

module.exports = router;
