import React, { useState } from 'react';
import { Checkbox } from '../shared/UI';
import { QUESTION_TYPES } from '../../utils/helpers';

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
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
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
                  <span className="text-slate-400 text-xs flex-shrink-0">
                    {field.type === 'SINGLE_CHOICE' ? '◉' : '☐'}
                  </span>
                  <span className="flex-1 text-sm text-slate-700">{opt}</span>
                  <button
                    onClick={() => removeOption(i)}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center text-xs"
                  >✕</button>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
              title="Remove"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}