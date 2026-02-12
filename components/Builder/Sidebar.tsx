
import React from 'react';
import { FIELD_CATEGORIES } from '../../constants';
import { FieldType } from '../../types';

interface SidebarProps {
  onAddField: (type: FieldType) => void;
}

const BuilderSidebar: React.FC<SidebarProps> = ({ onAddField }) => {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Add Fields</h2>
        <p className="text-sm text-slate-500">Click to add fields to your form</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {FIELD_CATEGORIES.map((category, idx) => (
          <div key={category.name} className={idx !== 0 ? 'mt-8' : ''}>
            <h3 className="text-sm font-bold text-slate-700 mb-4">{category.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              {category.fields.map((field) => (
                <button
                  key={field.type}
                  onClick={() => onAddField(field.type)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-sm transition-all group"
                >
                  <div className="text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors">
                    {field.icon}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 group-hover:text-indigo-700 text-center">
                    {field.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-tighter">Pro Features</h4>
          <ul className="text-[11px] text-slate-500 space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
              Nested Forms Logic
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
              API Webhooks
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
              Digital PDF Mapping
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default BuilderSidebar;
