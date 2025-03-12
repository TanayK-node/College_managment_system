const authService = require('../services/authServices');

const login = async (req, res) => {
  const { email, password, role } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  // Validate role
  const validRoles = ['student', 'faculty', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const { user, token } = await authService.loginUser(email, password, role);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { login };