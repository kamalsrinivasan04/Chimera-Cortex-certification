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
      <h1 className="text-2xl font-bold text-slate-950 tracking-wide border-b border-slate-200 pb-3 flex items-center space-x-2">
        <User className="w-6 h-6 text-primary-500" />
        <span>My Account Profile</span>
      </h1>

      {/* User Info Details card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl -z-10"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name</span>
              <div className="text-lg font-bold text-slate-950 mt-1 flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>{user.name}</span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
              <div className="text-sm font-semibold text-slate-700 mt-1 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Rights</span>
              <div className="text-sm font-semibold text-slate-700 mt-1 flex items-center space-x-2">
                {user.role === 'admin' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span className="text-red-600 font-bold uppercase tracking-wider">Administrator</span>
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
              <div className="text-sm font-semibold text-green-700 mt-1 flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <span>Active Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications collection list */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950 flex items-center space-x-2 border-b border-slate-200 pb-3">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Earned Certifications ({certs.length})</span>
        </h2>

        {certs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/60">
            <p className="text-sm text-slate-600">You haven't earned any verified credentials yet.</p>
            <p className="text-[10px] text-slate-600 mt-1">Complete an assessment attempt successfully to showcase here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c) => (
              <div
                key={c._id}
                className="bg-slate-50 border border-slate-200 hover:border-primary-200 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">
                    {c.level} Certified
                  </span>
                  <h3 className="text-sm font-bold text-slate-950 leading-snug">{c.certificationName}</h3>
                  <div className="text-[10px] font-mono text-slate-500">Certificate ID: {c.certificateId}</div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-xs">
                  <span className="text-slate-600 font-medium">Score: {c.score}%</span>
                  <Link
                    to={`/results/${c.assessmentId}`}
                    className="text-primary-600 hover:underline flex items-center space-x-0.5 font-bold"
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
