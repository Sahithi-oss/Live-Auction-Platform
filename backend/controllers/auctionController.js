const Auction = require('../models/Auction');

exports.createAuction = async (req, res) => {
  try {
    const auctionData = { ...req.body };
    auctionData.seller = req.user.id;
    
    // Handle uploaded file
    if (req.file) {
      auctionData.images = [`http://localhost:5000/uploads/${req.file.filename}`];
    }

    const auction = await Auction.create(auctionData);
    res.status(201).json({ success: true, data: auction });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAuctions = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const auctions = await Auction.find(query).populate('seller', 'username');
    res.json({ success: true, data: auctions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'username')
      .populate('highestBidder', 'username');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    res.json({ success: true, data: auction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    // Only seller or admin can delete
    if (auction.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this auction' });
    }

    await auction.deleteOne();
    res.json({ success: true, message: 'Auction removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
