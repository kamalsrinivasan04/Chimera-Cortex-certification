import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/Common/Loader';
import { Award, Plus, Calendar, CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const { data } = await api.get('/api/assessments/history');
        setAttempts(data);
      } catch (err) {
        console.error('Failed to retrieve assessment logs', err);
        setError('Could not load historical attempts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const handleStartNewAssessment = () => {
    navigate('/assessment');
  };

  if (loading) return <Loader message="Loading dashboard statistics..." fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Upper header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Hello, {user.name}!</h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Welcome to the AI Adaptive Assessment portal. Track your dynamic skill verifications, view detailed evaluations, and download verified credentials.
          </p>
        </div>

        <button
          onClick={handleStartNewAssessment}
          className="mt-6 sm:mt-0 flex items-center space-x-2 px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-primary-600/10 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Start Assessment</span>
        </button>
      </div>

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Attempts Table (Left/Center col span-2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary-500" />
              <span>Assessment History</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-md">
              {attempts.length} Attempt{attempts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {error && (
            <div className="flex items-center space-x-2 bg-red-950/20 border border-red-800 text-red-400 text-xs py-2 px-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {attempts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-4">
              <p className="text-sm text-slate-500">You haven't attempted any certification assessments yet.</p>
              <button
                onClick={handleStartNewAssessment}
                className="text-xs text-primary-400 font-semibold hover:underline flex items-center space-x-1 mx-auto"
              >
                <span>Click here to launch your first exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead>
                  <tr className="text-slate-500 font-semibold text-xs uppercase tracking-wider text-left">
                    <th className="pb-3 pr-4">Profile Details</th>
                    <th className="pb-3 px-4">Attempt Date</th>
                    <th className="pb-3 px-4 text-center">Status</th>
                    <th className="pb-3 px-4 text-right">Result Score</th>
                    <th className="pb-3 pl-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {attempts.map((att) => {
                    const isTerminated = att.status === 'terminated';
                    const isActive = att.status === 'active';
                    const isCompleted = att.status === 'completed';
                    
                    return (
                      <tr key={att._id} className="hover:bg-slate-850/30 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-semibold text-white">{att.profile.jobRole}</div>
                          <div className="text-xs text-slate-500">{att.profile.certificationLevel} Level</div>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{new Date(att.createdAt).toLocaleDateString()}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isTerminated && (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 bg-red-950/20 border border-red-900/50 text-red-400 rounded-full">
                              <XCircle className="w-3 h-3" />
                              <span>Terminated</span>
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 bg-yellow-950/20 border border-yellow-900/50 text-yellow-400 rounded-full animate-pulse">
                              <AlertCircle className="w-3 h-3" />
                              <span>In Progress</span>
                            </span>
                          )}
                          {isCompleted && (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 bg-green-950/20 border border-green-900/50 text-green-400 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completed</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold">
                          {isCompleted && att.score !== null ? (
                            <span className={att.score >= 70 ? 'text-green-400' : 'text-red-400'}>
                              {att.score}%
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-4 pl-4 text-xs">
                          {isCompleted && (
                            <Link
                              to={`/results/${att._id}`}
                              className="text-primary-400 font-bold hover:text-primary-300 hover:underline flex items-center space-x-0.5"
                            >
                              <span>View Report</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          {isActive && (
                            <Link
                              to={`/assessment?resume=${att._id}`}
                              className="text-yellow-400 font-bold hover:text-yellow-300 hover:underline flex items-center space-x-0.5"
                            >
                              <span>Resume</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          {isTerminated && (
                            <span className="text-slate-600 select-none">Disqualified</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Credentials list (Right Column) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>Earned Credentials</span>
          </h2>
          
          <div className="space-y-4">
            {attempts.filter(a => a.status === 'completed' && a.score >= 70).length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
                <p className="text-xs text-slate-500">No active certifications yet.</p>
                <p className="text-[10px] text-slate-600 mt-1">Pass an assessment with &gt;= 70% score to generate.</p>
              </div>
            ) : (
              attempts.filter(a => a.status === 'completed' && a.score >= 70).map((att) => (
                <div
                  key={att._id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between space-y-4 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary-500 tracking-wider">
                      {att.profile.certificationLevel} Certified
                    </span>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {att.profile.jobRole} Professional
                    </h3>
                    <div className="text-[10px] font-mono text-slate-500">ID: {att.certificateId || 'CERT-GENERATING'}</div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                    <span className="text-xs text-slate-400 font-semibold">Grade: {att.score}%</span>
                    <Link
                      to={`/results/${att._id}`}
                      className="text-xs font-bold text-primary-400 hover:underline"
                    >
                      Verify & Download
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
