
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Settings as SettingsIcon, 
  Eye, 
  Database, 
  FileText, 
  Share2, 
  HelpCircle,
  Menu,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Upload as UploadIcon,
  Trash2,
  SlidersHorizontal,
  FileJson,
  LayoutDashboard,
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  BarChart3,
  Bell,
  LogOut,
  User,
  Home,
  ShieldAlert,
  Users as UsersIcon
} from 'lucide-react';
import { FormConfig, FormField, FieldType, FormPage, FormEntry, FormDraft, UserProfile } from './types';
import BuilderSidebar from './components/Builder/Sidebar';
import BuilderCanvas from './components/Builder/Canvas';
import FieldProperties from './components/Builder/FieldProperties';
import FormPreview from './components/Preview/FormPreview';
import DashboardEntries from './components/Dashboard/EntryViewer';
import Analytics from './components/Dashboard/Analytics';
import FormSettings from './components/Dashboard/FormSettings';
import DashboardHome from './components/Dashboard/DashboardHome';
import FormsList from './components/Dashboard/FormsList';
import LoginPage from './components/Auth/LoginPage';
import UserManagement from './components/Dashboard/UserManagement';

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'u-1',
    name: 'Chief Administrator',
    fileNumber: 'admin',
    password: 'admin',
    role: 'admin',
    department: 'Headquarters',
    createdAt: new Date().toISOString()
  }
];

const createDefaultForm = (): FormConfig => ({
  id: 'form-' + Math.random().toString(36).substr(2, 9),
  title: 'EFCC Official Record',
  description: 'Confidential investigative form. For official EFCC use only.',
  pages: [
    {
      id: 'page-1',
      title: 'Section 1',
      fields: []
    }
  ],
  submitButtonText: 'Submit Official Record',
  confirmMessage: 'Form submitted successfully to the EFCC central database.',
  pdfConfig: {
    headerText: 'EFCC OFFICIAL RECORD - CONFIDENTIAL',
    footerText: 'FEDERAL GOVERNMENT OF NIGERIA | OFFICIAL USE ONLY | NOT FOR COMMERCIAL USE',
    includeSubmissionDate: true,
    paperSize: 'a4',
    showLogo: false
  },
  status: 'active',
  createdAt: new Date().toISOString(),
  enableSaveAndContinue: true
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('eagle_form_auth') === 'true';
  });
  
  const [view, setView] = useState<'login' | 'dashboard'>(isAuthenticated ? 'dashboard' : 'login');
  const [mainView, setMainView] = useState<'forms' | 'users'>('forms');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'build' | 'preview' | 'entries' | 'analytics' | 'settings'>('dashboard');
  
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('efcc_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = sessionStorage.getItem('efcc_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [forms, setForms] = useState<FormConfig[]>([]);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [entries, setEntries] = useState<FormEntry[]>([]);
  const [drafts, setDrafts] = useState<FormDraft[]>([]);
  const [activeDraftData, setActiveDraftData] = useState<Record<string, any> | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const savedForms = localStorage.getItem('eagle_forms_collection');
    const savedEntries = localStorage.getItem('eagle_form_entries');
    const savedDrafts = localStorage.getItem('eagle_form_drafts');
    if (savedForms) setForms(JSON.parse(savedForms));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedDrafts) setDrafts(JSON.parse(savedDrafts));
  }, []);

  useEffect(() => {
    localStorage.setItem('efcc_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (forms.length > 0 || localStorage.getItem('eagle_forms_collection')) {
      localStorage.setItem('eagle_forms_collection', JSON.stringify(forms));
    }
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('eagle_form_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const activeForm = forms.find(f => f.id === activeFormId);

  const handleLogin = (fileNumber: string, password: string) => {
    const foundUser = users.find(u => u.fileNumber === fileNumber && u.password === password);
    if (foundUser) {
      setIsAuthenticated(true);
      setCurrentUser(foundUser);
      sessionStorage.setItem('eagle_form_auth', 'true');
      sessionStorage.setItem('efcc_current_user', JSON.stringify(foundUser));
      setView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('eagle_form_auth');
    sessionStorage.removeItem('efcc_current_user');
    setActiveFormId(null);
    setActiveTab('dashboard');
    setView('login');
  };

  const handleAddUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      const updated = { ...currentUser, ...updates };
      setCurrentUser(updated);
      sessionStorage.setItem('efcc_current_user', JSON.stringify(updated));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) return alert('System must have at least one administrator.');
    if (currentUser?.id === id) return alert('You cannot delete your own profile while logged in.');
    if (confirm('Permanently revoke this officer\'s access?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleCreateForm = () => {
    const newForm = createDefaultForm();
    setForms(prev => [...prev, newForm]);
    setActiveFormId(newForm.id);
    setActiveTab('build');
  };

  const handleCloneForm = (id: string) => {
    const formToClone = forms.find(f => f.id === id);
    if (!formToClone) return;
    const clonedForm: FormConfig = {
      ...formToClone,
      id: 'form-' + Math.random().toString(36).substr(2, 9),
      title: `${formToClone.title} (Copy)`,
      createdAt: new Date().toISOString()
    };
    setForms(prev => [...prev, clonedForm]);
    alert(`Case file template duplicated: ${clonedForm.title}`);
  };

  const handleDeleteForm = (id: string) => {
    if (confirm('Are you sure you want to delete this form and all its associated data?')) {
      setForms(prev => prev.filter(f => f.id !== id));
      setEntries(prev => prev.filter(e => e.formId !== id));
      setDrafts(prev => prev.filter(d => d.formId !== id));
      if (activeFormId === id) {
        setActiveFormId(null);
        setActiveTab('dashboard');
      }
    }
  };

  const handleUpdateForm = (updates: Partial<FormConfig>) => {
    if (!activeFormId) return;
    setForms(prev => prev.map(f => f.id === activeFormId ? { ...f, ...updates } : f));
  };

  const handleAddField = (type: FieldType) => {
    if (!activeForm) return;
    const newField: FormField = {
      id: 'field-' + Math.random().toString(36).substr(2, 9),
      type,
      label: 'New ' + type.charAt(0).toUpperCase() + type.slice(1),
      required: false,
      width: '1/1',
      choices: [FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX, FieldType.QUIZ, FieldType.POLL, FieldType.SURVEY].includes(type) 
        ? [
            { id: 'c1', text: 'Option 1', value: 'opt1' },
            { id: 'c2', text: 'Option 2', value: 'opt2' },
            { id: 'c3', text: 'Option 3', value: 'opt3' }
          ]
        : undefined
    };

    handleUpdateForm({
      pages: activeForm.pages.map((p, idx) => 
        idx === activeForm.pages.length - 1 
          ? { ...p, fields: [...p.fields, newField] } 
          : p
      )
    });
    setSelectedFieldId(newField.id);
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!activeForm) return;
    handleUpdateForm({
      pages: activeForm.pages.map(page => ({
        ...page,
        fields: page.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
      }))
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (!activeForm) return;
    handleUpdateForm({
      pages: activeForm.pages.map(page => ({
        ...page,
        fields: page.fields.filter(f => f.id !== fieldId)
      }))
    });
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
  };

  const handleExport = (dataToExport: any = activeForm, filename?: string) => {
    if (!dataToExport) return;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const defaultName = filename || (dataToExport.title ? dataToExport.title.toLowerCase().replace(/\s+/g, '-') : 'record-template');
    link.download = `${defaultName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target?.result as string);
          if (config.pages && Array.isArray(config.pages)) {
            // It's a full form template
            const importedForm = { 
              ...config, 
              id: 'form-' + Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString()
            };
            setForms(prev => [...prev, importedForm]);
            setActiveFormId(importedForm.id);
            setActiveTab('dashboard');
            alert(`Template successfully imported: ${importedForm.title}`);
          } else if (config.id && config.type && config.label) {
            // It's a specific field snippet
            if (!activeForm) return alert('Import Protocol: Open a record builder first to import specific field snippets.');
            const newField = { ...config, id: 'field-' + Math.random().toString(36).substr(2, 9) };
            handleUpdateForm({
                pages: activeForm.pages.map((p, idx) => 
                  idx === activeForm.pages.length - 1 ? { ...p, fields: [...p.fields, newField] } : p
                )
            });
            alert(`Field snippet imported: ${newField.label}`);
          } else {
            throw new Error('Unrecognized JSON structure.');
          }
        } catch (err) {
          alert(`Import Security Violation: ${err instanceof Error ? err.message : 'Invalid JSON format'}`);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleSaveDraft = (data: Record<string, any>) => {
    if (!activeForm) return;
    const draftId = 'draft-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newDraft: FormDraft = {
      id: draftId,
      formId: activeForm.id,
      data,
      updatedAt: new Date().toISOString()
    };
    setDrafts(prev => [...prev, newDraft]);
    return draftId;
  };

  const handleResumeDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) {
      alert('Draft not found. Please check your code.');
      return;
    }
    const form = forms.find(f => f.id === draft.formId);
    if (!form) {
      alert('The associated form for this draft no longer exists.');
      return;
    }
    setActiveFormId(form.id);
    setActiveDraftData(draft.data);
    setActiveTab('preview');
  };

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  const currentEntries = entries.filter(e => e.formId === activeFormId);
  const allFields = activeForm?.pages.flatMap(p => p.fields) || [];
  const selectedField = allFields.find(f => f.id === selectedFieldId);

  const formTabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={16} /> },
    { id: 'build', label: 'Build', icon: <Plus size={16} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
    { id: 'entries', label: 'Entries', icon: <Database size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} /> }
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40 shrink-0 shadow-xl">
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => {setActiveFormId(null); setMainView('forms'); setActiveTab('dashboard'); setActiveDraftData(null);}}
          >
            <div className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <LayoutGrid size={22} />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">
              EFCC Eagle <span className="text-red-500">Form</span>
            </h1>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <ShieldAlert size={14} className="text-red-500" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">OFFICIAL USE ONLY | NON-COMMERCIAL</span>
          </div>
          {activeForm && (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => {setActiveFormId(null); setMainView('forms'); setActiveDraftData(null);}}>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active File</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-200 group-hover:text-red-400 transition-colors">{activeForm.title}</span>
                  <ChevronDown size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!activeForm && currentUser?.role === 'admin' && (
            <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
               <button 
                onClick={() => setMainView('forms')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mainView === 'forms' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
               >
                 Records
               </button>
               <button 
                onClick={() => setMainView('users')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mainView === 'users' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
               >
                 Personnel
               </button>
            </div>
          )}
          <button 
            onClick={() => {
              const code = prompt('Enter Case/Draft Resume Code:');
              if (code) handleResumeDraft(code.trim().toUpperCase().includes('DRAFT-') ? code.trim() : `DRAFT-${code.trim().toUpperCase()}`);
            }}
            className="px-4 py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} /> Resume Case
          </button>
          <button 
            onClick={handleCreateForm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 shadow-xl shadow-red-600/10 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <Plus size={16} /> New Record
          </button>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 hover:border-red-500 hover:text-white transition-all overflow-hidden"
            >
              {currentUser ? currentUser.name.slice(0, 1) : <User size={18} />}
            </button>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentUser?.role || 'Officer'}</p>
                    <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name}</p>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <button 
                      onClick={() => { setMainView('users'); setShowProfileMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2"
                    >
                      <UsersIcon size={14} /> Personnel Management
                    </button>
                  )}
                  <button className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2">
                    <SettingsIcon size={14} /> System Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Secure Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {activeForm && (
        <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-sm overflow-x-auto custom-scrollbar">
          <div className="flex">
            {formTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {setActiveTab(tab.id as any); if (tab.id !== 'preview') setActiveDraftData(null);}}
                className={`relative px-6 py-4 flex items-center gap-2.5 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap group ${
                  activeTab === tab.id 
                    ? 'text-red-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className={`transition-colors ${activeTab === tab.id ? 'text-red-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                  {tab.icon}
                </span>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 animate-in fade-in slide-in-from-bottom-1"></div>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-8 py-2">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/50">
              <button 
                onClick={() => handleExport()} 
                title="Export Template JSON" 
                className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-white rounded-lg shadow-sm"
              >
                <Download size={16} />
              </button>
              <label className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer bg-white rounded-lg shadow-sm ml-1" title="Import Template/Snippet">
                <UploadIcon size={16} />
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
              </label>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        {!activeFormId ? (
          mainView === 'forms' ? (
            <FormsList 
              forms={forms} 
              entries={entries} 
              onSelectForm={setActiveFormId} 
              onCreateForm={handleCreateForm} 
              onDeleteForm={handleDeleteForm}
              onCloneForm={handleCloneForm}
              onExportForm={handleExport}
              onImportTrigger={() => document.getElementById('global-import-input')?.click()}
            />
          ) : (
            <UserManagement 
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
              {activeTab === 'dashboard' && (
                <DashboardHome form={activeForm} entries={currentEntries} onNavigate={setActiveTab as any} />
              )}
              {activeTab === 'build' && (
                <>
                  <BuilderSidebar onAddField={handleAddField} onImportSnippet={() => document.getElementById('global-import-input')?.click()} />
                  <div className="flex-1 flex flex-col bg-slate-50 relative">
                    <div className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <SlidersHorizontal size={12} /> Record Structure
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <BuilderCanvas 
                        form={activeForm} 
                        selectedFieldId={selectedFieldId}
                        onSelectField={setSelectedFieldId}
                        onDeleteField={handleDeleteField}
                        onExportField={(field) => handleExport(field, `record-field-${field.label.toLowerCase().replace(/\s+/g, '-')}`)}
                        onReorderFields={(fields) => handleUpdateForm({ pages: [{...activeForm.pages[0], fields}] })}
                      />
                    </div>
                  </div>
                  <FieldProperties 
                    field={selectedField} 
                    allFields={allFields}
                    allForms={forms}
                    onUpdate={(updates) => handleUpdateField(selectedField!.id, updates)}
                    onClose={() => setSelectedFieldId(null)}
                  />
                </>
              )}
              {activeTab === 'preview' && (
                <div className="flex-1 flex flex-col items-center bg-slate-200 overflow-hidden">
                  <div className="w-full bg-white/80 backdrop-blur-md border-b p-3 flex justify-center gap-4 sticky top-0 z-20">
                    <button onClick={() => setPreviewDevice('desktop')} className={`p-2.5 rounded-xl transition-all ${previewDevice === 'desktop' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}><Monitor size={20} /></button>
                    <button onClick={() => setPreviewDevice('tablet')} className={`p-2.5 rounded-xl transition-all ${previewDevice === 'tablet' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}><Tablet size={20} /></button>
                    <button onClick={() => setPreviewDevice('mobile')} className={`p-2.5 rounded-xl transition-all ${previewDevice === 'mobile' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}><Smartphone size={20} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-12 w-full flex justify-center custom-scrollbar">
                    <div className={`transition-all duration-500 ease-out ${
                      previewDevice === 'desktop' ? 'w-full max-w-5xl' : 
                      previewDevice === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                    }`}>
                      <div className="bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] p-16 min-h-[800px] border border-white">
                        <FormPreview 
                          form={activeForm} 
                          allForms={forms}
                          initialData={activeDraftData || undefined}
                          onSaveDraft={handleSaveDraft}
                          onSubmit={(data) => {
                            const newEntry: FormEntry = {
                              id: 'entry-' + Date.now(),
                              formId: activeForm.id,
                              data,
                              submittedAt: new Date().toISOString(),
                              ip: '127.0.0.1',
                              userAgent: navigator.userAgent
                            };
                            const newEntries = [newEntry, ...entries];
                            setEntries(newEntries);
                            localStorage.setItem('eagle_form_entries', JSON.stringify(newEntries));
                            setActiveDraftData(null);
                            alert('Investigation record submitted successfully!');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'entries' && (
                <DashboardEntries entries={currentEntries} form={activeForm} />
              )}
              {activeTab === 'analytics' && (
                <Analytics entries={currentEntries} form={activeForm} />
              )}
              {activeTab === 'settings' && (
                <FormSettings form={activeForm} onUpdate={handleUpdateForm} />
              )}
            </div>
          </div>
        )}
      </main>
      <input id="global-import-input" type="file" className="hidden" accept=".json" onChange={handleImport} />
    </div>
  );
};

export default App;

const RotateCcw = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
);
