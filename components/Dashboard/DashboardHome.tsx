
import React from 'react';
import { 
  Users, 
  MousePointer2, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Activity, 
  Calendar,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { FormConfig, FormEntry } from '../../types';

interface Props {
  form: FormConfig;
  entries: FormEntry[];
  onNavigate: (tab: 'build' | 'preview' | 'entries' | 'analytics' | 'settings') => void;
}

const DashboardHome: React.FC<Props> = ({ form, entries, onNavigate }) => {
  const recentEntries = entries.slice(0, 5);
  const totalEntries = entries.length;
  
  const stats = [
    { label: 'Total Views', value: '1,284', icon: <MousePointer2 size={20} />, color: 'bg-indigo-500', trend: '+5.4%' },
    { label: 'Entries', value: totalEntries, icon: <Users size={20} />, color: 'bg-emerald-500', trend: '+12%' },
    { label: 'Conversion Rate', value: totalEntries > 0 ? `${((totalEntries / 1284) * 100).toFixed(1)}%` : '0%', icon: <TrendingUp size={20} />, color: 'bg-indigo-600', trend: '+1.2%' },
    { label: 'Avg. Completion', value: '2m 14s', icon: <Clock size={20} />, color: 'bg-amber-500', trend: '-15s' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Form Overview</h2>
            <p className="text-slate-500 font-medium mt-1">Status and performance for <span className="text-indigo-600 font-bold">"{form.title}"</span></p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${form.status === 'inactive' ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'}`}></div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-600">{form.status || 'Active'}</span>
             </div>
             <button 
                onClick={() => onNavigate('preview')}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2"
              >
                Launch Preview <ArrowUpRight size={14} />
              </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.color} text-white rounded-2xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Recent Submissions
              </h3>
              <button onClick={() => onNavigate('entries')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group">
                View all entries <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="p-0">
              {entries.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <AlertCircle size={32} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium">No submissions yet. Share your form to start collecting data.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="p-6 hover:bg-slate-50/80 transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {entry.id.slice(-2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">Submission #{entry.id.slice(-6)}</p>
                          <div className="flex items-center gap-3 mt-1">
                             <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                <Calendar size={10} /> {new Date(entry.submittedAt).toLocaleDateString()}
                             </span>
                             <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                <Zap size={10} /> {entry.ip}
                             </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => onNavigate('entries')}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white border border-slate-200 rounded-xl transition-all shadow-sm"
                      >
                        <ArrowRight size={16} className="text-slate-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black text-slate-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate('build')}
                  className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl flex items-center gap-4 transition-all group"
                >
                  <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:text-indigo-600 transition-colors">
                    <Zap size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Edit Form Layout</span>
                </button>
                <button 
                  onClick={() => onNavigate('settings')}
                  className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl flex items-center gap-4 transition-all group"
                >
                  <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:text-indigo-600 transition-colors">
                    <AlertCircle size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Manage Email Routing</span>
                </button>
                <button 
                  onClick={() => onNavigate('analytics')}
                  className="w-full p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl flex items-center gap-4 transition-all group"
                >
                  <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:text-indigo-600 transition-colors">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Performance Report</span>
                </button>
              </div>
            </div>

            <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-lg font-black mb-2">Eagle Form Pro</h4>
                  <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                    Unlock advanced conditional pricing, file auto-sync, and biometric signature verification.
                  </p>
                  <button className="mt-6 w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                    Upgrade Workspace
                  </button>
               </div>
               <CheckCircle size={120} className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700" />
            </div>
          </div>
        </div>

        {/* Global Activity Feed Mockup */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
           <h3 className="text-xl font-black text-slate-800 mb-6">Form Configuration Score</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                 <div className="p-3 bg-white rounded-2xl text-emerald-500 shadow-sm"><CheckCircle size={24} /></div>
                 <div>
                    <span className="block text-sm font-black text-emerald-900">WCAG Compliant</span>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Level AA Passed</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                 <div className="p-3 bg-white rounded-2xl text-indigo-500 shadow-sm"><CheckCircle size={24} /></div>
                 <div>
                    <span className="block text-sm font-black text-indigo-900">Responsive Ready</span>
                    <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest">Fluid Engine Active</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-200">
                 <div className="p-3 bg-white rounded-2xl text-slate-400 shadow-sm"><Zap size={24} /></div>
                 <div>
                    <span className="block text-sm font-black text-slate-900">Rest API Ready</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">V2 Endpoint Valid</span>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;
