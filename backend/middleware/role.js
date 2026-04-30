const Project = require('../models/Project');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const requireMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (req.user.role === 'admin') {
      return next();
    }

    const projectId = req.params.projectId || req.params.id || req.body.projectId;
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID required for role check' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = project.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ error: 'Access denied: Must be a member of the project' });
    }

    next();
  } catch (error) {
    console.error('requireMember middleware error:', error);
    res.status(500).json({ error: 'Server error during role check' });
  }
};

module.exports = {
  requireAdmin,
  requireMember
};