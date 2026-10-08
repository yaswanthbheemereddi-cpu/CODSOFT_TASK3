const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tasks.db');
const db = new DatabaseSync(dbPath);

// Enable foreign key constraints
db.exec('PRAGMA foreign_keys = ON;');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT CHECK(category IN ('work', 'study', 'personal', 'other')) DEFAULT 'personal',
      priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
      due_date DATE,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  console.log('[Database] Seeding sample user and tasks for Task 3...');

  const hashedPassword = bcrypt.hashSync('password123', 10);
  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `);

  const userResult = insertUser.run('Yaswanth Bose', 'yaswanth@codsoft.dev', hashedPassword);
  const userId = userResult.lastInsertRowid;

  const insertTask = db.prepare(`
    INSERT INTO tasks (user_id, title, description, category, priority, due_date, is_completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  insertTask.run(userId, 'Complete CodSoft Task 1 (Student Record API)', 'Implement relational models and CRUD endpoints', 'work', 'high', today, 1);
  insertTask.run(userId, 'Complete CodSoft Task 2 (Contact Management)', 'Add duplicate checks and search/filter', 'work', 'high', today, 1);
  insertTask.run(userId, 'Record LinkedIn Demo Videos', 'Record short 1-2 min walkthroughs and post with #codsoft tags', 'work', 'urgent', tomorrow, 0);
  insertTask.run(userId, 'Study System Design & REST Best Practices', 'Read about API rate limiting and JWT tokens', 'study', 'medium', nextWeek, 0);
  insertTask.run(userId, 'Evening Workout & Cardio', 'Stay healthy and energized', 'personal', 'low', today, 0);

  console.log('[Database] Sample tasks and user seeded successfully!');
}

initializeDatabase();

module.exports = db;
