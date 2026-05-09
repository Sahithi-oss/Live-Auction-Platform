const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true,
    unique: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending_payment', 'held', 'released', 'disputed', 'refunded'],
    default: 'pending_payment'
  },
  stripePaymentIntentId: String,
  buyerConfirmedDelivery: {
    type: Boolean,
    default: false
  },
  disputeReason: String,
  releaseDate: Date
}, { timestamps: true });

const Escrow = mongoose.model('Escrow', escrowSchema);
module.exports = Escrow;
