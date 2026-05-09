import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuctions } from '../redux/slices/auctionSlice';
import AuctionCard from '../components/auction/AuctionCard';
import { Search, Filter, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { auctions, isLoading } = useSelector((state) => state.auctions);
  const [searchQuery, setSearchQuery] = useState('');
  const auctionsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAuctions());
  }, [dispatch]);

  const handleStartBidding = () => {
    if (searchQuery) {
      dispatch(fetchAuctions({ search: searchQuery }));
    } else {
      dispatch(fetchAuctions());
    }
    // Scroll down to the auctions section
    auctionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            The Future of <br />
            <span className="gradient-text">Premium Auctions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Experience the thrill of real-time bidding on exclusive collectibles. 
            Secure, transparent, and powered by elite proxy-bidding technology.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartBidding()}
                placeholder="Search auctions, items, sellers..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
              />
            </div>
            <button 
              onClick={handleStartBidding}
              className="bg-sky-600 hover:bg-sky-500 px-8 py-3 rounded-xl font-semibold transition-all shadow-xl shadow-sky-900/30"
            >
              Start Bidding
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Real-time Bidding", desc: "Experience zero-latency bid updates with our Socket.io powered engine." },
            { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, title: "Secure Escrow", desc: "Payments are held securely in escrow until you confirm delivery." },
            { icon: <TrendingUp className="w-6 h-6 text-sky-400" />, title: "Proxy Bidding", desc: "Our smart system bids for you automatically up to your maximum limit." }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8">
              <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Auctions */}
      <section ref={auctionsRef} className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Live Auctions</h2>
            <p className="text-slate-400 text-sm">Bidding ending soon. Don't miss out!</p>
          </div>
          <button className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium">
            View All <TrendingUp className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
            {auctions.length === 0 && (
               <p className="col-span-full text-center py-20 text-slate-500 italic">No active auctions found. Be the first to list one!</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
