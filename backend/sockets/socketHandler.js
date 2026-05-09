const bidService = require('../services/bidService');

exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_auction', (auctionId) => {
      socket.join(auctionId);
      console.log(`User ${socket.id} joined auction: ${auctionId}`);
    });

    socket.on('place_bid', async (data) => {
      try {
        const { auctionId, bidderId, amount } = data;
        const bid = await bidService.placeBid(auctionId, bidderId, amount);
        
        // Broadcast to everyone in the room including the sender
        io.to(auctionId).emit('bid_placed', {
          auctionId,
          amount: bid.amount,
          bidder: bid.bidder,
          isProxy: bid.isProxy,
          timestamp: bid.timestamp
        });
      } catch (error) {
        socket.emit('bid_error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
