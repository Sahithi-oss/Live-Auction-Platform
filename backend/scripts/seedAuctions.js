require('dotenv').config();
const mongoose = require('mongoose');
const Auction = require('../models/Auction');
const User = require('../models/User');

const seedMassiveData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for massive seeding...');

    const userData = [
      { username: 'Sahithi', email: 'sahithi@luxe.com', password: 'Sahithi', role: 'seller' },
      { username: 'Youna', email: 'youna@luxe.com', password: 'Youna', role: 'seller' },
      { username: 'Charitha', email: 'charitha@luxe.com', password: 'Charitha', role: 'seller' },
      { username: 'Karthik', email: 'karthik@luxe.com', password: 'Karthik', role: 'bidder' },
      { username: 'Rahul', email: 'rahul@luxe.com', password: 'Rahul', role: 'seller' },
      { username: 'Sneha', email: 'sneha@luxe.com', password: 'Sneha', role: 'bidder' },
      { username: 'Priya', email: 'priya@luxe.com', password: 'Priya', role: 'seller' },
      { username: 'Arjun', email: 'arjun@luxe.com', password: 'Arjun', role: 'bidder' },
      { username: 'Ananya', email: 'ananya@luxe.com', password: 'Ananya', role: 'seller' },
      { username: 'Vikram', email: 'vikram@luxe.com', password: 'Vikram', role: 'bidder' }
    ];

    const users = [];
    // Deep clean existing seeded users
    await User.deleteMany({ 
      $or: [
        { username: { $in: userData.map(u => u.username) } },
        { email: { $in: userData.map(u => u.email) } }
      ]
    });

    for (const u of userData) {
      const user = await User.create(u);
      console.log(`Created User: ${u.username}`);
      users.push(user);
    }

    const sellers = users.filter(u => u.role === 'seller');

    const auctionData = [
      { title: "Vintage Rolex", cat: "Collectibles", price: 15000, img: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=600" },
      { title: "Modern Art Canvas", cat: "Art", price: 2500, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600" },
      { title: "MacBook Stealth", cat: "Electronics", price: 4500, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600" },
      { title: "Diamond Pen", cat: "Collectibles", price: 8000, img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=600" },
      { title: "Tesla Model S Plaid", cat: "Vehicles", price: 85000, img: "https://images.unsplash.com/photo-1617788130012-05ba270ad20e?q=80&w=600" },
      { title: "Penthouse in Dubai", cat: "Real Estate", price: 500000, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600" },
      { title: "Gaming Setup 2026", cat: "Electronics", price: 3200, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600" },
      { title: "Abstract Sculpture", cat: "Art", price: 12000, img: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=600" },
      { title: "Classic Mustang 1969", cat: "Vehicles", price: 45000, img: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=600" },
      { title: "Gold Bar 1kg", cat: "Collectibles", price: 65000, img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=600" }
    ];

    const auctions = auctionData.map((a, i) => ({
      title: a.title,
      description: `A premium ${a.title} for selective collectors. Exceptional quality.`,
      category: a.cat,
      startingBid: a.price,
      currentBid: a.price,
      minIncrement: Math.round(a.price * 0.05),
      startTime: new Date(),
      endTime: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000), // staggered end times
      images: [a.img],
      seller: sellers[i % sellers.length]._id,
      status: 'live'
    }));

    await Auction.deleteMany({});
    await Auction.insertMany(auctions);

    console.log('Massive Seeding Complete! 10 Users and 10 Auctions created.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMassiveData();
