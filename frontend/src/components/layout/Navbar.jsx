import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import * as Icons from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold gradient-text">
        {Icons.Gavel && <Icons.Gavel className="w-8 h-8 text-sky-400" />}
        <span>LuxeAuction</span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-sky-400 transition-colors text-sm font-medium">Browse</Link>
        
        {user ? (
          <>
            <div className="flex items-center gap-4 border-r border-white/10 pr-4">
              {user.role === 'seller' && (
                <Link to="/create-auction" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors text-sm">
                  {Icons.PlusCircle && <Icons.PlusCircle className="w-4 h-4" />} List Item
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors text-sm">
                  {Icons.Shield && <Icons.Shield className="w-4 h-4" />} Admin
                </Link>
              )}
              <Link to="/notifications" className="relative p-2 hover:bg-white/5 rounded-full transition-colors group">
                {Icons.Bell && <Icons.Bell className="w-5 h-5 text-slate-400 group-hover:text-sky-400" />}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-sky-400 transition-colors text-sm font-semibold">
                {Icons.LayoutDashboard && <Icons.LayoutDashboard className="w-4 h-4" />} Dashboard
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-xs uppercase">
                  {user.username?.[0] || 'U'}
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-red-400">
                  {Icons.LogOut && <Icons.LogOut className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-sky-400 transition-colors">Login</Link>
            <Link to="/register" className="bg-sky-600 hover:bg-sky-500 px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-sky-900/20">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
