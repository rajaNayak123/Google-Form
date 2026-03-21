import React, { useState } from 'react';
import { Checkbox } from '../shared/UI';
import { QUESTION_TYPES } from '../../utils/helpers';
import { CircleDot, Square, X, Copy, Trash2, ChevronDown } from 'lucide-react';

export default function FieldEditor({ field, index, onChange, onDuplicate, onRemove }) {
  const [optionInput, setOptionInput] = useState('');
  const update = (patch) => onChange(index, { ...field, ...patch });

  const addOption = () => {
    const val = optionInput.trim();
    if (!val) return;
    update({ options: [...(field.options || []), val] });
    setOptionInput('');
  };

  const removeOption = (i) =>
    update({ options: field.options.filter((_, idx) => idx !== i) });

  const needsOptions = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'].includes(field.type);

  return (
    <div className="bg-white border border-[#4285F4] rounded-md overflow-hidden hover:shadow-sm transition-all duration-200 mb-4">
      {/* Body */}
      <div className="p-6 flex flex-col gap-6">
        
        {/* Question + Type row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6 items-start">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Question</label>
            <input
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#4285F4]"
              placeholder="Enter your question here"
              value={field.questionText || ''}
              onChange={(e) => update({ questionText: e.target.value })}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Type</label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white cursor-pointer focus:outline-none focus:border-[#4285F4] appearance-none"
                value={field.type || 'SHORT_ANSWER'}
                onChange={(e) => update({ type: e.target.value, options: [] })}
              >
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Divider below text input */}
        <hr className="border-slate-200" />

        {/* Options */}
        {needsOptions && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              {(field.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <span className="text-slate-400 text-xs flex-shrink-0 flex items-center">
                    {field.type === 'SINGLE_CHOICE' ? <CircleDot size={14} /> : <Square size={14} />}
                  </span>
                  <span className="flex-1 text-sm text-slate-700">{opt}</span>
                  <button
                    onClick={() => removeOption(i)}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center text-xs"
                  ><X size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center mt-2">
              <input
                className="flex-1 px-3 py-1.5 border-b border-dashed border-slate-300 text-sm focus:outline-none focus:border-[#4285F4] bg-transparent"
                placeholder="Add option… (press Enter)"
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
              />
            </div>
            {/* Divider below options to match layout if options exist */}
            <hr className="border-slate-200 mt-4" />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4">
          <Checkbox
            label="Required"
            checked={field.required || false}
            onChange={(e) => update({ required: e.target.checked })}
          />
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <div className="flex gap-4">
            <button
              onClick={() => onDuplicate(index)}
              className="text-slate-500 hover:text-slate-700 transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              title="Remove"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}