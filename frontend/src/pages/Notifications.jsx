import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, CheckCircle, Clock, AlertCircle, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('http://localhost:5000/api/users/notifications', config)
      .then(res => {
        setNotifications(res.data.data);
        setLoading(false);
      });
  }, [token]);

  const markRead = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.put(`http://localhost:5000/api/users/notifications/${id}`, {}, config);
    setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'outbid': return <AlertCircle className="text-red-400" />;
      case 'auction_end': return <Clock className="text-purple-400" />;
      case 'payment_received': return <ShoppingCart className="text-green-400" />;
      default: return <Bell className="text-sky-400" />;
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 italic">Checking your alerts...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-slate-400 text-sm">Stay updated with your bidding activity.</p>
        </div>
        <button className="text-xs text-sky-400 font-bold uppercase tracking-wider hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div 
            key={n._id} 
            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${n.isRead ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/5 border-white/10 shadow-lg shadow-sky-900/5'}`}
          >
            <div className="p-2 bg-white/5 rounded-xl border border-white/10 mt-1">
              {getIcon(n.type)}
            </div>
            <div className="flex-grow">
              <p className={`text-sm mb-1 ${n.isRead ? 'text-slate-400' : 'text-white font-medium'}`}>{n.message}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                {formatDistanceToNow(new Date(n.createdAt))} ago
              </p>
            </div>
            {!n.isRead && (
              <button 
                onClick={() => markRead(n._id)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/10">
            <Bell className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 italic">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
