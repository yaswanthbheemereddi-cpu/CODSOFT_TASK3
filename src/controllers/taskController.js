const TaskModel = require('../models/taskModel');
const { ApiError } = require('../middleware/errorHandler');

const TaskController = {
  getAllTasks(req, res, next) {
    try {
      const userId = req.user.id;
      const { search, is_completed, priority, category, sortBy, order, page, limit } = req.query;

      const result = TaskModel.findAll({
        userId,
        search,
        is_completed,
        priority,
        category,
        sortBy,
        order,
        page,
        limit
      });

      const summary = TaskModel.getSummary(userId);

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        summary,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        },
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  },

  getTaskById(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) throw new ApiError(400, 'Invalid task ID');

      const task = TaskModel.findById(taskId, req.user.id);
      if (!task) throw new ApiError(404, `Task with ID ${taskId} not found`);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  createTask(req, res, next) {
    try {
      const newTask = TaskModel.create({
        userId: req.user.id,
        ...req.body
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
      });
    } catch (error) {
      next(error);
    }
  },

  updateTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) throw new ApiError(400, 'Invalid task ID');

      const existing = TaskModel.findById(taskId, req.user.id);
      if (!existing) throw new ApiError(404, `Task with ID ${taskId} not found`);

      const updated = TaskModel.update(taskId, req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  toggleComplete(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) throw new ApiError(400, 'Invalid task ID');

      const updated = TaskModel.toggleComplete(taskId, req.user.id);
      if (!updated) throw new ApiError(404, `Task with ID ${taskId} not found`);

      res.status(200).json({
        success: true,
        message: updated.is_completed ? 'Task marked as completed' : 'Task marked as pending',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  deleteTask(req, res, next) {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (isNaN(taskId)) throw new ApiError(400, 'Invalid task ID');

      const existing = TaskModel.findById(taskId, req.user.id);
      if (!existing) throw new ApiError(404, `Task with ID ${taskId} not found`);

      TaskModel.delete(taskId, req.user.id);

      res.status(200).json({
        success: true,
        message: `Task '${existing.title}' deleted successfully`
      });
    } catch (error) {
      next(error);
    }
  },

  getStats(req, res, next) {
    try {
      const summary = TaskModel.getSummary(req.user.id);
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = TaskController;
