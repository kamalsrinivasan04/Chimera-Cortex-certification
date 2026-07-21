import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, LogOut, User, LayoutDashboard } from 'lucide-react';
import chimeraEmblem from '../../assets/Chimera Technologies Emblem.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-transparent px-4 pt-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto rounded-[28px] border border-white/70 bg-white/95 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-slate-900 hover:opacity-90 transition-opacity">
            <img
              src={chimeraEmblem}
              alt="Chimera Technologies emblem"
              className="w-9 h-9 object-contain shrink-0"
            />
            <span className="flex flex-col leading-none">
              <span className="font-bold text-lg tracking-wider text-slate-900">
                C<sup>3</sup>AB Certify
              </span>
              <span className="text-[10px] uppercase tracking-[0.32em] text-slate-500 mt-1">
                Chimera Cortex Certification
              </span>
            </span>
          </Link>

          {/* Nav Items */}
          {user ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <div className="border-l border-slate-200 h-6"></div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-700">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full border border-[#ff8b4d] bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] text-white shadow-[0_10px_24px_rgba(255,106,31,0.22)] transition-all hover:from-[#ff4a03] hover:to-[#d63d04] hover:shadow-[0_12px_28px_rgba(255,106,31,0.28)]"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
