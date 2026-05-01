const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  db.serialize(() => {
    // Create Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      role TEXT,
      phone TEXT,
      organization TEXT,
      profileImage TEXT
    )`);

    // Create Orders table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      food TEXT,
      quantity TEXT,
      type TEXT,
      trl INTEGER,
      source TEXT,
      status TEXT,
      ngoStatus TEXT,
      expiresIn TEXT,
      timestamp TEXT,
      volunteer TEXT,
      isSpicy BOOLEAN DEFAULT 0,
      isOily BOOLEAN DEFAULT 0
    )`);

    // Create Animal Feeding table
    db.run(`CREATE TABLE IF NOT EXISTS animal_feeding (
      id TEXT PRIMARY KEY,
      orderId TEXT,
      status TEXT,
      locationId TEXT,
      volunteerId TEXT,
      proofImage TEXT,
      timestamp TEXT,
      FOREIGN KEY(orderId) REFERENCES orders(id)
    )`);

    // Create Feeding Locations table
    db.run(`CREATE TABLE IF NOT EXISTS feeding_locations (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      animals INTEGER,
      distance TEXT,
      lat REAL,
      lng REAL
    )`);

    // Seed mock feeding locations if empty
    db.get("SELECT count(*) as count FROM feeding_locations", (err, row) => {
      if (!err && row && row.count === 0) {
        const insert = db.prepare('INSERT INTO feeding_locations (id, name, type, animals, distance, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insert.run('loc1', 'Cubbon Park Corner', 'Park', 15, '0.8 km', 12.9716, 77.5946);
        insert.run('loc2', 'Indiranagar 12th Main', 'Street', 8, '1.2 km', 12.9719, 77.6412);
        insert.run('loc3', 'Koramangala 4th Block', 'Hotspot', 20, '2.5 km', 12.9339, 77.6231);
        insert.run('loc4', 'Lalbagh West Gate', 'Park', 12, '3.1 km', 12.9507, 77.5848);
        insert.finalize();
        console.log('Seeded feeding locations.');
      }
    });

    // Seed mock orders if empty
    db.get("SELECT count(*) as count FROM orders", (err, row) => {
      if (!err && row && row.count === 0) {
        const insert = db.prepare('INSERT INTO orders (id, food, quantity, type, trl, source, status, ngoStatus, expiresIn, timestamp, volunteer, isSpicy, isOily) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        
        insert.run(
          '1', 'Dal Makhani & Naan', '8.5kg', 'Veg', 64, 'Taj West End', 'Order Accepted', 'accepted', '2 hrs', new Date().toISOString(),
          JSON.stringify({ name: 'Rahul S.', phone: '+91 98765 43210' }), 0, 1
        );
        insert.run(
          '2', 'Mixed Veg Curry', '12kg', 'Veg', 80, 'ITC Gardenia', 'Pending', 'pending', '4 hrs', new Date().toISOString(), null, 1, 0
        );
        insert.run(
          '3', 'Rice & Sambar', '15kg', 'Veg', 92, 'Empire Restaurant', 'Expired', 'pending', '0 mins', new Date(Date.now() - 3600000).toISOString(), null, 0, 0
        );
        insert.finalize();
        console.log('Seeded initial orders.');
      }
    });

    // Seed mock users if empty
    const usersJsonPath = path.resolve(__dirname, '../src/data/users.json');
    if (fs.existsSync(usersJsonPath)) {
      const usersData = JSON.parse(fs.readFileSync(usersJsonPath, 'utf-8'));
      db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (!err && row && row.count === 0) {
          const insert = db.prepare('INSERT INTO users (id, name, email, role, phone, organization) VALUES (?, ?, ?, ?, ?, ?)');
          usersData.forEach(u => {
            insert.run(u.id, u.name, u.email, u.role, u.phone || '', u.organization || '');
          });
          insert.finalize();
          console.log('Seeded initial users.');
        }
      });
    }
  });
};

initDb();

module.exports = db;
