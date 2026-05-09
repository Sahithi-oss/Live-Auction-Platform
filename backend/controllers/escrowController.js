const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Escrow = require('../models/Escrow');
const Auction = require('../models/Auction');
const Notification = require('../models/Notification');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { auctionId } = req.body;
    const escrow = await Escrow.findOne({ auction: auctionId, winner: req.user._id });
    
    if (!escrow) return res.status(404).json({ message: 'Escrow record not found' });
    if (escrow.status !== 'pending_payment') return res.status(400).json({ message: 'Payment already processed or not required' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(escrow.amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: { auctionId, escrowId: escrow._id.toString() }
    });

    escrow.stripePaymentIntentId = paymentIntent.id;
    await escrow.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const escrow = await Escrow.findOne({ stripePaymentIntentId: paymentIntentId });
    
    if (!escrow) return res.status(404).json({ message: 'Escrow not found' });

    escrow.status = 'held';
    await escrow.save();

    // Notify seller
    await Notification.create({
      user: escrow.seller,
      message: `Payment for auction "${escrow.auction}" has been secured in escrow. You can now ship the item.`,
      type: 'payment_received'
    });

    res.json({ success: true, message: 'Payment confirmed and held in escrow' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmDelivery = async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ _id: req.params.id, winner: req.user._id });
    if (!escrow) return res.status(404).json({ message: 'Escrow record not found' });

    escrow.buyerConfirmedDelivery = true;
    escrow.status = 'released';
    escrow.releaseDate = new Date();
    await escrow.save();

    // In a real app, you would now trigger the actual transfer to the seller's Stripe Connect account
    // For this project, we'll simulate it by updating the notification
    await Notification.create({
      user: escrow.seller,
      message: `Buyer has confirmed delivery! Funds ($${escrow.amount}) have been released to your account.`,
      type: 'delivery_confirmed'
    });

    res.json({ success: true, message: 'Delivery confirmed and funds released' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEscrowStatus = async (req, res) => {
  try {
    const escrow = await Escrow.findOne({ auction: req.params.auctionId })
      .populate('winner', 'username')
      .populate('seller', 'username');
    res.json({ success: true, data: escrow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
