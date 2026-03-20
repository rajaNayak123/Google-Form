import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formsApi, responsesApi } from '../services/api';
import PageHeader from '../components/shared/PageHeader';
import { Button, Spinner, EmptyState, Badge } from '../components/shared/UI';
import { formatDate, getTypeLabel } from '../utils/helpers';

export default function FormResponsesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [formData, responsesData] = await Promise.all([formsApi.getById(id), responsesApi.getForForm(id)]);
      setForm(formData); setResponses(responsesData);
    } catch (err) { toast.error(err.message); navigate('/admin/forms'); }
    finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { load(); }, [load]);

  const renderAnswer = (answer) => {
    if (answer == null) return <span className="text-slate-300 italic">—</span>;
    if (Array.isArray(answer)) return answer.join(', ');
    return String(answer);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size={36} /></div>;

  const fields = form?.fields?.slice().sort((a, b) => a.order - b.order) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title={`Responses: ${form?.title}`}
        description={`${responses.length} total response${responses.length !== 1 ? 's' : ''}`}
        actions={<>
          <Button variant="secondary" onClick={() => navigate(`/admin/forms/${id}/edit`)}>✏️ Edit Form</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/forms')}>← Back</Button>
        </>}
      />
      <div className="p-8 flex flex-col gap-6">
        {/* Stats */}
        <div className="flex gap-4 flex-wrap">
          {[['📊', responses.length, 'Total Responses'], ['❓', fields.length, 'Questions']].map(([icon, val, label]) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-6 py-4 flex flex-col gap-0.5 min-w-[140px] shadow-card">
              <span className="text-2xl font-black text-indigo-600 font-mono">{val}</span>
              <span className="text-xs text-slate-400">{icon} {label}</span>
            </div>
          ))}
        </div>
        {/* Field legend */}
        {fields.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-card">
            {fields.map((f, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">Q{i+1}</span>
                <span className="text-sm text-slate-600 flex-1">{f.questionText}</span>
                <Badge color="brand">{getTypeLabel(f.type)}</Badge>
                {f.required && <Badge color="danger">Required</Badge>}
              </div>
            ))}
          </div>
        )}
        {/* Table */}
        {responses.length === 0 ? (
          <EmptyState icon="📭" title="No responses yet" description="Share your form link to start collecting responses."
            action={<Button variant="primary" onClick={() => window.open(`/f/${form?.uniqueSlug}`, '_blank')}>🔗 Open Form</Button>} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-card">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 border-b border-slate-200 w-10">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 border-b border-slate-200 whitespace-nowrap">Submitted At</th>
                  {fields.map((f, i) => (
                    <th key={i} className="text-left px-4 py-3 border-b border-slate-200 min-w-[160px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-indigo-500 font-mono">Q{i+1}</span>
                        <span className="text-xs font-semibold text-slate-700 normal-case">{f.questionText}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((resp, ri) => (
                  <tr key={resp.id} className={`${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-indigo-50/40 transition-colors`}>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono border-b border-slate-100">{ri+1}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap border-b border-slate-100">{formatDate(resp.submittedAt)}</td>
                    {fields.map((f, fi) => (
                      <td key={fi} className="px-4 py-3 text-sm text-slate-700 border-b border-slate-100 max-w-[240px] break-words">
                        {renderAnswer(resp.answers?.[f.questionId] ?? resp.answers?.[fi])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}