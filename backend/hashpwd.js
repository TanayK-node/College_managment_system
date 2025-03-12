const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

const hashExistingPasswords = async () => {
  try {
    // Fetch all users with plain-text passwords
    const result = await pool.query('SELECT * FROM users');

    for (const user of result.rows) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Update the user with the hashed password
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
      console.log(`Updated password for user: ${user.email}`);
    }

    console.log('All passwords have been hashed and updated.');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
};

hashExistingPasswords();