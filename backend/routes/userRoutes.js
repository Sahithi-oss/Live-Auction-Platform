const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getNotifications, markNotificationRead, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id', protect, markNotificationRead);
router.get('/', protect, authorize('admin'), getAllUsers);

module.exports = router;