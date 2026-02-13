
import React from 'react';
import { Trash2, Copy, Move, Settings as SettingsIcon, FileJson, Download } from 'lucide-react';
import { FormConfig, FormField, FieldType } from '../../types';

interface CanvasProps {
  form: FormConfig;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onDeleteField: (id: string) => void;
  onExportField: (field: FormField) => void;
  onReorderFields: (fields: FormField[]) => void;
}

const BuilderCanvas: React.FC<CanvasProps> = ({ 
  form, 
  selectedFieldId, 
  onSelectField, 
  onDeleteField,
  onExportField,
  onReorderFields
}) => {
  const fields = form.pages[0].fields;

  if (fields.length === 0) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center py-32 bg-slate-50/50">
        <div className="bg-white p-4 rounded-full shadow-lg text-indigo-600 mb-4">
          <Move size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Canvas is empty</h3>
        <p className="text-slate-500 mt-2 max-w-sm text-center">
          Click on fields in the left sidebar to start building your professional WordPress form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-1">{form.title}</h2>
        <p className="text-slate-500">{form.description}</p>
      </div>

      <div className="flex flex-wrap -mx-2">
        {fields.map((field, idx) => (
          <div 
            key={field.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectField(field.id);
            }}
            className={`px-2 mb-4 group transition-all duration-200 ${
              field.width === '1/4' ? 'w-1/4' : 
              field.width === '1/2' ? 'w-1/2' : 
              field.width === '3/4' ? 'w-3/4' : 'w-full'
            }`}
          >
            <div className={`relative p-5 rounded-xl bg-white border-2 transition-all group-hover:shadow-md cursor-pointer ${
              selectedFieldId === field.id 
                ? 'border-indigo-500 ring-4 ring-indigo-50' 
                : 'border-slate-100 hover:border-slate-200'
            }`}>
              {/* Field Label & Required */}
              <div className="flex items-start justify-between mb-2">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {/* Action Buttons */}
                <div className={`flex items-center gap-1 transition-opacity ${selectedFieldId === field.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportField(field);
                    }}
                    title="Export Field Snippet"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Download size={14} />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Copy size={14} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteField(field.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Field Visual Representation */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-400 text-xs flex items-center gap-3">
                {field.type === FieldType.TEXT && <span className="flex-1 italic">Short text input...</span>}
                {field.type === FieldType.TEXTAREA && <span className="flex-1 italic">Multi-line text...</span>}
                {field.type === FieldType.SELECT && <span className="flex-1 italic">Dropdown choices...</span>}
                {field.type === FieldType.FILE && <span className="flex-1 italic">Drag & drop files here...</span>}
                {field.type === FieldType.SIGNATURE && (
                  <div className="w-full h-12 border border-dashed border-slate-300 rounded flex items-center justify-center">
                    Digital Signature Pad
                  </div>
                )}
                {field.type === FieldType.PAGE_BREAK && (
                  <div className="w-full border-t-2 border-dashed border-indigo-400 my-4 flex justify-center">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 -mt-3.5 text-[10px] font-bold uppercase rounded-full">Page Break</span>
                  </div>
                )}
                {/* Simple fallback */}
                {![FieldType.TEXT, FieldType.TEXTAREA, FieldType.SELECT, FieldType.FILE, FieldType.SIGNATURE, FieldType.PAGE_BREAK].includes(field.type) && (
                  <span className="flex-1 italic uppercase tracking-widest text-[10px]">{field.type.replace('_', ' ')} Mockup</span>
                )}
              </div>

              {field.description && (
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">{field.description}</p>
              )}

              {/* Drag Handle (Visual) */}
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 group-hover:text-slate-400 transition-colors cursor-move opacity-0 group-hover:opacity-100">
                <Move size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuilderCanvas;
