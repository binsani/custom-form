
import React from 'react';
import { 
  LayoutGrid, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  MousePointer2, 
  Smartphone, 
  FileText, 
  Layers,
  BarChart3,
  ShieldAlert,
  Gavel
} from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<Props> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-red-100 selection:text-red-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-200">
              <LayoutGrid size={24} />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">EFCC Eagle <span className="text-red-600">Form</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <ShieldAlert size={14} className="text-red-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Portal | Not for Commercial Use</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLogin}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-red-200 hover:bg-red-700 hover:-translate-y-0.5 transition-all"
            >
              Investigative Entry
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-red-600">Secure Federal Infrastructure</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Investigative Intelligence. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Advanced Collection.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-900">
            Streamlining data capture for the Economic and Financial Crimes Commission. A secure environment for official investigative reports and evidence gathering.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Access Official Builder <ArrowRight size={20} />
            </button>
            <div className="flex items-center gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
               <ShieldCheck size={20} className="text-emerald-500" /> End-to-End Encrypted
            </div>
          </div>

          {/* Product Mockup */}
          <div className="relative max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute inset-0 bg-red-600/5 blur-[120px] rounded-full -z-10"></div>
            <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-800">
               <div className="bg-slate-50 rounded-2xl aspect-[16/9] overflow-hidden flex">
                  {/* Mock Sidebar */}
                  <div className="w-1/4 h-full bg-white border-r border-slate-200 p-4 space-y-4 hidden md:block">
                     <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
                     <div className="grid grid-cols-2 gap-2">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-slate-50 border border-slate-100 rounded-lg"></div>)}
                     </div>
                  </div>
                  {/* Mock Canvas */}
                  <div className="flex-1 h-full p-8 flex flex-col items-center">
                     <div className="w-full max-w-md space-y-6">
                        <div className="flex items-center justify-center gap-2 mb-4">
                           <ShieldCheck size={16} className="text-red-600" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">EFCC-SEC-PORTAL</span>
                        </div>
                        <div className="h-8 w-2/3 bg-white rounded-lg shadow-sm border border-slate-200 mx-auto"></div>
                        <div className="h-3 w-full bg-slate-200 rounded opacity-50"></div>
                        <div className="space-y-4 pt-10">
                           <div className="h-12 w-full bg-white rounded-xl border-2 border-red-200 shadow-lg shadow-red-50"></div>
                           <div className="h-12 w-full bg-white rounded-xl border border-slate-200"></div>
                           <div className="h-32 w-full bg-white rounded-xl border border-slate-200"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {/* Floaties */}
            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden lg:block animate-bounce duration-[5s]">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Gavel size={24} /></div>
                  <div>
                    <p className="text-sm font-black">Legal Compliance</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Evidence Standard A1</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warning/Status Section */}
      <section className="py-12 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Official Use Warning</h3>
            <p className="mt-2 text-red-100 font-medium text-xs">This software is the property of the Economic and Financial Crimes Commission. Commercial redistribution is strictly prohibited and punishable by law.</p>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tight mb-8">Secure Evidence Collection.</h2>
          <p className="text-slate-400 text-xl font-medium mb-12">Authorized EFCC personnel only. Enter the secure building environment.</p>
          <button 
            onClick={onGetStarted}
            className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-red-700 hover:scale-105 hover:-translate-y-1 transition-all active:scale-95"
          >
            Authorized Login
          </button>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-red-600 p-2 rounded-xl text-white">
              <LayoutGrid size={20} />
            </div>
            <span className="text-lg font-black tracking-tight uppercase">EFCC Eagle <span className="text-red-600">Form</span></span>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">© 2025 Economic and Financial Crimes Commission. Official Investigative Asset.</p>
        <p className="text-red-500 text-[9px] font-black uppercase tracking-[0.1em] mt-2">NOT FOR COMMERCIAL USE</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group">
    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-4 text-slate-800">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
