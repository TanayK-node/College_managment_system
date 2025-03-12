const { getUserByEmail } = require('../models/User');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwUtils');

const loginUser = async (email, password, role) => {
  // Fetch user from the database
  const user = await getUserByEmail(email);

  // Check if user exists
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the role matches
  if (user.role !== role) {
    throw new Error('Invalid role');
  }

  // Compare the provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwtUtils.generateToken(user);
  return { user, token };
};

module.exports = { loginUser };