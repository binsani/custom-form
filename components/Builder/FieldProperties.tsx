
import React from 'react';
import { X, ChevronRight, Settings, Sliders, ShieldCheck, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';
import { FormField, FieldType, Choice, Condition, ConditionalLogic } from '../../types';
import { WIDTH_OPTIONS } from '../../constants';

interface Props {
  field?: FormField;
  allFields?: FormField[];
  onUpdate: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

const FieldProperties: React.FC<Props> = ({ field, allFields = [], onUpdate, onClose }) => {
  if (!field) return null;

  const handleChoiceChange = (choiceId: string, text: string) => {
    const newChoices = field.choices?.map(c => 
      c.id === choiceId ? { ...c, text, value: text.toLowerCase().replace(/\s+/g, '_') } : c
    );
    onUpdate({ choices: newChoices });
  };

  const addChoice = () => {
    const newChoice: Choice = {
      id: 'c' + Date.now(),
      text: 'New Option',
      value: 'new_option'
    };
    onUpdate({ choices: [...(field.choices || []), newChoice] });
  };

  const removeChoice = (id: string) => {
    onUpdate({ choices: field.choices?.filter(c => c.id !== id) });
  };

  // Logic Handlers
  const toggleLogic = () => {
    if (field.conditionalLogic) {
      onUpdate({ conditionalLogic: undefined });
    } else {
      const firstTriggerField = allFields.find(f => f.id !== field.id);
      onUpdate({
        conditionalLogic: {
          action: 'show',
          scope: 'all',
          rules: [{
            fieldId: firstTriggerField?.id || '',
            operator: 'equals',
            value: ''
          }]
        }
      });
    }
  };

  const addRule = () => {
    if (!field.conditionalLogic) return;
    const firstOtherField = allFields.find(f => f.id !== field.id);
    const newRule: Condition = {
      fieldId: firstOtherField?.id || '',
      operator: 'equals',
      value: ''
    };
    onUpdate({
      conditionalLogic: {
        ...field.conditionalLogic,
        rules: [...field.conditionalLogic.rules, newRule]
      }
    });
  };

  const updateRule = (index: number, updates: Partial<Condition>) => {
    if (!field.conditionalLogic) return;
    const newRules = [...field.conditionalLogic.rules];
    newRules[index] = { ...newRules[index], ...updates };
    onUpdate({
      conditionalLogic: {
        ...field.conditionalLogic,
        rules: newRules
      }
    });
  };

  const removeRule = (index: number) => {
    if (!field.conditionalLogic) return;
    const newRules = field.conditionalLogic.rules.filter((_, i) => i !== index);
    if (newRules.length === 0) {
        onUpdate({ conditionalLogic: undefined });
    } else {
        onUpdate({
          conditionalLogic: {
            ...field.conditionalLogic,
            rules: newRules
          }
        });
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-2xl">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-indigo-600" />
          <h2 className="font-bold text-slate-800">Field Settings</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
        {/* General Settings */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sliders size={12} /> Basic Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Field Label</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description</label>
              <textarea 
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm h-20 resize-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={field.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
              />
            </div>
            {/* Standard Default Value */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Standard Default Value</label>
              <input 
                type="text" 
                placeholder="Initial value..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={field.defaultValue || ''}
                onChange={(e) => onUpdate({ defaultValue: e.target.value })}
              />
              <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Applied when the form first loads.</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-700">Required Field</span>
              <button 
                onClick={() => onUpdate({ required: !field.required })}
                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${field.required ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${field.required ? 'left-6' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* Choices Section */}
        {[FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX, FieldType.QUIZ, FieldType.POLL].includes(field.type) && (
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Choice Management</h3>
            <div className="space-y-2">
              {field.choices?.map((choice) => (
                <div key={choice.id} className="flex gap-2 group">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={choice.text}
                    onChange={(e) => handleChoiceChange(choice.id, e.target.value)}
                  />
                  <button onClick={() => removeChoice(choice.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addChoice}
                className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
              >
                + Add Option
              </button>
            </div>
          </section>
        )}

        {/* Appearance Settings */}
        <section>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Layout & Style</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Column Width</label>
              <div className="grid grid-cols-2 gap-2">
                {WIDTH_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate({ width: opt.value as any })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      field.width === opt.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONDITIONAL LOGIC BUILDER */}
        <section className="bg-slate-50 p-4 rounded-2xl border border-slate-200 border-dashed">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} /> Conditional Logic
            </h3>
            <button 
              onClick={toggleLogic}
              className={`w-10 h-5 rounded-full relative transition-all duration-300 ${field.conditionalLogic ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${field.conditionalLogic ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          
          {field.conditionalLogic ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Action Selector (Show/Hide) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Visibility Action</label>
                <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => onUpdate({ conditionalLogic: { ...field.conditionalLogic!, action: 'show' } })}
                    className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${field.conditionalLogic.action === 'show' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    SHOW
                  </button>
                  <button 
                    type="button"
                    onClick={() => onUpdate({ conditionalLogic: { ...field.conditionalLogic!, action: 'hide' } })}
                    className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${field.conditionalLogic.action === 'hide' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    HIDE
                  </button>
                </div>
              </div>

              {/* Scope Selector (All/Any) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Match Requirement</label>
                <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <button 
                    type="button"
                    onClick={() => onUpdate({ conditionalLogic: { ...field.conditionalLogic!, scope: 'all' } })}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${field.conditionalLogic.scope === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    ALL (AND)
                  </button>
                  <button 
                    type="button"
                    onClick={() => onUpdate({ conditionalLogic: { ...field.conditionalLogic!, scope: 'any' } })}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${field.conditionalLogic.scope === 'any' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    ANY (OR)
                  </button>
                </div>
              </div>

              {/* Conditional Default Value Input */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2 shadow-inner">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-700 uppercase tracking-widest">
                  <Sparkles size={12} className="animate-pulse" /> Conditional Default Value
                </div>
                <input 
                  type="text" 
                  placeholder="Value when triggered..."
                  className="w-full px-3 py-2 bg-white border border-indigo-100 rounded-xl text-[11px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold placeholder:text-slate-300"
                  value={field.conditionalDefaultValue || ''}
                  onChange={(e) => onUpdate({ conditionalDefaultValue: e.target.value })}
                />
                <p className="text-[9px] text-indigo-400 font-medium italic">
                  Automatically populates this value when the field becomes visible.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Logic Rules</label>
                {field.conditionalLogic.rules.map((rule, idx) => {
                  const sourceField = allFields.find(f => f.id === rule.fieldId);
                  const hasChoices = sourceField && [FieldType.SELECT, FieldType.RADIO, FieldType.CHECKBOX].includes(sourceField.type);
                  
                  return (
                    <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 relative group/rule">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-indigo-300 tracking-tighter uppercase">Rule #{idx + 1}</span>
                        <button onClick={() => removeRule(idx)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      
                      <select 
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={rule.fieldId}
                        onChange={(e) => updateRule(idx, { fieldId: e.target.value, value: '' })}
                      >
                        <option value="">Select Target Field</option>
                        {allFields.filter(f => f.id !== field.id).map(f => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <select 
                          className="text-[11px] p-2 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium"
                          value={rule.operator}
                          onChange={(e) => updateRule(idx, { operator: e.target.value as any })}
                        >
                          <option value="equals">is</option>
                          <option value="not_equals">is not</option>
                          <option value="contains">contains</option>
                          <option value="greater_than">greater than</option>
                          <option value="less_than">less than</option>
                          <option value="starts_with">starts with</option>
                          <option value="ends_with">ends with</option>
                        </select>

                        {hasChoices ? (
                          <select 
                            className="text-[11px] p-2 bg-indigo-50 border border-indigo-100 rounded-xl outline-none font-bold text-indigo-700"
                            value={String(rule.value)}
                            onChange={(e) => updateRule(idx, { value: e.target.value })}
                          >
                            <option value="">Select Value</option>
                            {sourceField.choices?.map(c => (
                              <option key={c.id} value={c.value}>{c.text}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            type="text"
                            placeholder="Type value..."
                            className="text-[11px] p-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                            value={rule.value}
                            onChange={(e) => updateRule(idx, { value: e.target.value })}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={addRule}
                className="w-full py-3 bg-white border-2 border-dashed border-indigo-200 text-indigo-600 rounded-2xl text-[11px] font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} /> ADD LOGIC RULE
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Make your forms smarter by showing or hiding this field based on user selections elsewhere.
              </p>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
};

export default FieldProperties;
