const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, ApiError } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static dashboard
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'CodSoft Task 3 - To-Do List Backend API',
    timestamp: new Date().toISOString()
  });
});

// Swagger / OpenAPI documentation JSON specification
app.get('/api/openapi.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'openapi.json'));
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.all('/api/*', (req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} not found`));
});

app.use(errorHandler);

module.exports = app;
