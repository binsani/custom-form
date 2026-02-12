
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { FormEntry, FormConfig } from '../../types';
import { Users, TrendingUp, Clock, MousePointer2 } from 'lucide-react';

interface Props {
  entries: FormEntry[];
  form: FormConfig;
}

const Analytics: React.FC<Props> = ({ entries, form }) => {
  // Mock data generation for demo purposes
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

  const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe'];

  const stats = [
    { label: 'Total Submissions', value: entries.length || 0, icon: <Users className="text-indigo-600" />, trend: '+12.5%' },
    { label: 'Conversion Rate', value: '3.2%', icon: <TrendingUp className="text-emerald-600" />, trend: '+2.1%' },
    { label: 'Avg. Completion Time', value: '1m 24s', icon: <Clock className="text-amber-600" />, trend: '-10s' },
    { label: 'Abandonment Rate', value: '42%', icon: <MousePointer2 className="text-rose-600" />, trend: '-5%' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Form Analytics</h2>
          <p className="text-slate-500">Real-time performance metrics for {form.title}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  {stat.icon}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Submission Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={submissionsByDay}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Device Usage</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
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
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-sm font-medium text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partial Entries Alert */}
        <div className="bg-indigo-600 rounded-3xl p-8 flex items-center justify-between text-white shadow-xl shadow-indigo-100 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">You have 12 partial entries!</h3>
            <p className="text-indigo-100 max-w-md">Our Partial Entries tool captured data from users who started but didn't finish. You can reach out to them to boost conversions.</p>
            <button className="mt-6 px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              View Abandoned Forms
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>
          <TrendingUp size={180} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
