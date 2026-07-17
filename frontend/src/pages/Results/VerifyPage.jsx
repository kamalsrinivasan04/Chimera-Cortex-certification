import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Common/Loader';
import { ShieldCheck, ShieldAlert, Award, Calendar, ExternalLink } from 'lucide-react';

const VerifyPage = () => {
  const { hash } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const { data } = await axios.get(`/api/certificates/verify/${hash}`);
        setVerification(data);
      } catch (err) {
        console.error(err);
        setVerification({ verified: false, message: 'Verification link invalid or expired.' });
      } finally {
        setLoading(false);
      }
    };
    checkVerification();
  }, [hash]);

  if (loading) return <Loader message="Validating digital signature authenticity..." fullScreen />;

  const isVerified = verification?.verified;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className={`max-w-md w-full bg-slate-900 border p-8 rounded-2xl shadow-2xl text-center space-y-6 relative overflow-hidden
        ${isVerified ? 'border-green-800' : 'border-red-800'}`}
      >
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -z-10
          ${isVerified ? 'bg-green-600/10' : 'bg-red-600/10'}`}
        ></div>

        {isVerified ? (
          <>
            <ShieldCheck className="w-16 h-16 text-green-400 mx-auto animate-pulse" />
            <div className="space-y-1">
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest block">Signature Validated</span>
              <h2 className="text-xl font-extrabold text-white">Authentic Certificate</h2>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl text-left text-xs space-y-3">
              <div>
                <span className="block text-slate-500 font-bold uppercase">Recipient</span>
                <span className="text-sm font-bold text-white">{verification.certificate.name}</span>
              </div>
              
              <div>
                <span className="block text-slate-500 font-bold uppercase">Certification Earned</span>
                <span className="text-sm font-bold text-primary-400">
                  {verification.certificate.certificationName} ({verification.certificate.level})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-slate-500 font-bold uppercase">Assessment Score</span>
                  <span className="text-sm font-bold text-green-400">{verification.certificate.score}%</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-bold uppercase">Issuance Date</span>
                  <span className="text-sm font-semibold text-slate-300">
                    {new Date(verification.certificate.issueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-slate-500 font-bold uppercase">Credential ID</span>
                <span className="text-xs font-mono text-slate-400 select-all">{verification.certificate.certificateId}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic">
              This credential has been digitally signed and registered on our AI-powered certification database authority.
            </p>
          </>
        ) : (
          <>
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
            <div className="space-y-1">
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block">Signature Invalid</span>
              <h2 className="text-xl font-extrabold text-white">Verification Failed</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {verification?.message || 'The signature hash code is invalid. This certificate has not been authenticated.'}
            </p>
          </>
        )}

        <div className="pt-4 border-t border-slate-800">
          <Link
            to="/login"
            className="text-xs font-bold text-primary-400 hover:underline flex items-center justify-center space-x-1"
          >
            <span>Visit AI Certify Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifyPage;
