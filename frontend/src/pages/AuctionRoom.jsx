import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAuctionById, updateHighestBid } from '../redux/slices/auctionSlice';
import { useSocket } from '../hooks/useSocket';
import { Clock, TrendingUp, User, ShieldCheck, History, DollarSign, Zap, Trophy, CreditCard } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import CountdownTimer from '../components/common/CountdownTimer';
import { toast } from 'react-hot-toast';

const AuctionRoom = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAuction: auction, isLoading, isError, message } = useSelector((state) => state.auctions);
  const { user, token } = useSelector((state) => state.auth);
  
  const [bidAmount, setBidAmount] = useState('');
  const [proxyMaxBid, setProxyMaxBid] = useState('');
  const [bidHistory, setBidHistory] = useState([]);
  const [isProxyActive, setIsProxyActive] = useState(false);
  const [error, setError] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  const onBidUpdate = useCallback((data) => {
    dispatch(updateHighestBid(data));
    setBidHistory(prev => [data, ...prev].slice(0, 10));
  }, [dispatch]);

  const { emitBid } = useSocket(id, onBidUpdate);

  useEffect(() => {
    dispatch(fetchAuctionById(id));
    // Fetch initial bid history
    axios.get(`http://localhost:5000/api/bids/${id}`)
      .then(res => setBidHistory(res.data.data))
      .catch(err => console.error(err));
  }, [id, dispatch]);

  useEffect(() => {
    if (auction) {
      const ended = new Date(auction.endTime) <= new Date();
      setIsEnded(ended);
    }
  }, [auction]);

  const handleTimerEnd = () => {
    setIsEnded(true);
    dispatch(fetchAuctionById(id)); // Refresh to get final status
    toast.success('Auction has ended!');
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setError('');

    const amount = parseFloat(bidAmount);
    if (amount <= auction.currentBid) {
      setError(`Bid must be at least $${auction.currentBid + (auction.minIncrement || 10)}`);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/bids', { auctionId: id, amount }, config);
      setBidAmount('');
      toast.success('Bid placed successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place bid';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleSetProxy = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('http://localhost:5000/api/bids/proxy', { auctionId: id, maxBid: parseFloat(proxyMaxBid) }, config);
      setIsProxyActive(true);
      setProxyMaxBid('');
      toast.success('Proxy bid activated!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to set proxy bid';
      setError(msg);
      toast.error(msg);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 font-bold">{message}</p>
      <button onClick={() => dispatch(fetchAuctionById(id))} className="px-6 py-2 bg-sky-600 rounded-lg">Try Again</button>
    </div>
  );
  if (!auction) return <div className="min-h-screen flex items-center justify-center">Auction not found</div>;

  const isWinner = auction.highestBidder?._id === user?.id;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Gallery & Details */}
      <div className="lg:col-span-2 space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-video glass rounded-3xl overflow-hidden border border-white/10"
        >
          <img 
            src={auction.images?.[0] || 'https://images.unsplash.com/photo-1549462111-9860263f35f1?q=80&w=1200&auto=format&fit=crop'} 
            className="w-full h-full object-cover"
            alt={auction.title}
          />
        </motion.div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4" /> Authenticated Asset
          </div>
          <h1 className="text-4xl font-bold mb-6">{auction.title}</h1>
          <p className="text-slate-400 leading-relaxed mb-8">{auction.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Category</p>
              <p className="font-semibold">{auction.category}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Seller</p>
              <p className="font-semibold">@{auction.seller?.username}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Starting Bid</p>
              <p className="font-semibold">${auction.startingBid}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Increment</p>
              <p className="font-semibold">${auction.minIncrement}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Bidding Controls */}
      <div className="space-y-6">
        {/* Status Card */}
        <div className={`glass-card p-6 border-white/10 ${isEnded ? 'bg-green-600/5' : 'bg-sky-600/5'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center gap-2 font-bold uppercase text-xs tracking-tighter ${isEnded ? 'text-green-400' : 'text-sky-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isEnded ? 'bg-green-400' : 'bg-sky-400 animate-ping'}`} />
              {isEnded ? 'Auction Ended' : 'Live Bidding'}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Clock className="w-4 h-4" />
              <CountdownTimer targetDate={auction.endTime} onEnd={handleTimerEnd} />
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-slate-400 text-xs uppercase font-bold mb-2">{isEnded ? 'Final Price' : 'Highest Bid'}</p>
            <AnimatePresence mode="wait">
              <motion.p 
                key={auction.currentBid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-black gradient-text"
              >
                ${auction.currentBid?.toLocaleString()}
              </motion.p>
            </AnimatePresence>
            <div className="flex items-center justify-center gap-2 mt-2">
               {isEnded && isWinner && <Trophy className="w-4 h-4 text-yellow-400" />}
               <p className="text-xs text-slate-500">
                {isEnded ? 'Winner:' : 'Highest Bidder:'} <span className={`font-bold ${isWinner ? 'text-yellow-400' : 'text-sky-400'}`}>{auction.highestBidder?.username || 'None'}</span>
              </p>
            </div>
          </div>

          {!isEnded ? (
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: $${auction.currentBid + (auction.minIncrement || 10)}`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>
              <button className="w-full bg-sky-600 hover:bg-sky-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-sky-900/40">
                Place Manual Bid
              </button>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </form>
          ) : (
            isWinner ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-center">
                  <p className="text-yellow-400 text-sm font-bold">Congratulations! You won the auction!</p>
                </div>
                <button 
                  onClick={() => navigate(`/payment/${id}`)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-900/20"
                >
                  <CreditCard className="w-5 h-5" /> PAY NOW & CLAIM ITEM
                </button>
              </motion.div>
            ) : (
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-slate-500 text-sm italic">Auction has concluded.</p>
              </div>
            )
          )}
        </div>

        {/* Proxy Bid Card (Only if not ended) */}
        {!isEnded && (
          <div className="glass-card p-6 border-purple-500/20 bg-purple-600/5">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-xs mb-4">
              <Zap className="w-4 h-4" /> Smart Proxy Bidding
            </div>
            <p className="text-slate-400 text-[10px] mb-4">Set your maximum price. Our system will outbid others automatically.</p>
            
            <form onSubmit={handleSetProxy} className="flex gap-2">
              <input 
                type="number"
                value={proxyMaxBid}
                onChange={(e) => setProxyMaxBid(e.target.value)}
                placeholder="Your max limit"
                className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none"
              />
              <button className="bg-purple-600 hover:bg-purple-500 px-4 rounded-xl font-bold text-sm">
                Set
              </button>
            </form>
          </div>
        )}

        {/* Bid History */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 font-bold text-sm mb-6 uppercase tracking-wider text-slate-500">
            <History className="w-4 h-4" /> Recent Bids
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {bidHistory.length === 0 ? <p className="text-[10px] text-slate-500 italic">No bids yet</p> :
              bidHistory.map((bid, i) => (
                <div key={bid._id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">@{bid.bidder?.username}</span>
                    {bid.isProxy && <span className="bg-purple-900/50 text-purple-400 px-1.5 rounded text-[8px]">Proxy</span>}
                  </div>
                  <span className="font-bold text-white">${bid.amount?.toLocaleString()}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;
