const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  createAuction, 
  getAuctions, 
  getAuction, 
  deleteAuction 
} = require('../controllers/auctionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

router.route('/')
  .get(getAuctions)
  .post(protect, authorize('seller', 'admin'), upload.single('image'), createAuction);

router.route('/:id')
  .get(getAuction)
  .delete(protect, deleteAuction);

module.exports = router;