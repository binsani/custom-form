
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FormConfig, FormField, FieldType, ConditionalLogic } from '../../types';

interface Props {
  form: FormConfig;
  onSubmit: (data: Record<string, any>) => void;
}

const FormPreview: React.FC<Props> = ({ form, onSubmit }) => {
  const allFields = useMemo(() => form.pages.flatMap(p => p.fields), [form]);
  
  // Track visibility state to detect transitions for conditional default values
  const [prevVisibility, setPrevVisibility] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    // Initialize with standard default values
    const initial: Record<string, any> = {};
    allFields.forEach(f => {
      if (f.defaultValue) {
        initial[f.id] = f.defaultValue;
      }
    });
    return initial;
  });

  /**
   * Evaluates a single logic condition against the current form state.
   */
  const evaluateCondition = (rule: any, currentData: Record<string, any>) => {
    const value = currentData[rule.fieldId];
    const targetValue = rule.value;

    if (value === undefined || value === null || value === '') {
        return rule.operator === 'not_equals';
    }

    if (Array.isArray(value)) {
        switch (rule.operator) {
            case 'equals':
                return value.length === 1 && String(value[0]) === String(targetValue);
            case 'not_equals':
                return !value.includes(targetValue);
            case 'contains':
                return value.includes(targetValue);
            default:
                return false;
        }
    }

    const strValue = String(value).toLowerCase();
    const strTarget = String(targetValue).toLowerCase();

    switch (rule.operator) {
      case 'equals':
        return String(value) === String(targetValue);
      case 'not_equals':
        return String(value) !== String(targetValue);
      case 'contains':
        return strValue.includes(strTarget);
      case 'starts_with':
        return strValue.startsWith(strTarget);
      case 'ends_with':
        return strValue.endsWith(strTarget);
      case 'greater_than':
        return Number(value) > Number(targetValue);
      case 'less_than':
        return Number(value) < Number(targetValue);
      default:
        return false;
    }
  };

  /**
   * Checks if a field should be visible.
   */
  const isFieldVisible = (field: FormField, currentData: Record<string, any>) => {
    if (!field.conditionalLogic || !field.conditionalLogic.rules || field.conditionalLogic.rules.length === 0) {
      return true;
    }

    const { action, scope, rules } = field.conditionalLogic;
    const activeRules = rules.filter(r => r.fieldId);
    if (activeRules.length === 0) return true;

    const results = activeRules.map(rule => evaluateCondition(rule, currentData));
    const matches = scope === 'all' 
      ? results.every(r => r === true)
      : results.some(r => r === true);

    return action === 'show' ? matches : !matches;
  };

  // Detect visibility changes and apply conditional default values
  useEffect(() => {
    const nextVisibility: Record<string, boolean> = {};
    const nextData = { ...formData };
    let dataChanged = false;

    allFields.forEach(field => {
      const visible = isFieldVisible(field, formData);
      nextVisibility[field.id] = visible;

      // Transition check: From hidden to visible
      if (visible && !prevVisibility[field.id] && field.conditionalDefaultValue) {
          // Apply conditional default value only if the current value is empty or equal to standard default
          if (!formData[field.id] || formData[field.id] === field.defaultValue) {
              nextData[field.id] = field.conditionalDefaultValue;
              dataChanged = true;
          }
      }
    });

    setPrevVisibility(nextVisibility);
    if (dataChanged) {
        setFormData(nextData);
    }
  }, [formData, allFields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedData: Record<string, any> = {};
    allFields.forEach(f => {
      if (isFieldVisible(f, formData)) {
        submittedData[f.id] = formData[f.id];
      }
    });
    
    onSubmit(submittedData);
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{form.title}</h2>
        <p className="text-lg text-slate-500 leading-relaxed font-medium">{form.description}</p>
      </div>

      <div className="flex flex-wrap -mx-3">
        {allFields.map((field) => {
          const visible = isFieldVisible(field, formData);
          
          if (!visible) return null;

          return (
            <div 
              key={field.id}
              className={`px-3 mb-8 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-500 fill-mode-both ${
                field.width === '1/4' ? 'w-1/4' : 
                field.width === '1/2' ? 'w-1/2' : 
                field.width === '3/4' ? 'w-3/4' : 'w-full'
              }`}
            >
              {field.type === FieldType.SECTION ? (
                <div className="mt-10 mb-6 border-b-2 border-slate-100 pb-3">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{field.label}</h3>
                  {field.description && <p className="text-sm text-slate-500 font-medium mt-1">{field.description}</p>}
                </div>
              ) : field.type === FieldType.PAGE_BREAK ? (
                <div className="w-full h-12 flex items-center gap-4 my-8">
                    <hr className="flex-1 border-slate-100 border-dashed" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Next Step</span>
                    <hr className="flex-1 border-slate-100 border-dashed" />
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                    {field.label}
                    {field.required && <span className="text-rose-500 text-lg">*</span>}
                  </label>
                  
                  {field.type === FieldType.TEXT && (
                    <input 
                      type="text" 
                      required={field.required}
                      value={formData[field.id] || ''}
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-300 font-medium bg-slate-50/50 hover:bg-white"
                      placeholder={field.placeholder || 'Type here...'}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === FieldType.NUMBER && (
                    <input 
                      type="number" 
                      required={field.required}
                      value={formData[field.id] || ''}
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium bg-slate-50/50 hover:bg-white"
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === FieldType.TEXTAREA && (
                    <textarea 
                      required={field.required}
                      value={formData[field.id] || ''}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 h-40 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all font-medium bg-slate-50/50 hover:bg-white"
                      placeholder={field.placeholder}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === FieldType.SELECT && (
                    <div className="relative">
                        <select 
                            required={field.required}
                            value={formData[field.id] || ''}
                            className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none bg-slate-50/50 hover:bg-white font-bold text-slate-700"
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                        >
                            <option value="">Select an option...</option>
                            {field.choices?.map(c => <option key={c.id} value={c.value}>{c.text}</option>)}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  )}

                  {field.type === FieldType.RADIO && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {field.choices?.map(c => (
                        <label key={c.id} className="flex items-center gap-4 px-5 py-3 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all group">
                          <div className="relative flex items-center justify-center shrink-0">
                            <input 
                              type="radio" 
                              name={field.id} 
                              value={c.value} 
                              checked={formData[field.id] === c.value}
                              className="peer sr-only"
                              onChange={() => handleInputChange(field.id, c.value)}
                            />
                            <div className="w-6 h-6 border-2 border-slate-200 rounded-full peer-checked:border-indigo-600 transition-all bg-white group-hover:border-indigo-300"></div>
                            <div className="absolute w-2.5 h-2.5 bg-indigo-600 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                          </div>
                          <span className="text-sm text-slate-600 group-hover:text-indigo-900 font-bold">{c.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === FieldType.CHECKBOX && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {field.choices?.map(c => (
                        <label key={c.id} className="flex items-center gap-4 px-5 py-3 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all group">
                          <div className="relative flex items-center justify-center shrink-0">
                            <input 
                              type="checkbox" 
                              value={c.value} 
                              checked={(formData[field.id] || []).includes(c.value)}
                              className="peer sr-only"
                              onChange={(e) => {
                                const currentValues = formData[field.id] || [];
                                const newValues = e.target.checked 
                                  ? [...currentValues, c.value]
                                  : currentValues.filter((v: string) => v !== c.value);
                                handleInputChange(field.id, newValues);
                              }}
                            />
                            <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all bg-white group-hover:border-indigo-300"></div>
                            <svg className="absolute w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-600 group-hover:text-indigo-900 font-bold">{c.text}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === FieldType.SIGNATURE && (
                    <div className="border-2 border-slate-100 rounded-2xl bg-slate-50 overflow-hidden group hover:border-indigo-200 transition-all">
                      <div className="h-44 relative flex items-center justify-center">
                        <span className="text-slate-300 font-bold italic select-none text-2xl tracking-widest opacity-40 group-hover:scale-110 transition-transform">Sign Here</span>
                      </div>
                      <div className="bg-slate-100/80 p-3 flex justify-between items-center border-t border-slate-200/50">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Biometric Identity Verified</span>
                        <button type="button" className="px-3 py-1 bg-white text-[10px] text-indigo-600 font-black uppercase tracking-widest rounded-lg shadow-sm hover:text-indigo-800">Clear</button>
                      </div>
                    </div>
                  )}

                  {field.description && <p className="text-xs text-slate-400 mt-1.5 ml-1 font-medium italic opacity-80 leading-relaxed">{field.description}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t-4 border-slate-50 mt-12">
        <button 
          type="button"
          onClick={() => alert('Progress successfully cached. Use your temporary link to resume.')}
          className="text-indigo-600 text-sm font-black hover:text-indigo-800 tracking-tight flex items-center gap-2 group"
        >
          <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          </span>
          Save & Finish Later
        </button>
        <button 
          type="submit"
          className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {form.submitButtonText || 'Complete Submission'}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>
      </div>
    </form>
  );
};

export default FormPreview;
