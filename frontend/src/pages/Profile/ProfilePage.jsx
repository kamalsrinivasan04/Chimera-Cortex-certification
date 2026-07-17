import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/Common/Loader';
import { User, Mail, Shield, ShieldAlert, Award, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const { data } = await api.get('/api/certificates/my-certificates');
        setCerts(data);
      } catch (err) {
        console.error('Failed to load certificates on profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  if (loading) return <Loader message="Loading profile data..." fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-white tracking-wide border-b border-slate-900 pb-3 flex items-center space-x-2">
        <User className="w-6 h-6 text-primary-500" />
        <span>My Account Profile</span>
      </h1>

      {/* User Info Details card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/5 rounded-full blur-2xl -z-10"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name</span>
              <div className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>{user.name}</span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
              <div className="text-sm font-semibold text-slate-300 mt-1 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Rights</span>
              <div className="text-sm font-semibold text-slate-300 mt-1 flex items-center space-x-2">
                {user.role === 'admin' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-bold uppercase tracking-wider">Administrator</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Standard Candidate</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
              <div className="text-sm font-semibold text-green-400 mt-1 flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span>Active Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications collection list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-950 pb-3">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Earned Certifications ({certs.length})</span>
        </h2>

        {certs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <p className="text-sm text-slate-500">You haven't earned any verified credentials yet.</p>
            <p className="text-[10px] text-slate-600 mt-1">Complete an assessment attempt successfully to showcase here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c) => (
              <div
                key={c._id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider">
                    {c.level} Certified
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug">{c.certificationName}</h3>
                  <div className="text-[10px] font-mono text-slate-500">Certificate ID: {c.certificateId}</div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-900 text-xs">
                  <span className="text-slate-400 font-medium">Score: {c.score}%</span>
                  <Link
                    to={`/results/${c.assessmentId}`}
                    className="text-primary-400 hover:underline flex items-center space-x-0.5 font-bold"
                  >
                    <span>View Performance</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;
