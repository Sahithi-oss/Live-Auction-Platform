const express = require('express');
const router = express.Router();
const { placeBid, setProxyBid, getAuctionBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeBid);
router.post('/proxy', protect, setProxyBid);
router.get('/:auctionId', getAuctionBids);

module.exports = router;