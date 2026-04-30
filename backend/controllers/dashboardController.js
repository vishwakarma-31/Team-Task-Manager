const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboardStats = async (req, res) => {
  try {
    let projectFilter = {};

    if (req.user.role !== 'admin') {
      const userProjects = await Project.find({ members: req.user._id }).select('_id').lean();
      const projectIds = userProjects.map(p => p._id);
      projectFilter = { project: { $in: projectIds } };
    }

    const now = new Date();

    const stats = await Task.aggregate([
      { $match: projectFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      todo: 0,
      'in-progress': 0,
      done: 0
    };

    stats.forEach(s => {
      statusCounts[s._id] = s.count;
    });

    const overdueTasks = await Task.aggregate([
      {
        $match: {
          ...projectFilter,
          status: { $ne: 'done' },
          dueDate: { $lt: now }
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      { $unwind: '$projectInfo' },
      {
        $lookup: {
          from: 'users',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedUser'
        }
      },
      { $unwind: { path: '$assignedUser', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          projectName: '$projectInfo.name',
          assigneeName: '$assignedUser.name'
        }
      }
    ]);

    const totalTasks = statusCounts.todo + statusCounts['in-progress'] + statusCounts.done;
    const completedTasks = statusCounts.done;
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    const tasksByProject = await Task.aggregate([
      { $match: projectFilter },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectInfo'
        }
      },
      { $unwind: '$projectInfo' },
      {
        $group: {
          _id: '$project',
          projectName: { $first: '$projectInfo.name' },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, projectName: 1, count: 1 } }
    ]);

    const recentActivity = await Task.find(projectFilter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .lean();

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks: statusCounts['in-progress'],
      todoTasks: statusCounts.todo,
      overdueTasks: overdueTasks.length,
      completionPercentage,
      tasksByProject,
      recentActivity,
      overdueTaskList: overdueTasks.slice(0, 5)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

module.exports = {
  getDashboardStats
};