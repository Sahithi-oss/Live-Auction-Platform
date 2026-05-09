require('dotenv').config();
const mongoose = require('mongoose');
require('../models/User');
require('../models/Auction');
const Escrow = require('../models/Escrow');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const records = await Escrow.find({ status: 'pending_payment' })
    .populate('winner', 'username email')
    .populate('auction', 'title currentBid');

  if (records.length === 0) {
    console.log('No pending payment escrows found.');
  } else {
    records.forEach(e => {
      console.log(`Auction: "${e.auction && e.auction.title}" | Winner: ${e.winner && e.winner.username} (${e.winner && e.winner.email}) | Amount: $${e.amount}`);
    });
  }
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });
