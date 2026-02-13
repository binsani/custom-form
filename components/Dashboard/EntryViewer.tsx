
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Trash2, Database, FileText, Send, DownloadCloud, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { FormEntry, FormConfig, FieldType } from '../../types';
import { jsPDF } from 'jspdf';

interface Props {
  entries: FormEntry[];
  form: FormConfig;
}

const EntryViewer: React.FC<Props> = ({ entries, form }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEntries = entries.filter(entry => 
    Object.values(entry.data).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const generatePDF = async (entry: FormEntry) => {
    setIsGenerating(entry.id);
    try {
      const doc = new jsPDF();
      doc.text(`Official Record - ${form.title}`, 20, 20);
      doc.text(`Record ID: ${entry.id}`, 20, 30);
      doc.save(`Record-${entry.id}.pdf`);
    } finally {
      setIsGenerating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <div className="h-10 w-1/3 bg-slate-100 rounded-xl animate-pulse"></div>
        <div className="h-64 w-full bg-slate-50 rounded-[2.5rem] animate-pulse"></div>
        <div className="space-y-2">
           {[1,2,3,4,5].map(i => <div key={i} className="h-12 w-full bg-slate-50 rounded-xl animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden" role="region" aria-label="Investigation Entries Viewer">
      <div className="p-8 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Investigative Records</h2>
          <p className="text-sm text-slate-500 font-medium">Secured data for <span className="text-red-600 font-bold">"{form.title}"</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search record database..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-red-50 focus:border-red-400 w-72 shadow-sm transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search entries"
            />
          </div>
          <button 
            title="Export Secure CSV"
            className="p-3 bg-white border border-slate-200 rounded-2xl text-red-600 hover:bg-red-50 shadow-sm transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
          >
            <FileSpreadsheet size={18} />
            <span className="hidden xl:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
            <div className="bg-slate-50 p-10 rounded-full mb-6">
               <Database size={80} className="opacity-10" />
            </div>
            <p className="text-xl font-bold text-slate-300 tracking-tight">No records found in database</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse" role="table">
            <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-md z-10 border-b border-slate-200">
              <tr>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8" role="columnheader">Case ID & Origin</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest" role="columnheader">Entry Date</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest" role="columnheader">Preview</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8" role="columnheader">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-red-50/40 transition-all group cursor-default" role="row">
                  <td className="p-5 pl-8" role="cell">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all shadow-sm">
                          {entry.id.slice(-2).toUpperCase()}
                       </div>
                       <div>
                          <span className="block text-sm font-black text-slate-800">RECORD-#{entry.id.slice(-6).toUpperCase()}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{entry.ip}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-5" role="cell">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{new Date(entry.submittedAt).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(entry.submittedAt).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="p-5" role="cell">
                    <div className="text-[11px] font-bold text-slate-600 bg-slate-100/50 px-3 py-2 rounded-xl border border-slate-200/50 max-w-[300px] truncate">
                      Entry Preview: {JSON.stringify(entry.data).slice(0, 50)}...
                    </div>
                  </td>
                  <td className="p-5 text-right pr-8" role="cell">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => generatePDF(entry)}
                        disabled={isGenerating === entry.id}
                        title="Download Secure PDF"
                        className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 ${isGenerating === entry.id ? 'bg-slate-50 text-slate-300 border border-slate-100' : 'bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600'}`}
                        aria-label="Generate PDF"
                      >
                        {isGenerating === entry.id ? (
                            <div className="w-5 h-5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                            <DownloadCloud size={18} />
                        )}
                      </button>
                      <button className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" aria-label="Delete entry">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EntryViewer;
