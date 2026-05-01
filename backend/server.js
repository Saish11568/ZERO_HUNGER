const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─── AUTH ───────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  db.get("SELECT * FROM users WHERE role = ?", [role], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found for role: ' + role });
    res.json(user);
  });
});

// ─── ORDERS ─────────────────────────────────────────────
app.get('/api/orders', (req, res) => {
  db.all("SELECT * FROM orders ORDER BY timestamp DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse volunteer JSON string back to object
    const orders = rows.map(r => ({
      ...r,
      volunteer: r.volunteer ? JSON.parse(r.volunteer) : null
    }));
    res.json(orders);
  });
});

app.get('/api/orders/:id', (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Order not found' });
    row.volunteer = row.volunteer ? JSON.parse(row.volunteer) : null;
    res.json(row);
  });
});

app.post('/api/orders', (req, res) => {
  const { food, quantity, type, source } = req.body;
  const id = Date.now().toString();
  const trl = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
  const status = 'Pending';
  const ngoStatus = 'pending';
  const expiresIn = '4 hrs';
  const timestamp = new Date().toISOString();

  db.run(
    'INSERT INTO orders (id, food, quantity, type, trl, source, status, ngoStatus, expiresIn, timestamp, volunteer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, food, quantity, type, trl, source, status, ngoStatus, expiresIn, timestamp, null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, food, quantity, type, trl, source, status, ngoStatus, expiresIn, timestamp, volunteer: null });
    }
  );
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
    db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      row.volunteer = row.volunteer ? JSON.parse(row.volunteer) : null;
      res.json(row);
    });
  });
});

app.put('/api/orders/:id/ngo-status', (req, res) => {
  const { action } = req.body; // 'accept' or 'decline'
  const ngoStatus = action === 'accept' ? 'accepted' : 'declined';
  const status = action === 'accept' ? 'Order Accepted' : 'Declined';

  db.run("UPDATE orders SET ngoStatus = ?, status = ? WHERE id = ?", [ngoStatus, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
    db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err2, row) => {
      if (err2) return res.status(500).json({ error: err2.message });
      row.volunteer = row.volunteer ? JSON.parse(row.volunteer) : null;
      res.json(row);
    });
  });
});

// ─── USERS ──────────────────────────────────────────────
app.put('/api/users/:id', (req, res) => {
  const { name, email, phone, organization, profileImage } = req.body;
  db.run(
    "UPDATE users SET name = ?, email = ?, phone = ?, organization = ?, profileImage = ? WHERE id = ?",
    [name, email, phone, organization, profileImage || null, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
      db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(row);
      });
    }
  );
});

app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ─── VOLUNTEERS ─────────────────────────────────────────
// We store volunteers in memory for now (they were always mock data)
let volunteers = [
  { id: 1, name: 'Rahul Sharma', vehicle: 'Scooter (2-Wheeler)', status: 'Available', rating: 4.8, deliveries: 124 },
  { id: 2, name: 'Anjali Verma', vehicle: 'Hatchback (4-Wheeler)', status: 'En Route', rating: 4.9, deliveries: 312 },
  { id: 3, name: 'Suresh Kumar', vehicle: 'Scooter (2-Wheeler)', status: 'Offline', rating: 4.5, deliveries: 89 },
  { id: 4, name: 'Priya Patel', vehicle: 'Bicycle', status: 'Available', rating: 4.7, deliveries: 45 },
];

app.get('/api/volunteers', (req, res) => {
  res.json(volunteers);
});

app.post('/api/volunteers', (req, res) => {
  const newVol = {
    id: Date.now(),
    name: req.body.name || 'New Recruit ' + (volunteers.length + 1),
    vehicle: req.body.vehicle || 'Scooter (2-Wheeler)',
    status: 'Available',
    rating: 5.0,
    deliveries: 0
  };
  volunteers.unshift(newVol);
  res.json(newVol);
});

// ─── ANIMAL FEEDING ─────────────────────────────────────
app.get('/api/animal-feeding/fallback', (req, res) => {
  // Logic: Get orders that are Expired OR Pending for > 30 mins
  const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  db.all(
    "SELECT * FROM orders WHERE (status = 'Expired') OR (status = 'Pending' AND timestamp < ?)",
    [thirtyMinsAgo],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get('/api/animal-feeding/locations', (req, res) => {
  db.all("SELECT * FROM feeding_locations", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/animal-feeding/assign', (req, res) => {
  const { orderId, locationId, volunteerId } = req.body;
  const id = Date.now().toString();
  const timestamp = new Date().toISOString();
  
  db.serialize(() => {
    db.run(
      "INSERT INTO animal_feeding (id, orderId, status, locationId, volunteerId, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
      [id, orderId, 'Assigned', locationId, volunteerId, timestamp]
    );
    db.run(
      "UPDATE orders SET status = 'Auto-moved to Animal Feeding' WHERE id = ?",
      [orderId]
    );
  });
  res.json({ id, orderId, status: 'Assigned', locationId, volunteerId, timestamp });
});

app.put('/api/animal-feeding/:id/status', (req, res) => {
  const { status, proofImage } = req.body;
  db.run(
    "UPDATE animal_feeding SET status = ?, proofImage = ? WHERE id = ?",
    [status, proofImage || null, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.get('/api/animal-feeding/stats', (req, res) => {
  db.get("SELECT COUNT(*) as totalFed, SUM(animals) as totalAnimals FROM animal_feeding JOIN feeding_locations ON animal_feeding.locationId = feeding_locations.id WHERE animal_feeding.status = 'Completed'", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      totalFed: row.totalFed || 0,
      totalAnimals: row.totalAnimals || 0,
      activeVolunteers: 12 // Mock
    });
  });
});

// ─── START ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ZeroHunger Backend running on http://localhost:${PORT}`);
});
