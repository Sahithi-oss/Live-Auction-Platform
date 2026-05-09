const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const ProxyBid = require('../models/ProxyBid');
const Notification = require('../models/Notification');
const User = require('../models/User');

const handleProxyBidding = async (auctionId, lastBidderId, currentAmount, io = null) => {
  const auction = await Auction.findById(auctionId);
  
  const proxyBids = await ProxyBid.find({ 
    auction: auctionId, 
    bidder: { $ne: lastBidderId },
    isActive: true,
    maxBid: { $gt: currentAmount }
  }).sort({ maxBid: -1 }).populate('bidder', 'username');

  if (proxyBids.length === 0) return;

  const topProxy = proxyBids[0];
  const increment = auction.minIncrement || 10;
  
  let nextBidAmount = currentAmount + increment;
  if (nextBidAmount > topProxy.maxBid) {
    nextBidAmount = topProxy.maxBid;
  }

  // Create the proxy bid
  const bid = await Bid.create({
    auction: auctionId,
    bidder: topProxy.bidder._id,
    amount: nextBidAmount,
    isProxy: true
  });

  auction.currentBid = nextBidAmount;
  auction.highestBidder = topProxy.bidder._id;
  await auction.save();

  // If io is provided, emit the update
  if (io) {
    io.to(auctionId.toString()).emit('bid_placed', {
      auctionId,
      amount: nextBidAmount,
      bidder: {
        _id: topProxy.bidder._id,
        username: topProxy.bidder.username
      },
      isProxy: true,
      timestamp: bid.createdAt
    });
  }

  // Check for more competition
  const otherProxyBids = await ProxyBid.find({
    auction: auctionId,
    bidder: { $ne: topProxy.bidder._id },
    isActive: true,
    maxBid: { $gt: nextBidAmount }
  });

  if (otherProxyBids.length > 0) {
    await handleProxyBidding(auctionId, topProxy.bidder._id, nextBidAmount, io);
  }
};

exports.placeBid = async (auctionId, bidderId, amount, isProxy = false, io = null) => {
  const auction = await Auction.findById(auctionId);
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'live') throw new Error('Auction is not live');
  if (amount <= auction.currentBid) throw new Error(`Bid must be higher than $${auction.currentBid}`);
  if (auction.seller.toString() === bidderId) throw new Error('Sellers cannot bid on their own auctions');

  const bid = await Bid.create({
    auction: auctionId,
    bidder: bidderId,
    amount: amount,
    isProxy: isProxy
  });

  const prevHighestBidder = auction.highestBidder;
  auction.currentBid = amount;
  auction.highestBidder = bidderId;
  await auction.save();

  if (prevHighestBidder && prevHighestBidder.toString() !== bidderId) {
    await Notification.create({
      user: prevHighestBidder,
      message: `You have been outbid on "${auction.title}"`,
      type: 'outbid',
      link: `/auction/${auctionId}`
    });
  }

  // Emit the manual bid FIRST so UI shows it, then proxy will override with higher amount
  if (io) {
    const bidderUser = await User.findById(bidderId, 'username');
    io.to(auctionId.toString()).emit('bid_placed', {
      auctionId,
      amount,
      bidder: { _id: bidderId, username: bidderUser?.username },
      isProxy: false,
      timestamp: bid.createdAt
    });
  }

  // Kick off proxy bidding chain — its emission will override above if proxy wins
  await handleProxyBidding(auctionId, bidderId, amount, io);

  return bid;
};

exports.handleProxyBidding = handleProxyBidding;
