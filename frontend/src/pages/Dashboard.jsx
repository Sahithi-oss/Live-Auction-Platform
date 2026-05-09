import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuctions } from '../redux/slices/auctionSlice';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Clock, DollarSign, Package, 
  ArrowUpRight, ShoppingBag, Trash2, ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { auctions } = useSelector((state) => state.auctions);
  const [myAuctions, setMyAuctions] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);

  useEffect(() => {
    dispatch(fetchAuctions());
    fetchSpecificData();
  }, [dispatch]);

  const fetchSpecificData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/auctions', config);
      const all = res.data.data;
      setMyAuctions(all.filter(a => a.seller._id === user.id));
      setWonAuctions(all.filter(a => (a.highestBidder === user.id || a.highestBidder?._id === user.id) && a.status === 'ended'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/auctions/${id}`, config);
      toast.success('Auction removed');
      setMyAuctions(prev => prev.filter(a => a._id !== id));
      dispatch(fetchAuctions());
    } catch (err) {
      toast.error('Failed to delete auction');
    }
  };

  const chartData = [
    { name: 'Mon', bids: 400 }, { name: 'Tue', bids: 300 },
    { name: 'Wed', bids: 600 }, { name: 'Thu', bids: 800 },
    { name: 'Fri', bids: 500 }, { name: 'Sat', bids: 900 },
    { name: 'Sun', bids: 700 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-slate-400">Welcome back, <span className="text-sky-400 font-semibold">{user.username}</span>.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active Listings', value: myAuctions.length, icon: Clock, color: 'text-sky-400' },
          { label: 'Bids Placed', value: '48', icon: TrendingUp, color: 'text-purple-400' },
          { label: 'Revenue', value: '$24,500', icon: DollarSign, color: 'text-green-400' },
          { label: 'Won Items', value: wonAuctions.length, icon: ShoppingBag, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 group">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color} mb-4 inline-block`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-lg font-bold mb-8">Activity Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="bids" stroke="#38bdf8" strokeWidth={3} fill="url(#colorBids)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
            Your Active Sales
            <Link to="/create-auction" className="text-xs text-sky-400 hover:underline">Add New</Link>
          </h3>
          <div className="space-y-4">
            {myAuctions.length === 0 ? <p className="text-slate-500 text-sm italic">No sales yet.</p> : 
              myAuctions.map(a => (
                <div key={a._id} className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={a.images?.[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <span className="text-sm font-bold line-clamp-1">{a.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/auction/${a._id}`}><ExternalLink className="w-4 h-4 text-slate-500" /></Link>
                    <button onClick={() => handleDelete(a._id)}><Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400" /></button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Won Auctions Section */}
      <div className="glass-card p-6 border-sky-500/20 bg-sky-500/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-sky-400" />
          Purchased Items (Ready for Payment)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wonAuctions.length === 0 ? <p className="text-slate-500 italic">No items won yet.</p> :
            wonAuctions.map(a => (
              <div key={a._id} className="p-5 bg-slate-900/50 rounded-2xl border border-white/5">
                <img src={a.images?.[0]} className="w-full h-32 rounded-xl object-cover mb-4" alt="" />
                <h4 className="font-bold mb-1">{a.title}</h4>
                <p className="text-sky-400 font-black mb-4">${a.currentBid?.toLocaleString()}</p>
                <Link 
                  to={`/payment/${a._id}`}
                  className="block w-full bg-sky-600 hover:bg-sky-500 py-3 rounded-xl text-center font-bold transition-all shadow-lg shadow-sky-900/40"
                >
                  Pay Now & Secure Escrow
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
