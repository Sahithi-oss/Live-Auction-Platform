const cron = require('node-cron');
const Auction = require('../models/Auction');
const Escrow = require('../models/Escrow');
const Notification = require('../models/Notification');

exports.startAuctionScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Close live auctions that reached end time
      const endedAuctions = await Auction.find({
        status: 'live',
        endTime: { $lte: now }
      });

      for (let auction of endedAuctions) {
        auction.status = 'ended';
        await auction.save();
        
        // Create escrow record if there was a winner
        if (auction.highestBidder) {
          await Escrow.create({
            auction: auction._id,
            winner: auction.highestBidder,
            seller: auction.seller,
            amount: auction.currentBid,
            status: 'pending_payment'
          });

          // Notify Winner
          await Notification.create({
            user: auction.highestBidder,
            message: `Congratulations! You won the auction for "${auction.title}". Please complete the payment.`,
            type: 'auction_end',
            link: `/payment/${auction._id}`
          });

          // Notify Seller
          await Notification.create({
            user: auction.seller,
            message: `Auction for "${auction.title}" has ended. Waiting for buyer payment.`,
            type: 'auction_end'
          });
        }
        
        console.log(`Auction ${auction._id} ended.`);
      }

      // Start upcoming auctions that reached start time
      const startingAuctions = await Auction.find({
        status: 'upcoming',
        startTime: { $lte: now }
      });

      for (let auction of startingAuctions) {
        auction.status = 'live';
        await auction.save();
        console.log(`Auction ${auction._id} is now live.`);
      }
      
    } catch (error) {
      console.error('Error in auction scheduler:', error);
    }
  });
};
