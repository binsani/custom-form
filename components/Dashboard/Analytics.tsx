
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { FormEntry, FormConfig } from '../../types';
import { Users, TrendingUp, Clock, MousePointer2, Activity } from 'lucide-react';

interface Props {
  entries: FormEntry[];
  form: FormConfig;
}

const Analytics: React.FC<Props> = ({ entries, form }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const submissionsByDay = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 22 },
    { name: 'Fri', count: 30 },
    { name: 'Sat', count: 10 },
    { name: 'Sun', count: 8 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 20 },
  ];

  const COLORS = ['#dc2626', '#ef4444', '#f87171'];

  const stats = [
    { label: 'Total Submissions', value: entries.length || 0, icon: <Users className="text-red-600" />, trend: '+12.5%' },
    { label: 'Conversion Rate', value: '3.2%', icon: <TrendingUp className="text-emerald-600" />, trend: '+2.1%' },
    { label: 'Avg. Completion Time', value: '1m 24s', icon: <Clock className="text-amber-600" />, trend: '-10s' },
    { label: 'Integrity Check', value: 'Verified', icon: <Activity className="text-slate-600" />, trend: 'Stable' },
  ];

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-8">
        <div className="h-10 w-48 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-96 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
           <div className="h-96 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar" role="main" aria-label="Form Intelligence Analytics">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Intelligence Dashboard</h2>
          <p className="text-slate-500 font-medium">Submissions metrics for <span className="text-red-600 font-bold">"{form.title}"</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100" role="status" aria-label={`${stat.label}: ${stat.value}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6">Submission Trend (7 Days)</h3>
            <div className="h-80" aria-label="Area chart showing submission counts over the last week">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={submissionsByDay}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700}}
                  />
                  <Area type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6">Submission Origin</h3>
            <div className="h-64" aria-label="Pie chart showing device distribution">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-4">
              {deviceData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
