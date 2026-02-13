import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FormConfig, FormField, FieldType } from '../../types';
import { Layers, CheckCircle2, Camera, Trash2, FileUp, Upload, ShieldCheck, X, RefreshCw } from 'lucide-react';

interface Props {
  form: FormConfig;
  allForms?: FormConfig[];
  onSubmit: (data: Record<string, any>) => void;
  onSaveDraft?: (data: Record<string, any>) => string | undefined;
  initialData?: Record<string, any>;
  isNested?: boolean;
  onNestedDataChange?: (data: Record<string, any>) => void;
  parentFormData?: Record<string, any>;
}

/**
 * Robust Signature Pad using HTML5 Canvas
 */
const SignaturePad: React.FC<{ 
  onChange: (data: string) => void, 
  value?: string,
  onCaptureFace: () => void,
  hasFace?: boolean 
}> = ({ onChange, value, onCaptureFace, hasFace }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange('');
  };

  return (
    <div className="border-2 border-slate-100 rounded-2xl bg-slate-50 overflow-hidden group hover:border-red-200 transition-all">
      <div className="relative h-48 bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        {!value && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <span className="text-2xl font-black italic tracking-widest text-slate-300">AUTHORIZED SIGNATURE</span>
          </div>
        )}
      </div>
      <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-100">
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={onCaptureFace}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${hasFace ? 'bg-emerald-100 text-emerald-700' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100'}`}
          >
            <Camera size={14} /> {hasFace ? 'Identity Verified' : 'Verify Identity'}
          </button>
          {hasFace && (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-200">
               <ShieldCheck size={16} className="m-auto text-emerald-600 mt-1.5" />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onClick={clear}
          className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors"
        >
          Clear Pad
        </button>
      </div>
    </div>
  );
};

/**
 * Face Capture Utility for Biometric Authentication
 */
const FaceCaptureOverlay: React.FC<{ onCapture: (img: string) => void, onClose: () => void }> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(err => {
        alert("Camera access denied. Biometric verification is required for signatures.");
        onClose();
      });
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    onCapture(canvas.toDataURL('image/jpeg'));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6">
      <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest">Biometric Identity Capture</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="aspect-video bg-black relative">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 border-[40px] border-slate-900/40 pointer-events-none">
            <div className="w-full h-full border-2 border-red-500/50 rounded-full"></div>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-xs text-slate-500 font-medium mb-6">Align your face within the frame and click capture. This will be stored as an encrypted metadata for this record.</p>
          <button 
            onClick={capture}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-100 transition-all flex items-center justify-center gap-3"
          >
            <Camera size={20} /> Capture & Verify
          </button>
        </div>
      </div>
    </div>
  );
};

const FormPreview: React.FC<Props> = ({ 
    form, 
    allForms = [], 
    onSubmit, 
    onSaveDraft,
    initialData,
    isNested = false, 
    onNestedDataChange,
    parentFormData = {}
}) => {
  const allFields = useMemo(() => form.pages.flatMap(p => p.fields), [form]);
  const [formData, setFormData] = useState<Record<string, any>>(() => initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resumeCode, setResumeCode] = useState<string | null>(null);
  const [isFaceCaptureOpen, setIsFaceCaptureOpen] = useState<{fieldId: string} | null>(null);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  // Logic to handle auto-calculations
  useEffect(() => {
    let dataChanged = false;
    const nextData = { ...formData };

    allFields.forEach(field => {
      if (field.type === FieldType.CALCULATION && field.formula) {
        try {
          // Replace {field:ID} with values from formData
          const resolvedFormula = field.formula.replace(/\{field:([^}]+)\}/g, (match, fieldId) => {
            const val = formData[fieldId] || 0;
            return isNaN(Number(val)) ? "0" : String(val);
          });
          
          // Basic sanitization: only allowed characters for simple math
          if (/^[0-9+\-*/().\s]+$/.test(resolvedFormula)) {
            const result = eval(resolvedFormula);
            if (nextData[field.id] !== result) {
              nextData[field.id] = result;
              dataChanged = true;
            }
          }
        } catch (e) {
          console.warn("Formula evaluation failed for field", field.id);
        }
      }
    });

    if (dataChanged) setFormData(nextData);
  }, [formData, allFields]);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required.';
    }
    if (field.type === FieldType.EMAIL && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    const field = allFields.find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [fieldId]: error || '' }));
    }
  };

  const isFieldVisible = (field: FormField, currentData: Record<string, any>) => {
    if (!field.conditionalLogic || !field.conditionalLogic.rules || field.conditionalLogic.rules.length === 0) return true;
    const { action, scope, rules } = field.conditionalLogic;
    const results = rules.map(rule => {
      const value = currentData[rule.fieldId];
      const target = rule.value;
      if (rule.operator === 'is_empty') return !value;
      if (rule.operator === 'is_not_empty') return !!value;
      if (rule.operator === 'equals') return String(value) === String(target);
      if (rule.operator === 'contains') return String(value).toLowerCase().includes(String(target).toLowerCase());
      return false;
    });
    const matches = scope === 'all' ? results.every(r => r) : results.some(r => r);
    return action === 'show' ? matches : !matches;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    allFields.forEach(f => {
      if (isFieldVisible(f, formData)) {
        const err = validateField(f, formData[f.id]);
        if (err) newErrors[f.id] = err;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Investigation Protocol Violation: Please correct the marked fields.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="relative">
      {isFaceCaptureOpen && (
        <FaceCaptureOverlay 
          onCapture={(img) => handleInputChange(`${isFaceCaptureOpen.fieldId}_face`, img)}
          onClose={() => setIsFaceCaptureOpen(null)}
        />
      )}

      {resumeCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Progress Encrypted</h3>
              <p className="text-slate-500 font-medium mb-8">Secure draft saved. Use this key to resume later.</p>
              <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 mb-8 group cursor-pointer" onClick={() => {navigator.clipboard.writeText(resumeCode!); alert('Code copied!');}}>
                 <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Resume Key</span>
                 <span className="text-4xl font-black text-red-600 tracking-widest uppercase">{resumeCode}</span>
              </div>
              <button onClick={() => setResumeCode(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs">Continue Investigation</button>
           </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
        <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{form.title}</h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">{form.description}</p>
        </div>

        <div className="flex flex-wrap -mx-3">
          {allFields.map((field) => {
            if (!isFieldVisible(field, formData)) return null;

            return (
              <div key={field.id} className={`px-3 mb-8 ${
                field.width === '1/4' ? 'w-1/4' : 
                field.width === '1/2' ? 'w-1/2' : 
                field.width === '3/4' ? 'w-3/4' : 'w-full'
              }`}>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 ml-1">
                    {field.label}
                    {field.required && <span className="text-red-600 text-lg">*</span>}
                  </label>
                  
                  {field.type === FieldType.TEXT && (
                    <input 
                      type="text" 
                      value={formData[field.id] || ''}
                      placeholder={field.placeholder || 'Enter value...'}
                      className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none bg-slate-50/50 ${errors[field.id] ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-red-500'}`}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === FieldType.NUMBER && (
                    <input 
                      type="number" 
                      value={formData[field.id] || ''}
                      className={`w-full px-5 py-3.5 rounded-2xl border-2 transition-all outline-none bg-slate-50/50 ${errors[field.id] ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-red-500'}`}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}

                  {field.type === FieldType.CALCULATION && (
                    <div className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-black text-slate-900 flex items-center justify-between">
                       <span>{formData[field.id] || 0}</span>
                       <RefreshCw size={14} className="text-slate-300 animate-spin-slow" />
                    </div>
                  )}

                  {field.type === FieldType.SIGNATURE && (
                    <SignaturePad 
                      value={formData[field.id]} 
                      onChange={(val) => handleInputChange(field.id, val)} 
                      onCaptureFace={() => setIsFaceCaptureOpen({fieldId: field.id})}
                      hasFace={!!formData[`${field.id}_face`]}
                    />
                  )}

                  {field.type === FieldType.FILE && (
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 bg-slate-50/50 hover:border-red-300 hover:bg-red-50/20 transition-all text-center group">
                        <input 
                          type="file" 
                          multiple={field.multipleFiles}
                          className="hidden" 
                          id={`file-${field.id}`}
                          onChange={(e) => {
                            // Fix: explicitly cast the array elements to File to resolve type error on .name property
                            const files = Array.from(e.target.files || []) as File[];
                            handleInputChange(field.id, files.map(f => f.name));
                          }} 
                        />
                        <label htmlFor={`file-${field.id}`} className="cursor-pointer block">
                           <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-red-600 group-hover:scale-110 transition-all">
                              <Upload size={24} />
                           </div>
                           <p className="text-sm font-bold text-slate-700">Drag files here or click to browse</p>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Maximum size: 25MB per file</p>
                        </label>
                        {formData[field.id] && (
                          <div className="mt-6 flex flex-wrap gap-2 justify-center">
                             {(formData[field.id] as string[]).map((name, i) => (
                               <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm">
                                  <FileUp size={12} /> {name}
                               </div>
                             ))}
                          </div>
                        )}
                    </div>
                  )}

                  {field.type === FieldType.SELECT && (
                    <select 
                      className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none focus:border-red-500 font-bold"
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    >
                      <option value="">Choose an option...</option>
                      {field.choices?.map(c => <option key={c.id} value={c.value}>{c.text}</option>)}
                    </select>
                  )}

                  {errors[field.id] && (
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">{errors[field.id]}</span>
                  )}

                  {field.description && <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">{field.description}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {!isNested && (
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100 mt-12">
              <button 
                  type="button"
                  onClick={() => {
                    const id = onSaveDraft?.(formData);
                    if (id) setResumeCode(id.replace('draft-', ''));
                  }}
                  className="text-red-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 group"
              >
                  <ShieldCheck size={16} /> Save Secure Draft
              </button>
              <button 
                  type="submit"
                  className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-red-200 hover:bg-red-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                  {form.submitButtonText || 'Complete Submission'}
              </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormPreview;