
import React, { useState } from 'react';
import { LayoutGrid, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  onLogin: (fileNumber: string, password: string) => boolean;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [fileNumber, setFileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Verification logic
    setTimeout(() => {
      const success = onLogin(fileNumber, password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/10">
          <div className="p-10">
            {/* Branding */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="bg-red-600 p-2.5 rounded-2xl text-white shadow-lg shadow-red-500/30">
                <LayoutGrid size={28} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                <span className="text-red-600">Eagle</span> Form
              </h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-100 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-bold animate-in shake duration-300">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">File Number</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all placeholder:text-slate-300 disabled:opacity-50"
                    placeholder="Enter file number"
                    value={fileNumber}
                    onChange={(e) => setFileNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-50 transition-all placeholder:text-slate-300 disabled:opacity-50"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
