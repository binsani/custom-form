
import React, { useState } from 'react';
import { FormConfig, FormEntry } from '../../types';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  Database, 
  FileText, 
  Calendar,
  LayoutGrid,
  ChevronRight,
  TrendingUp,
  Activity,
  Copy,
  Download,
  Upload
} from 'lucide-react';

interface Props {
  forms: FormConfig[];
  entries: FormEntry[];
  onSelectForm: (id: string) => void;
  onCreateForm: () => void;
  onDeleteForm: (id: string) => void;
  onCloneForm: (id: string) => void;
  onExportForm: (form: FormConfig) => void;
  onImportTrigger: () => void;
}

const FormsList: React.FC<Props> = ({ 
  forms, 
  entries, 
  onSelectForm, 
  onCreateForm, 
  onDeleteForm, 
  onCloneForm, 
  onExportForm,
  onImportTrigger 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = forms.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEntryCount = (formId: string) => entries.filter(e => e.formId === formId).length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Investigative Records</h2>
            <p className="text-slate-500 font-medium mt-1">Authorized EFCC record templates and evidence collection tools.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search records..."
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 w-64 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={onImportTrigger}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              title="Import Record Template"
            >
              <Upload size={18} /> <span className="hidden lg:inline">Import</span>
            </button>
            <button 
              onClick={onCreateForm}
              className="px-6 py-3 bg-red-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-100 transition-all flex items-center gap-2"
            >
              <Plus size={18} /> New Record
            </button>
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6">
             <div className="bg-slate-50 p-6 rounded-full text-slate-200 mb-6">
                <FileText size={48} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">No investigative records found</h3>
             <p className="text-slate-400 mt-2 max-w-sm font-medium">
               Authorized personnel can create or import new record templates to begin evidence collection.
             </p>
             <div className="flex gap-4 mt-8">
                <button 
                  onClick={onImportTrigger}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Import Template
                </button>
                <button 
                  onClick={onCreateForm}
                  className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 shadow-2xl shadow-red-100 transition-all"
                >
                  New Record
                </button>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredForms.map((form) => {
              const count = getEntryCount(form.id);
              return (
                <div 
                  key={form.id}
                  className="bg-white group rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="p-8 flex-1">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${form.status === 'inactive' ? 'bg-slate-300' : 'bg-emerald-500 animate-pulse'}`}></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{form.status || 'Active'}</span>
                       </div>
                       <div className="flex items-center gap-1">
                          <button 
                            onClick={() => onCloneForm(form.id)}
                            title="Duplicate Record Template"
                            className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Copy size={16} />
                          </button>
                          <button 
                            onClick={() => onExportForm(form)}
                            title="Export Template JSON"
                            className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <Download size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteForm(form.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors mb-2 line-clamp-1">{form.title}</h3>
                    <p className="text-sm text-slate-400 font-medium line-clamp-2 mb-6 h-10">{form.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Entries</span>
                          <span className="text-xl font-black text-slate-800">{count}</span>
                       </div>
                       <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Created</span>
                          <span className="text-[11px] font-black text-slate-800">{new Date(form.createdAt || Date.now()).toLocaleDateString()}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="px-8 pb-8">
                     <button 
                        onClick={() => onSelectForm(form.id)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-600 shadow-xl shadow-slate-100 transition-all group/btn"
                     >
                        Manage Record <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              );
            })}
            
            <button 
              onClick={onCreateForm}
              className="bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-12 px-8 hover:bg-white hover:border-red-200 hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-red-600 group-hover:scale-110 transition-all shadow-sm">
                <Plus size={32} />
              </div>
              <span className="mt-4 text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-red-600">New Template</span>
            </button>
          </div>
        )}

        {forms.length > 0 && (
            <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="p-3 bg-white/10 w-fit rounded-2xl"><Activity size={24} /></div>
                        <div>
                            <span className="block text-3xl font-black">{forms.length}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Authorized Records</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 bg-white/10 w-fit rounded-2xl"><Database size={24} /></div>
                        <div>
                            <span className="block text-3xl font-black">{entries.length}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Evidence Files</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 bg-white/10 w-fit rounded-2xl"><TrendingUp size={24} /></div>
                        <div>
                            <span className="block text-3xl font-black">Secure</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/10 skew-x-12 translate-x-1/2"></div>
            </section>
        )}
      </div>
    </div>
  );
};

export default FormsList;
