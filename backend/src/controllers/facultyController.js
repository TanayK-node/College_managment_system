const pool = require('../../config/db');

const facultyController = {
  getDashboard: async (req, res) => {
    try {
      // Example faculty-specific data
      const courses = await pool.query(
        'SELECT * FROM courses WHERE faculty_id = $1',
        [req.user.userId]
      );
      
      res.json({
        message: 'Faculty Dashboard Data',
        courses: courses.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = facultyController;