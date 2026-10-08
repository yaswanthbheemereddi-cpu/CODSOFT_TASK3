const db = require('../config/database');

const TaskModel = {
  findAll({ userId, search, is_completed, priority, category, sortBy = 'created_at', order = 'DESC', page = 1, limit = 10 }) {
    const conditions = ['user_id = ?'];
    const params = [userId];

    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term);
    }

    if (is_completed !== undefined && is_completed !== '') {
      conditions.push('is_completed = ?');
      const val = (is_completed === 'true' || is_completed === '1' || is_completed === 1) ? 1 : 0;
      params.push(val);
    }

    if (priority) {
      conditions.push('priority = ?');
      params.push(priority.toLowerCase());
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category.toLowerCase());
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const countSql = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
    const totalRow = db.prepare(countSql).get(...params);
    const total = totalRow ? totalRow.total : 0;

    const allowedSortCols = ['id', 'title', 'priority', 'category', 'due_date', 'is_completed', 'created_at'];
    const safeSortCol = allowedSortCols.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (safePage - 1) * safeLimit;

    const dataSql = `
      SELECT * FROM tasks
      ${whereClause}
      ORDER BY ${safeSortCol} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    const tasks = db.prepare(dataSql).all(...params, safeLimit, offset);

    return {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      data: tasks
    };
  },

  findById(id, userId) {
    return db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(id, userId);
  },

  create({ userId, title, description, category = 'personal', priority = 'medium', due_date = null, is_completed = 0 }) {
    const stmt = db.prepare(`
      INSERT INTO tasks (user_id, title, description, category, priority, due_date, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const comp = is_completed ? 1 : 0;
    const result = stmt.run(
      userId,
      title.trim(),
      description ? description.trim() : null,
      category.toLowerCase(),
      priority.toLowerCase(),
      due_date || null,
      comp
    );

    return this.findById(result.lastInsertRowid, userId);
  },

  update(id, userId, data) {
    const existing = this.findById(id, userId);
    if (!existing) return null;

    const updated = {
      title: data.title !== undefined ? data.title.trim() : existing.title,
      description: data.description !== undefined ? (data.description ? data.description.trim() : null) : existing.description,
      category: data.category !== undefined ? data.category.toLowerCase() : existing.category,
      priority: data.priority !== undefined ? data.priority.toLowerCase() : existing.priority,
      due_date: data.due_date !== undefined ? (data.due_date || null) : existing.due_date,
      is_completed: data.is_completed !== undefined ? (data.is_completed ? 1 : 0) : existing.is_completed
    };

    const stmt = db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, category = ?, priority = ?, due_date = ?, is_completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    stmt.run(
      updated.title,
      updated.description,
      updated.category,
      updated.priority,
      updated.due_date,
      updated.is_completed,
      id,
      userId
    );

    return this.findById(id, userId);
  },

  toggleComplete(id, userId) {
    const existing = this.findById(id, userId);
    if (!existing) return null;

    const newStatus = existing.is_completed ? 0 : 1;
    db.prepare('UPDATE tasks SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?').run(newStatus, id, userId);
    return this.findById(id, userId);
  },

  delete(id, userId) {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
  },

  getSummary(userId) {
    const total = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').get(userId).count;
    const completed = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND is_completed = 1').get(userId).count;
    const pending = total - completed;
    const urgent = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND priority = 'urgent' AND is_completed = 0").get(userId).count;

    return { total, completed, pending, urgent };
  }
};

module.exports = TaskModel;
