const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an auction title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Art', 'Electronics', 'Collectibles', 'Real Estate', 'Vehicles', 'Other']
  },
  startingBid: {
    type: Number,
    required: [true, 'Please provide a starting bid']
  },
  currentBid: {
    type: Number,
    default: function() { return this.startingBid; }
  },
  minIncrement: {
    type: Number,
    default: 10
  },
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'ended', 'canceled'],
    default: 'upcoming'
  },
  deliveryDetails: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexing for search and performance
auctionSchema.index({ title: 'text', description: 'text' });
auctionSchema.index({ status: 1, endTime: 1 });

const Auction = mongoose.model('Auction', auctionSchema);
module.exports = Auction;
