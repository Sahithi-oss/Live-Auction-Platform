const bidService = require('../services/bidService');
const Bid = require('../models/Bid');
const ProxyBid = require('../models/ProxyBid');
const Auction = require('../models/Auction');

exports.placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const io = req.app.get('io');
    
    // Place bid — service now handles all socket emissions (manual + proxy) in correct order
    const bid = await bidService.placeBid(auctionId, req.user.id, amount, false, io);

    res.status(201).json({ success: true, data: bid });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.setProxyBid = async (req, res) => {
  try {
    const { auctionId, maxBid } = req.body;
    const io = req.app.get('io');
    
    const proxyBid = await ProxyBid.findOneAndUpdate(
      { auction: auctionId, bidder: req.user.id },
      { maxBid, isActive: true },
      { upsert: true, new: true }
    );

    // Trigger proxy check using the REAL current bid, not 0
    const auction = await Auction.findById(auctionId);
    const currentAmount = auction ? auction.currentBid : 0;
    await bidService.handleProxyBidding(auctionId, req.user.id, currentAmount, io);

    res.status(200).json({ success: true, data: proxyBid });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAuctionBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate('bidder', 'username')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, data: bids });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
