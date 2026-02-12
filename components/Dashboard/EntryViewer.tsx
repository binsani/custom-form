
import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Trash2, Database, FileText, Send } from 'lucide-react';
import { FormEntry, FormConfig } from '../../types';
import { jsPDF } from 'jspdf';

interface Props {
  entries: FormEntry[];
  form: FormConfig;
}

const EntryViewer: React.FC<Props> = ({ entries, form }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const filteredEntries = entries.filter(entry => 
    Object.values(entry.data).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const generatePDF = async (entry: FormEntry) => {
    setIsGenerating(entry.id);
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 30;

      // Header
      if (form.pdfConfig?.headerText) {
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(form.pdfConfig.headerText, margin, 15);
      }

      // Title
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      doc.text(form.title, margin, y);
      y += 10;

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Entry ID: ${entry.id}`, margin, y);
      y += 15;

      // Metadata
      if (form.pdfConfig?.includeSubmissionDate) {
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Submitted At: ${new Date(entry.submittedAt).toLocaleString()}`, margin, y);
        y += 5;
        doc.text(`IP Address: ${entry.ip}`, margin, y);
        y += 15;
      }

      // Separator
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y, 190, y);
      y += 15;

      // Content
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      
      const allFields = form.pages.flatMap(p => p.fields);
      
      Object.entries(entry.data).forEach(([fieldId, value]) => {
        const field = allFields.find(f => f.id === fieldId);
        const label = field ? field.label : fieldId;
        
        // Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(label, margin, y);
        y += 7;

        // Value
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const textValue = Array.isArray(value) ? value.join(', ') : String(value);
        
        // Multi-line support for long text
        const splitValue = doc.splitTextToSize(textValue, 170);
        doc.text(splitValue, margin, y);
        y += (splitValue.length * 6) + 5;

        // Page break check
        if (y > 270) {
          doc.addPage();
          y = 30;
        }
      });

      // Footer
      if (form.pdfConfig?.footerText) {
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(200, 200, 200);
          doc.text(form.pdfConfig.footerText, margin, 285);
          doc.text(`Page ${i} of ${pageCount}`, 190 - 20, 285, { align: 'right' });
        }
      }

      doc.save(`submission-${entry.id.slice(-6)}.pdf`);
    } catch (err) {
      console.error('PDF Generation Failed', err);
      alert('Could not generate PDF. Check console for details.');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleEmailPDF = (entry: FormEntry) => {
    alert(`Email logic triggered for entry ${entry.id.slice(-6)}. In a production environment, this would route the generated PDF via our configured SMTP or API endpoint.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-8 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Form Entries</h2>
          <p className="text-sm text-slate-500 font-medium">Reviewing data for <span className="text-indigo-600 font-bold">"{form.title}"</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Deep search entries..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 w-72 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
            <div className="bg-slate-50 p-10 rounded-full mb-6">
               <Database size={80} className="opacity-10" />
            </div>
            <p className="text-xl font-bold text-slate-300 tracking-tight">No submissions recorded yet</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-md z-10">
              <tr>
                <th className="p-5 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-8">Identity</th>
                <th className="p-5 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                <th className="p-5 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client IP</th>
                <th className="p-5 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Snippet</th>
                <th className="p-5 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-indigo-50/30 transition-all group cursor-default">
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {entry.id.slice(-2)}
                       </div>
                       <div>
                          <span className="block text-sm font-black text-slate-700">#{entry.id.slice(-6)}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Reference ID</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-medium text-slate-500">{new Date(entry.submittedAt).toLocaleDateString()} <span className="opacity-40 text-xs ml-1 font-normal">{new Date(entry.submittedAt).toLocaleTimeString()}</span></td>
                  <td className="p-5 text-xs text-slate-400 font-mono tracking-tight">{entry.ip}</td>
                  <td className="p-5">
                    <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block max-w-[200px] truncate border border-slate-200/50">
                      {Object.values(entry.data)[0]}...
                    </div>
                  </td>
                  <td className="p-5 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => generatePDF(entry)}
                        disabled={isGenerating === entry.id}
                        title="Download PDF"
                        className={`p-2.5 rounded-xl transition-all shadow-sm ${isGenerating === entry.id ? 'bg-slate-100 text-slate-300' : 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'}`}
                      >
                        {isGenerating === entry.id ? <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div> : <FileText size={18} />}
                      </button>
                      <button 
                        onClick={() => handleEmailPDF(entry)}
                        title="Email PDF"
                        className="p-2.5 bg-white border border-slate-200 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm"
                      >
                        <Send size={18} />
                      </button>
                      <div className="w-px h-6 bg-slate-200 mx-1"></div>
                      <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
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

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Showing {filteredEntries.length} Active Submissions</span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-colors shadow-sm" disabled>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-lg shadow-indigo-100">1</button>
          </div>
          <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-colors shadow-sm" disabled>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryViewer;
