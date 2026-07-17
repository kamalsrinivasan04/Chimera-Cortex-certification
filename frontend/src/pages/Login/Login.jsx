import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, Mail, Lock, AlertCircle } from 'lucide-react';
import chimeraEmblem from '../../assets/Chimera Technologies Emblem.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-[0_20px_60px_-32px_rgba(17,17,17,0.28)] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/15 rounded-full blur-2xl -z-10"></div>
        
        {/* Head */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white border border-primary-200 rounded-xl flex items-center justify-center mb-3 shadow-sm overflow-hidden">
            <img src={chimeraEmblem} alt="Chimera Technologies" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">Welcome Back</h2>
          <p className="text-xs text-slate-600 mt-1">Sign in to access your assessment profile</p>
        </div>

        {/* Errors */}
        {error && (
          <div className="mb-4 flex items-center space-x-2 bg-red-50 border border-red-200 text-red-600 text-xs py-2.5 px-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-semibold rounded-xl text-sm transition-all shadow-[0_12px_28px_rgba(255,106,31,0.24)] focus:outline-none focus:ring-2 focus:ring-[#ffd0aa] focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#ff6a1f] hover:underline hover:text-[#ff4a03] font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
