const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/role');
const adminController = require('../controllers/adminController');

router.get('/dashboard', 
  auth, 
  role(['admin']), 
  adminController.getDashboard
);

// Add other admin routes here
// router.post('/users', auth, role(['admin']), adminController.manageUsers);

module.exports = router;