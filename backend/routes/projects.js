const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateMemberRole
} = require('../controllers/projectController');
const { requireAdmin, requireMember } = require('../middleware/role');
const authenticate = require('../middleware/auth');
const projectValidation = require('../validation/projectValidation');

router.get('/', authenticate, getProjects);
router.post('/', authenticate, requireAdmin, projectValidation.create, createProject);
router.get('/:id', authenticate, requireMember, getProjectById);
router.patch('/:id', authenticate, projectValidation.update, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.post('/:id/members', authenticate, projectValidation.addMember, addMember);
router.delete('/:id/members/:userId', authenticate, removeMember);
router.patch('/:id/members/:userId/role', authenticate, updateMemberRole);

module.exports = router;