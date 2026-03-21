import React, { useState } from 'react';
import { Spinner, EmptyState } from '../shared/UI';
import { getTypeLabel } from '../../utils/helpers';
import { HelpCircle } from 'lucide-react';

export default function QuestionBank({ questions, loading, onAddSelected, onClose }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleAdd = () => {
    onAddSelected(questions.filter((q) => selected.has(q.id)));
    onClose();
  };

  return (
    <div className="bg-white border-2 border-[#4285F4] rounded-md flex flex-col w-full max-w-3xl max-h-[80vh] shadow-xl animate-slide-in">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200">
        <h4 className="font-bold text-slate-800 text-base">Choose from existing questions</h4>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {loading && (
          <div className="flex justify-center py-10"><Spinner /></div>
        )}
        {!loading && questions.length === 0 && (
          <EmptyState icon={<HelpCircle className="w-12 h-12 text-slate-400 mb-2" />} title="No saved questions" description="Add questions to reuse them." />
        )}
        {!loading && questions.map((q) => (
          <label
            key={q.id}
            className={`flex items-start gap-4 px-6 py-4 cursor-pointer border-b border-slate-200 transition-colors hover:bg-slate-50`}
          >
            <input
              type="checkbox"
              className="w-[18px] h-[18px] mt-0.5 accent-[#4285F4] cursor-pointer flex-shrink-0 border-2 border-slate-400 rounded-sm"
              checked={selected.has(q.id)}
              onChange={() => toggle(q.id)}
            />
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[15px] text-slate-800 leading-snug">{q.text}</p>
              {q.options?.length > 0 && (
                <p className="text-xs text-slate-500 mt-1 truncate">{q.options.join(', ')}</p>
              )}
            </div>
            <span className="text-[15px] text-slate-500 flex-shrink-0 w-32 tracking-wide">{getTypeLabel(q.type)}</span>
          </label>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-md">
        <button 
          className="px-4 py-2 font-semibold rounded-md text-[#1a73e8] hover:bg-blue-100 transition-colors text-sm"
          onClick={handleAdd}
          disabled={selected.size === 0}
        >
          Add {selected.size || ''} question{selected.size !== 1 ? 's' : ''}
        </button>
        <button 
          className="px-4 py-2 font-semibold rounded-md text-slate-600 hover:bg-slate-200 transition-colors text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}