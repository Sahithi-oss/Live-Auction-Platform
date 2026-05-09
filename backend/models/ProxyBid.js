const mongoose = require('mongoose');

const proxyBidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxBid: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Ensure only one active proxy bid per user per auction
proxyBidSchema.index({ auction: 1, bidder: 1 }, { unique: true });

const ProxyBid = mongoose.model('ProxyBid', proxyBidSchema);
module.exports = ProxyBid;
