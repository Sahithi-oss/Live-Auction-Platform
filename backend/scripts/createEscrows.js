require('dotenv').config();
const mongoose = require('mongoose');
const Auction = require('../models/Auction');
const Escrow = require('../models/Escrow');
const Notification = require('../models/Notification');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB...');

  const endedAuctions = await Auction.find({
    status: 'ended',
    highestBidder: { $exists: true, $ne: null }
  });

  console.log('Found ended auctions with winners:', endedAuctions.length);

  for (let auction of endedAuctions) {
    const existing = await Escrow.findOne({ auction: auction._id });
    if (existing) {
      console.log('Escrow already exists for:', auction.title);
      continue;
    }

    await Escrow.create({
      auction: auction._id,
      winner: auction.highestBidder,
      seller: auction.seller,
      amount: auction.currentBid,
      status: 'pending_payment'
    });

    await Notification.create({
      user: auction.highestBidder,
      message: `Congratulations! You won the auction for "${auction.title}". Please complete the payment.`,
      type: 'auction_end',
      link: `/payment/${auction._id}`
    });

    console.log(`Created escrow for: ${auction.title} - Amount: $${auction.currentBid}`);
  }

  console.log('Done! All escrow records created.');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
