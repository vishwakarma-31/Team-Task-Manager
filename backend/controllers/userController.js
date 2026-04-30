const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    const users = await User.find(query).select('name email role');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot change your own role' });
    }
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete yourself' });
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser
};
