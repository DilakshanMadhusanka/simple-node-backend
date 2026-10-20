# Simple Node Backend

A lightweight Express.js REST API with a health check endpoint and in-memory CRUD operations for items/todos.

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the server
```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start
```

By default, the server runs at `http://localhost:3000` (configurable via the `PORT` environment variable).

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API overview and available routes |
| `GET` | `/health` | Health check status and server uptime |
| `GET` | `/api/items` | List all items |
| `GET` | `/api/items/:id` | Get a single item by ID |
| `POST` | `/api/items` | Create a new item (`{ "title": "...", "completed": false }`) |
| `PUT` | `/api/items/:id` | Update an existing item (`{ "title": "...", "completed": true }`) |
| `DELETE` | `/api/items/:id` | Delete an item by ID |
