const db = require('../config/database');
const bcrypt = require('bcryptjs');

const UserModel = {
  findById(id) {
    const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
    return user || null;
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  },

  create({ name, email, password }) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(name.trim(), email.trim().toLowerCase(), hashedPassword);
    return this.findById(result.lastInsertRowid);
  },

  comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
};

module.exports = UserModel;
