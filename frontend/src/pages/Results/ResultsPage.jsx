import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/Common/Loader';
import { PerformanceCharts } from '../../components/Charts/PerformanceCharts';
import { CertificatePreview } from '../../components/Certificate/CertificatePreview';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, ChevronRight, AlertCircle, Compass } from 'lucide-react';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/api/reports/assessment/${id}`);
        setReport(data);

        // Fetch certificate if passed
        if (data.passFail === 'Pass') {
          // Find certificates and look for this assessment ID
          const certRes = await api.get('/api/certificates/my-certificates');
          const myCert = certRes.data.find(c => c.assessmentId === id);
          if (myCert) {
            setCertificate(myCert);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load evaluation results.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!certificate || downloading) return;

    try {
      setDownloading(true);

      const response = await api.get(`/api/certificates/${certificate._id}/download`, {
        responseType: 'blob',
      });

      const file = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(file);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = `Certification_${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      console.error('Failed to download certificate PDF', downloadError);
      setError('Failed to download the certificate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) return <Loader message="Analyzing performance indicators..." fullScreen />;
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-4 shadow-[0_20px_60px_-32px_rgba(17,17,17,0.24)]">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-950">Error Loading Results</h3>
        <p className="text-xs text-slate-600">{error}</p>
        <button
          onClick={handleBackToDashboard}
          className="w-full py-2 bg-slate-950 border border-slate-950 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isPassed = report.passFail === 'Pass';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. REPORT HERO CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-[0_20px_60px_-32px_rgba(17,17,17,0.24)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {isPassed ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span>Certification Verified</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-3 py-1 bg-red-950/20 border border-red-800 text-red-400 text-xs font-bold rounded-full">
                <XCircle className="w-4 h-4" />
                <span>Unsuccessful Attempt</span>
              </span>
            )}
            <span className="text-xs text-slate-600">Completed evaluation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 leading-tight">
            Assessment Evaluation Report
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            {report.performanceSummary}
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex items-center space-x-6 shrink-0">
          <div className="text-center">
            <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">Overall Mark</span>
            <span className={`text-4xl sm:text-5xl font-black ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
              {report.overallScore}%
            </span>
          </div>
          <div className="border-l border-slate-200 h-12"></div>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500 hover:underline"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1.5. CERTIFICATE PREVIEW (ON TOP IF PASSED) */}
      {isPassed && certificate && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-950 tracking-wide border-b border-slate-200 pb-2">Official Certification Certificate</h2>
          <CertificatePreview certificate={certificate} onDownload={handleDownloadPDF} />
        </div>
      )}

      {/* 2. RECHARTS METRICS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-950 tracking-wide border-b border-slate-200 pb-2">Quantitative Metrics</h2>
        <PerformanceCharts reportData={report} />
      </div>

      {/* 3. STRENGTHS, WEAKNESSES, SKILL GAPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Strengths & Weaknesses */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-950 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span>Identified Strengths</span>
            </h3>
            <ul className="space-y-3">
              {report.strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start space-x-2">
                  <ChevronRight className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-950 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span>Improvement Areas</span>
            </h3>
            <ul className="space-y-3">
              {report.weaknesses.map((weak, idx) => (
                <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start space-x-2">
                  <ChevronRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skill Gap Matrix Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-950 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary-500" />
            <span>Skill Gap Analysis Matrix</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead>
                <tr className="text-slate-500 font-bold uppercase tracking-wider text-left">
                  <th className="pb-3 pr-4">Identified Skill</th>
                  <th className="pb-3 px-4">Gap Status</th>
                  <th className="pb-3 pl-4">Recommended Remediation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {report.skillGapAnalysis.map((gap, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 pr-4 font-semibold text-slate-950">{gap.skill}</td>
                    <td className="py-3.5 px-4">
                      {gap.gap === 'No Gap' && (
                        <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full font-bold leading-none text-[11px] min-w-[92px]">
                          No Gap
                        </span>
                      )}
                      {gap.gap === 'Minor Gap' && (
                        <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full font-bold leading-none text-[11px] min-w-[92px]">
                          Minor Gap
                        </span>
                      )}
                      {gap.gap === 'Major Gap' && (
                        <span className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded-full font-bold leading-none text-[11px] min-w-[92px]">
                          Major Gap
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pl-4 text-slate-600 leading-relaxed">{gap.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 4. SUGGESTED STUDY PATHWAY (IF FAILED) */}
      {!isPassed && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-950 tracking-wide border-b border-slate-200 pb-2">Next Steps & Study Schedule</h2>
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 text-primary-600">
              <Compass className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold">Remediation & Suggested Study Schedule</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              You did not meet the 70% passing threshold for this attempt. Don't worry—here is a customized study path generated by our AI Assessor Agent based on your weak areas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.learningSuggestions.map((sug, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-semibold text-slate-950 border-b border-slate-200 pb-2">{sug.topic}</h4>
                  <ul className="space-y-2">
                    {sug.resources.map((res, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-600 flex items-start space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></span>
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-xs text-slate-600">
                Suggested Retry Period: <span className="font-semibold text-slate-900">Next attempt available immediately.</span>
              </div>
              <button
                onClick={() => navigate('/assessment')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#ff6a1f] to-[#ff4a03] hover:from-[#ff4a03] hover:to-[#d63d04] text-white font-bold rounded-xl text-xs transition-colors active:scale-95"
              >
                Start New Assessment Attempt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResultsPage;
