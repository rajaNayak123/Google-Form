import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Badge, Button } from '../shared/UI';
import { formatDate, copyToClipboard } from '../../utils/helpers';

export default function FormCard({ form, onDelete }) {
  const navigate = useNavigate();

  const handleCopy = async (e) => {
    e.stopPropagation();
    try { await copyToClipboard(form.publicLink); toast.success('Link copied!'); }
    catch { toast.error('Could not copy link'); }
  };

  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 border-slate-200 hover:border-indigo-200">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-slate-800 text-base leading-snug flex-1">{form.title}</h3>
        <Badge color={form.active ? 'success' : 'neutral'}>
          {form.active ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {form.description && (
        <p className="text-sm text-slate-500 leading-relaxed -mt-2 line-clamp-2">{form.description}</p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-5 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span>📊</span>
          {form.responseCount} response{form.responseCount !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5">
          <span>🕐</span>
          {formatDate(form.createdAt)}
        </span>
      </div>

      {/* Public link */}
      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 overflow-hidden">
        <code className="text-xs text-slate-500 truncate flex-1 font-mono">{form.publicLink}</code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors text-sm px-1"
          title="Copy link"
        >
          📋
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 flex-wrap">
        <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/forms/${form.id}/edit`)}>
          ✏️ Edit
        </Button>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/forms/${form.id}/responses`)}>
          👁 Responses
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.open(`/f/${form.uniqueSlug}`, '_blank')}>
          🔗 Preview
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(form.id)}>
          🗑
        </Button>
      </div>
    </div>
  );
}