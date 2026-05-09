import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'bidder' 
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
    return () => dispatch(reset());
  }, [user, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-slate-400 text-sm">Join the world's most exclusive auction network.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                name="username"
                required
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="CollectorName"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                name="email"
                type="email"
                required
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="collector@luxe.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                name="password"
                type="password"
                required
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">I want to:</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'bidder'})}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.role === 'bidder' ? 'bg-sky-600/20 border-sky-500 text-sky-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                Bid on Items
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'seller'})}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${formData.role === 'seller' ? 'bg-sky-600/20 border-sky-500 text-sky-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                Sell Items
              </button>
            </div>
          </div>

          {isError && <p className="text-red-400 text-xs text-center">{message}</p>}

          <button 
            disabled={isLoading}
            className="w-full bg-sky-600 hover:bg-sky-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-sky-900/40 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : 'Create Account'}
            <ShieldCheck className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already a member? <Link to="/login" className="text-sky-400 hover:underline font-semibold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
