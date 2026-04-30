const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { title, description, projectId, assignedTo, status, priority, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      status,
      priority,
      dueDate
    });

    const populated = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .lean();

    res.status(201).json({ task: populated });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status, assignedTo, priority, overdue } = req.query;

    let query = {};

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id').lean();
      const projectIds = userProjects.map(p => p._id);
      query.project = { $in: projectIds };
    } else if (projectId) {
      query.project = projectId;
    }

    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;

    let tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    if (overdue === 'true') {
      const now = new Date();
      tasks = tasks.filter(task => {
        if (task.status === 'done') return false;
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < now;
      });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name createdBy')
      .populate('assignedTo', 'name email')
      .lean();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const project = await Project.findById(task.project._id).lean();
    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    const updated = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .lean();

    res.json({ task: updated });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Admin can update any task, member can only update assigned tasks
    if (req.user.role !== 'admin') {
      if (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You can only update your assigned tasks' });
      }
    }

    const { status } = req.body;
    task.status = status;
    await task.save();

    const updated = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .lean();

    res.json({ task: updated });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateStatus,
  deleteTask
};