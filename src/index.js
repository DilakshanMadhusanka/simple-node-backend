import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory store for items
let items = [
  { id: 1, title: 'Learn Node.js', completed: true, createdAt: new Date().toISOString() },
  { id: 2, title: 'Build Express REST API', completed: false, createdAt: new Date().toISOString() }
];
let nextId = 3;

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Simple Node Backend API',
    endpoints: {
      health: 'GET /health',
      listItems: 'GET /api/items',
      getItem: 'GET /api/items/:id',
      createItem: 'POST /api/items',
      updateItem: 'PUT /api/items/:id',
      deleteItem: 'DELETE /api/items/:id'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// GET /api/items - Retrieve all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET /api/items/:id - Retrieve a single item by ID
app.get('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json(item);
});

// POST /api/items - Create a new item
app.post('/api/items', (req, res) => {
  const { title, completed = false } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'A valid "title" string is required' });
  }

  const newItem = {
    id: nextId++,
    title: title.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString()
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /api/items/:id - Update an existing item
app.put('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const itemIndex = items.findIndex((i) => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const { title, completed } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'If provided, "title" must be a non-empty string' });
  }

  const existing = items[itemIndex];
  const updatedItem = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    completed: completed !== undefined ? Boolean(completed) : existing.completed,
    updatedAt: new Date().toISOString()
  };

  items[itemIndex] = updatedItem;
  res.json(updatedItem);
});

// DELETE /api/items/:id - Delete an item
app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const itemIndex = items.findIndex((i) => i.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const [deletedItem] = items.splice(itemIndex, 1);
  res.json({ message: 'Item deleted', item: deletedItem });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server if executed directly
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app, server };
