const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { requireAdmin, requireMember } = require('../middleware/role');
const authenticate = require('../middleware/auth');
const projectValidation = require('../validation/projectValidation');

router.get('/', authenticate, getProjects);
router.post('/', authenticate, requireAdmin, projectValidation.create, createProject);
router.get('/:id', authenticate, requireMember, getProjectById);
router.patch('/:id', authenticate, requireAdmin, projectValidation.update, updateProject);
router.delete('/:id', authenticate, requireAdmin, deleteProject);
router.post('/:id/members', authenticate, requireAdmin, projectValidation.addMember, addMember);
router.delete('/:id/members/:userId', authenticate, requireAdmin, removeMember);

module.exports = router;