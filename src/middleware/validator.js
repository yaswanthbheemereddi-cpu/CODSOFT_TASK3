const { ApiError } = require('./errorHandler');

function validateTask(req, res, next) {
  const { title, priority, category, due_date } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Task title is required.');
  }

  if (priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
  }

  if (category) {
    const validCategories = ['work', 'study', 'personal', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  if (due_date) {
    const date = new Date(due_date);
    if (isNaN(date.getTime())) {
      errors.push('Due date must be a valid date format (e.g. YYYY-MM-DD).');
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Task validation failed', errors));
  }

  next();
}

function validateAuth(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Authentication validation failed', errors));
  }

  next();
}

module.exports = {
  validateTask,
  validateAuth
};
