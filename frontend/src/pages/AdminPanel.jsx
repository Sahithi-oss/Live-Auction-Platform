import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, Users, Gavel, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const AdminPanel = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get('http://localhost:5000/api/users', config),
      axios.get('http://localhost:5000/api/auctions')
    ]).then(([usersRes, auctionsRes]) => {
      setUsers(usersRes.data.data);
      setAuctions(auctionsRes.data.data);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <div className="p-10 text-center">Loading Admin Controls...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-slate-400">System-wide management and dispute resolution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" /> User Directory
          </h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center font-bold text-sky-400">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-[10px] text-slate-500">{user.email} • {user.role}</p>
                  </div>
                </div>
                <button className="text-xs text-red-400 hover:underline">Suspend</button>
              </div>
            ))}
          </div>
        </div>

        {/* Auction Oversight */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-purple-400" /> Auction Oversight
          </h3>
          <div className="space-y-4">
            {auctions.map(auction => (
              <div key={auction._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <img src={auction.images[0]} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">{auction.title}</p>
                    <p className="text-[10px] text-slate-500">Seller: {auction.seller?.username} • {auction.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-red-400"><XCircle className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-green-400"><CheckCircle className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
