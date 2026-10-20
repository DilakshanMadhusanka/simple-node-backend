import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../src/index.js';

const getBaseUrl = () => {
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;
  return `http://localhost:${port}`;
};

describe('Simple Node Backend API', () => {
  after(() => {
    server.close();
  });

  it('GET /health returns status ok', async () => {
    const res = await fetch(`${getBaseUrl()}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
  });

  it('supports full CRUD lifecycle on /api/items', async () => {
    const baseUrl = getBaseUrl();

    // 1. List initial items
    const listRes = await fetch(`${baseUrl}/api/items`);
    assert.equal(listRes.status, 200);
    const initialItems = await listRes.json();
    assert.equal(initialItems.length, 2);

    // 2. Create a new item
    const createRes = await fetch(`${baseUrl}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Write tests', completed: false })
    });
    assert.equal(createRes.status, 201);
    const created = await createRes.json();
    assert.equal(created.title, 'Write tests');
    assert.equal(created.completed, false);

    // 3. Update the item
    const updateRes = await fetch(`${baseUrl}/api/items/${created.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    });
    assert.equal(updateRes.status, 200);
    const updated = await updateRes.json();
    assert.equal(updated.completed, true);

    // 4. Delete the item
    const deleteRes = await fetch(`${baseUrl}/api/items/${created.id}`, {
      method: 'DELETE'
    });
    assert.equal(deleteRes.status, 200);

    // 5. Verify 404 after deletion
    const getDeletedRes = await fetch(`${baseUrl}/api/items/${created.id}`);
    assert.equal(getDeletedRes.status, 404);
  });
});
