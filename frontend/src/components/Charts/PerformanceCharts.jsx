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

const PieShareTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {entry.name}
      </div>
      <div className="text-sm font-bold text-slate-950">
        {entry.value}%
      </div>
    </div>
  );
};

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
    { name: 'Scored', value: overallScore, color: '#ff6a1f' },
    { name: 'Missed', value: Math.max(0, 100 - overallScore), color: '#e7e7e7' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-8">
      {/* Radar Chart: Topic distribution */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950 mb-4 self-start">Topic Competence Analysis</h3>
        <div className="w-full h-64">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar name="Candidate Score" dataKey="Score" stroke="#ff6a1f" fill="#ff6a1f" fillOpacity={0.25} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">No topic details logged.</div>
          )}
        </div>
      </div>

      {/* Bar Chart: Question Type Performance */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950 mb-4 self-start">Performance by Question Type</h3>
        <div className="w-full h-64">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }} />
                <Bar dataKey="Score" fill="#ff6a1f" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Score >= 70 ? '#ff6a1f' : '#ef4444'} />
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
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950 mb-4 self-start">Overall Score Share</h3>
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
              <Tooltip
                content={<PieShareTooltip />}
                cursor={{ fill: 'rgba(255, 106, 31, 0.08)' }}
                offset={18}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ pointerEvents: 'none', zIndex: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <span className="text-3xl font-extrabold text-slate-950">{overallScore}%</span>
            <span className="block text-xs text-slate-500 uppercase tracking-wider mt-0.5">Total Mark</span>
          </div>
        </div>
      </div>

      {/* Summary card with progress indicators */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
        <h3 className="text-sm font-semibold text-slate-950 mb-4">Passing Analysis</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
              <span>Required Pass Score</span>
              <span>70%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div className="bg-yellow-600 h-full" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
              <span>Your Achieved Score</span>
              <span className={overallScore >= 70 ? 'text-green-700' : 'text-red-600'}>{overallScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full ${overallScore >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${overallScore}%` }}
              ></div>
            </div>
          </div>
        </div>

          <div className={`mt-6 p-4 rounded-xl border flex items-center justify-between
          ${overallScore >= 70 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-600'}`}
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
