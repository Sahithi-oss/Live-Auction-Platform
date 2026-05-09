import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, User, TrendingUp, ArrowRight } from 'lucide-react';
import CountdownTimer from '../common/CountdownTimer';
import { formatDistanceToNow } from 'date-fns';

const AuctionCard = ({ auction }) => {
  const isEnded = new Date(auction.endTime) < new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card overflow-hidden group flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={auction.images?.[0] || 'https://images.unsplash.com/photo-1549462111-9860263f35f1?q=80&w=800&auto=format&fit=crop'} 
          alt={auction.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-sky-400 border border-white/10">
          {auction.category}
        </div>
        {!isEnded && (
          <div className="absolute bottom-4 left-4 bg-sky-600 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Live
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2 uppercase font-medium">
          <User className="w-3 h-3" />
          <span>{auction.seller?.username || 'Premium Seller'}</span>
        </div>
        
        <h3 className="text-lg font-bold mb-3 group-hover:text-sky-400 transition-colors line-clamp-1">
          {auction.title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Current Bid</p>
            <p className="text-xl font-black text-white">${auction.currentBid?.toLocaleString()}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
              <Clock className="w-3 h-3" />
              <CountdownTimer targetDate={auction.endTime} />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              {isEnded && 'Ended'}
            </p>
          </div>
        </div>

        <Link 
          to={`/auction/${auction._id}`}
          className="mt-6 w-full bg-white/5 hover:bg-sky-600/20 border border-white/10 hover:border-sky-500/50 py-2.5 rounded-xl text-sm font-semibold text-center transition-all"
        >
          {isEnded ? 'View Results' : 'Place a Bid'}
        </Link>
      </div>
    </motion.div>
  );
};

export default AuctionCard;
