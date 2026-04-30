const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { requireMember } = require('../middleware/role');

const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
      projectAdmins: [req.user._id]
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const getProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== 'admin') {
      query.members = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('projectAdmins', 'name email role')
      .lean();

    const projectsWithTaskCount = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ project: project._id });
        return { ...project, taskCount };
      })
    );

    res.json(projectsWithTaskCount);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('projectAdmins', 'name email role')
      .lean();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Member check handled by requireMember middleware

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email')
      .lean();

    res.json({ project, tasks });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isGlobalAdmin = req.user.role === 'admin';
    const isProjectAdmin = project.projectAdmins.includes(req.user._id);
    if (!isGlobalAdmin && !isProjectAdmin && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update project' });
    }

    const { name, description } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('projectAdmins', 'name email role')
      .lean();

    res.json({ project: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isGlobalAdmin = req.user.role === 'admin';
    if (!isGlobalAdmin && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only project owner or system admin can delete project' });
    }

    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

const addMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isGlobalAdmin = req.user.role === 'admin';
    const isProjectAdmin = project.projectAdmins.includes(req.user._id);
    if (!isGlobalAdmin && !isProjectAdmin && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to add members' });
    }

    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('projectAdmins', 'name email role')
      .lean();

    res.json({ project: updated });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isGlobalAdmin = req.user.role === 'admin';
    const isProjectAdmin = project.projectAdmins.includes(req.user._id);
    if (!isGlobalAdmin && !isProjectAdmin && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to remove members' });
    }

    const { userId } = req.params;

    if (project.createdBy.toString() === userId) {
      return res.status(400).json({ error: 'Cannot remove project creator' });
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );
    project.projectAdmins = project.projectAdmins.filter(
      admin => admin.toString() !== userId
    );

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('projectAdmins', 'name email role')
      .lean();

    res.json({ project: updated });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const isGlobalAdmin = req.user.role === 'admin';
    const isProjectAdmin = project.projectAdmins.includes(req.user._id);
    if (!isGlobalAdmin && !isProjectAdmin && project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to change project roles' });
    }

    const { role } = req.body;
    const { userId } = req.params;

    if (role === 'admin') {
      if (!project.projectAdmins.includes(userId)) {
        project.projectAdmins.push(userId);
      }
    } else {
      project.projectAdmins = project.projectAdmins.filter(id => id.toString() !== userId);
    }

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('projectAdmins', 'name email role')
      .lean();
    res.json({ project: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member role' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole
};