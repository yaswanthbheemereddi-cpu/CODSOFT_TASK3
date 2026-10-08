const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { validateTask } = require('../middleware/validator');
const { optionalAuth } = require('../middleware/auth');

// All task routes use authentication (falls back to demo account if token not provided)
router.use(optionalAuth);

// GET /api/tasks - List tasks (?search, ?is_completed, ?priority, ?category, ?page, ?limit)
router.get('/', TaskController.getAllTasks);

// GET /api/tasks/summary - Stats summary
router.get('/summary', TaskController.getStats);

// GET /api/tasks/:id - Get single task
router.get('/:id', TaskController.getTaskById);

// POST /api/tasks - Create task
router.post('/', validateTask, TaskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', validateTask, TaskController.updateTask);

// PATCH /api/tasks/:id/toggle - Toggle completed status
router.patch('/:id/toggle', TaskController.toggleComplete);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
