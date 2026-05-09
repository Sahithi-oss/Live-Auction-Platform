const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, confirmDelivery, getEscrowStatus } = require('../controllers/escrowController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.post('/confirm-delivery/:id', protect, confirmDelivery);
router.get('/:auctionId', protect, getEscrowStatus);

module.exports = router;