
import React, { useState } from 'react';
import { FormConfig, PdfConfig, EmailNotification, FormField } from '../../types';
import { FileText, Mail, ShieldCheck, Globe, Image as ImageIcon, Layout, Maximize, Plus, Trash2, Tag, Bell, FileSignature, Monitor, Sliders, RotateCcw } from 'lucide-react';

interface Props {
  form: FormConfig;
  onUpdate: (form: FormConfig) => void;
}

const FormSettings: React.FC<Props> = ({ form, onUpdate }) => {
  const [showTagMenu, setShowTagMenu] = useState<{ id: string, field: string } | null>(null);
  const allFields = form.pages.flatMap(p => p.fields);

  const updatePdfConfig = (updates: Partial<PdfConfig>) => {
    onUpdate({
      ...form,
      pdfConfig: {
        ...(form.pdfConfig || {}),
        ...updates
      } as PdfConfig
    });
  };

  const addNotification = () => {
    const newNotif: EmailNotification = {
      id: 'notif-' + Date.now(),
      name: 'New Notification',
      to: '{admin_email}',
      subject: 'New Submission for ' + form.title,
      message: 'A new entry has been recorded.\n\nSummary:\n{all_fields}'
    };
    onUpdate({
      ...form,
      emailNotifications: [...(form.emailNotifications || []), newNotif]
    });
  };

  const updateNotification = (id: string, updates: Partial<EmailNotification>) => {
    onUpdate({
      ...form,
      emailNotifications: form.emailNotifications?.map(n => n.id === id ? { ...n, ...updates } : n)
    });
  };

  const deleteNotification = (id: string) => {
    onUpdate({
      ...form,
      emailNotifications: form.emailNotifications?.filter(n => n.id !== id)
    });
  };

  const insertTag = (id: string, fieldName: string, tag: string) => {
    if (id === 'pdf_config') {
      const currentVal = (form.pdfConfig as any)?.[fieldName] || '';
      updatePdfConfig({ [fieldName]: currentVal + `{${tag}}` });
    } else {
      const notif = form.emailNotifications?.find(n => n.id === id);
      if (!notif) return;
      const currentVal = (notif as any)[fieldName] || '';
      updateNotification(id, { [fieldName]: currentVal + `{${tag}}` });
    }
    setShowTagMenu(null);
  };

  const TagSelector = ({ targetId, fieldName }: { targetId: string, fieldName: string }) => (
    <div className="relative inline-block ml-2">
      <button 
        onClick={() => setShowTagMenu(showTagMenu?.id === targetId && showTagMenu?.field === fieldName ? null : { id: targetId, field: fieldName })}
        className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
      >
        <Tag size={12} />
      </button>
      {showTagMenu?.id === targetId && showTagMenu?.field === fieldName && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-2 max-h-60 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Global Tags</div>
          <button onClick={() => insertTag(targetId, fieldName, 'submission_date')} className="w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50 font-medium">Submission Date</button>
          <button onClick={() => insertTag(targetId, fieldName, 'all_fields')} className="w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50 font-medium">All Fields Summary</button>
          <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mt-2 mb-1">Form Fields</div>
          {allFields.map(f => (
            <button key={f.id} onClick={() => insertTag(targetId, fieldName, `field:${f.id}`)} className="w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50 truncate font-medium">
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar p-10">
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Form Settings</h2>
          <p className="text-slate-500 font-medium">Configure advanced behavior, PDF exports, and data handling.</p>
        </header>

        {/* General Behavior Section */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="p-3 bg-slate-800 text-white rounded-2xl shadow-lg">
              <Sliders size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">General Behavior</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Core Form Functionality</p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200"><RotateCcw size={18} /></div>
                <div>
                  <span className="block text-sm font-bold text-slate-800">Save & Continue Later</span>
                  <span className="text-xs text-slate-400 font-medium italic">Allow users to save progress and return later with a unique code</span>
                </div>
              </div>
              <button 
                onClick={() => onUpdate({ ...form, enableSaveAndContinue: !form.enableSaveAndContinue })}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${form.enableSaveAndContinue ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${form.enableSaveAndContinue ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* PDF Settings Section */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">PDF Export Settings</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Submission Document Customization</p>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <label className="block text-sm font-bold text-slate-700">Filename Pattern</label>
                <TagSelector targetId="pdf_config" fieldName="filenamePattern" />
              </div>
              <input 
                type="text"
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-medium"
                placeholder="e.g. {field:id123}-submission"
                value={form.pdfConfig?.filenamePattern || ''}
                onChange={(e) => updatePdfConfig({ filenamePattern: e.target.value })}
              />
              <p className="text-[10px] text-slate-400 font-medium italic">Use merge tags to dynamically name downloaded PDFs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="block text-sm font-bold text-slate-700">Report Header Text</label>
                  <TagSelector targetId="pdf_config" fieldName="headerText" />
                </div>
                <input 
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  placeholder="Official Entry Record"
                  value={form.pdfConfig?.headerText || ''}
                  onChange={(e) => updatePdfConfig({ headerText: e.target.value })}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="block text-sm font-bold text-slate-700">Report Footer Text</label>
                  <TagSelector targetId="pdf_config" fieldName="footerText" />
                </div>
                <input 
                  type="text"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-medium"
                  placeholder="Strictly Confidential"
                  value={form.pdfConfig?.footerText || ''}
                  onChange={(e) => updatePdfConfig({ footerText: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Layout Options</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Paper Size */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-700">Paper Size</span>
                  <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
                    <button 
                      onClick={() => updatePdfConfig({ paperSize: 'a4' })}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${form.pdfConfig?.paperSize === 'a4' || !form.pdfConfig?.paperSize ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >A4</button>
                    <button 
                      onClick={() => updatePdfConfig({ paperSize: 'letter' })}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${form.pdfConfig?.paperSize === 'letter' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >LETTER</button>
                  </div>
                </div>

                {/* Orientation */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-700">Orientation</span>
                  <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
                    <button 
                      onClick={() => updatePdfConfig({ orientation: 'portrait' })}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${form.pdfConfig?.orientation === 'portrait' || !form.pdfConfig?.orientation ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >PORTRAIT</button>
                    <button 
                      onClick={() => updatePdfConfig({ orientation: 'landscape' })}
                      className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${form.pdfConfig?.orientation === 'landscape' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}
                    >LANDSCAPE</button>
                  </div>
                </div>

                {/* Submission Date Metadata */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-700">Include Date</span>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-slate-400 font-medium italic">Metadata footer</span>
                     <button 
                        onClick={() => updatePdfConfig({ includeSubmissionDate: !form.pdfConfig?.includeSubmissionDate })}
                        className={`w-10 h-5 rounded-full relative transition-all duration-300 ${form.pdfConfig?.includeSubmissionDate ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${form.pdfConfig?.includeSubmissionDate ? 'left-6' : 'left-1'}`}></div>
                      </button>
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg text-slate-400 border border-slate-200"><ImageIcon size={18} /></div>
                    <div>
                      <span className="block text-sm font-bold text-slate-800">Show Branding Logo</span>
                      <span className="text-xs text-slate-400 font-medium italic">Embed image in PDF header</span>
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
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-200/50">
                     <div className="flex items-center justify-between">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Logo Image URL</label>
                        <span className="text-[9px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">Supports PNG/JPG</span>
                     </div>
                     <input 
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none font-medium bg-white text-sm transition-all"
                      placeholder="https://example.com/logo.png"
                      value={form.pdfConfig?.logoUrl || ''}
                      onChange={(e) => updatePdfConfig({ logoUrl: e.target.value })}
                    />
                     <p className="text-[10px] text-slate-400 font-medium italic">Provide a public URL to your company logo for professional branding.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Email Notifications Section */}
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100">
                <Bell size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Email Notifications</h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Submission Routing</p>
              </div>
            </div>
            <button 
              onClick={addNotification}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md"
            >
              Add New
            </button>
          </div>

          <div className="p-8 space-y-8">
            {(!form.emailNotifications || form.emailNotifications.length === 0) ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                <Mail size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">No email notifications configured.</p>
              </div>
            ) : (
              form.emailNotifications.map((notif) => (
                <div key={notif.id} className="p-6 border-2 border-slate-100 rounded-3xl space-y-4 relative group">
                  <button onClick={() => deleteNotification(notif.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                      <input className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={notif.name} onChange={(e) => updateNotification(notif.id, { name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</label><TagSelector targetId={notif.id} fieldName="to" /></div>
                      <input className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={notif.to} onChange={(e) => updateNotification(notif.id, { to: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</label><TagSelector targetId={notif.id} fieldName="subject" /></div>
                    <input className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={notif.subject} onChange={(e) => updateNotification(notif.id, { subject: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label><TagSelector targetId={notif.id} fieldName="message" /></div>
                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={notif.message} onChange={(e) => updateNotification(notif.id, { message: e.target.value })} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormSettings;
