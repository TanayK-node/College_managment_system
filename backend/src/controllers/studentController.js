const pool = require('../../config/db');

const studentController = {
  getDashboard: async (req, res) => {
    try {
      // Example student-specific data
      const courses = await pool.query(
        `SELECT courses.* FROM courses
         JOIN enrollments ON courses.id = enrollments.course_id
         WHERE enrollments.student_id = $1`,
        [req.user.userId]
      );

      res.json({
        message: 'Student Dashboard Data',
        courses: courses.rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = studentController;