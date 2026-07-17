import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const PerformanceCharts = ({ reportData }) => {
  const { topicWiseScore = [], questionTypeWiseScore = [], overallScore = 0 } = reportData;

  // 1. Radar Chart Data
  const radarData = topicWiseScore.map((t) => ({
    subject: t.topic,
    Score: t.score,
    fullMark: 100,
  }));

  // 2. Bar Chart Data
  const barData = questionTypeWiseScore.map((q) => ({
    name: q.questionType,
    Score: q.score,
  }));

  // 3. Pie Chart Data: score vs remaining
  const pieData = [
    { name: 'Scored', value: overallScore, color: '#3b82f6' },
    { name: 'Missed', value: Math.max(0, 100 - overallScore), color: '#1e293b' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
      {/* Radar Chart: Topic distribution */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 self-start">Topic Competence Analysis</h3>
        <div className="w-full h-64">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="Candidate Score" dataKey="Score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">No topic details logged.</div>
          )}
        </div>
      </div>

      {/* Bar Chart: Question Type Performance */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 self-start">Performance by Question Type</h3>
        <div className="w-full h-64">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
                <Bar dataKey="Score" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Score >= 70 ? '#3b82f6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">No question performance logged.</div>
          )}
        </div>
      </div>

      {/* Pie Chart: Overall breakdown */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 self-start">Overall Score Share</h3>
        <div className="w-full h-64 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <span className="text-3xl font-extrabold text-white">{overallScore}%</span>
            <span className="block text-xs text-slate-500 uppercase tracking-wider mt-0.5">Total Mark</span>
          </div>
        </div>
      </div>

      {/* Summary card with progress indicators */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Passing Analysis</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-400">
              <span>Required Pass Score</span>
              <span>70%</span>
            </div>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-yellow-600 h-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-400">
              <span>Your Achieved Score</span>
              <span className={overallScore >= 70 ? 'text-green-400' : 'text-red-400'}>{overallScore}%</span>
            </div>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full ${overallScore >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between
          ${overallScore >= 70 
            ? 'bg-green-950/20 border-green-800 text-green-400' 
            : 'bg-red-950/20 border-red-800 text-red-400'}`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider block">Verdict</span>
            <span className="text-lg font-bold">{overallScore >= 70 ? 'Passed & Certified' : 'Attempt Unsuccessful'}</span>
          </div>
          <div className="text-2xl font-black">
            {overallScore >= 70 ? 'PASS' : 'FAIL'}
          </div>
        </div>
      </div>
    </div>
  );
};
