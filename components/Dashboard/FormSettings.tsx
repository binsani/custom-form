
import React from 'react';
import { FormConfig, PdfConfig } from '../../types';
import { FileText, Mail, ShieldCheck, Globe, Image as ImageIcon, Layout, Maximize } from 'lucide-react';

interface Props {
  form: FormConfig;
  onUpdate: (form: FormConfig) => void;
}

const FormSettings: React.FC<Props> = ({ form, onUpdate }) => {
  const updatePdfConfig = (updates: Partial<PdfConfig>) => {
    onUpdate({
      ...form,
      pdfConfig: {
        ...(form.pdfConfig || {}),
        ...updates
      } as PdfConfig
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar p-10">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Form Settings</h2>
          <p className="text-slate-500 font-medium">Configure advanced behavior, PDF exports, and data handling.</p>
        </header>

        {/* PDF Settings Section */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">PDF Generation & Templates</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Automatic Submission Exporting</p>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Report Header Text</label>
                <input 
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                  placeholder="e.g. Official Entry Record"
                  value={form.pdfConfig?.headerText || ''}
                  onChange={(e) => updatePdfConfig({ headerText: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Report Footer Text</label>
                <input 
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium"
                  placeholder="e.g. Strictly Confidential"
                  value={form.pdfConfig?.footerText || ''}
                  onChange={(e) => updatePdfConfig({ footerText: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Appearance & Page Options</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Paper Size Selection */}
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200"><Maximize size={18} /></div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800">Paper Size</span>
                      <span className="text-xs text-slate-400 font-medium italic">Standard document format</span>
                    </div>
                  </div>
                  <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
                    <button 
                      onClick={() => updatePdfConfig({ paperSize: 'a4' })}
                      className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${form.pdfConfig?.paperSize === 'a4' || !form.pdfConfig?.paperSize ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      A4
                    </button>
                    <button 
                      onClick={() => updatePdfConfig({ paperSize: 'letter' })}
                      className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${form.pdfConfig?.paperSize === 'letter' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      LETTER
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200"><Globe size={18} /></div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800">Metadata</span>
                      <span className="text-xs text-slate-400 font-medium italic">Include IP & Date</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => updatePdfConfig({ includeSubmissionDate: !form.pdfConfig?.includeSubmissionDate })}
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${form.pdfConfig?.includeSubmissionDate ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${form.pdfConfig?.includeSubmissionDate ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200"><ImageIcon size={18} /></div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Show Branding Logo</span>
                    <span className="text-xs text-slate-400 font-medium italic">Embeds company logo in the header</span>
                  </div>
                </div>
                <button 
                  onClick={() => updatePdfConfig({ showLogo: !form.pdfConfig?.showLogo })}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${form.pdfConfig?.showLogo ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${form.pdfConfig?.showLogo ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              
              {form.pdfConfig?.showLogo && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pl-4 border-l-4 border-indigo-200">
                   <label className="block text-sm font-bold text-slate-700">Logo Image URL</label>
                   <input 
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium"
                    placeholder="https://yourdomain.com/logo.png"
                    value={form.pdfConfig?.logoUrl || ''}
                    onChange={(e) => updatePdfConfig({ logoUrl: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Email Routing (Visual Placeholder) */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden opacity-60">
           <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="p-3 bg-slate-800 text-white rounded-2xl shadow-lg">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Email Routing & Logic</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Advanced Workflow Add-on</p>
            </div>
          </div>
          <div className="p-8 text-center py-12">
            <p className="text-slate-500 font-medium mb-4">Integrate with SendGrid or AWS SES to automate your workflows.</p>
            <button className="px-6 py-2 bg-slate-100 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest cursor-not-allowed">Enable Pro Integration</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormSettings;
