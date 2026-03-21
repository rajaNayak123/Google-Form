import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formsApi, responsesApi } from '../services/api';
import { Button, Spinner } from '../components/shared/UI';
import { Search, AlertTriangle } from 'lucide-react';

export default function PublicFormPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await formsApi.getBySlug(slug);
        setForm(data);
        const init = {};
        (data.fields || []).forEach((f) => { init[f.questionId] = f.type === 'MULTIPLE_CHOICE' ? [] : ''; });
        setAnswers(init);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  const handleChange = (qid, val) => { setAnswers((p) => ({ ...p, [qid]: val })); setErrors((p) => ({ ...p, [qid]: null })); };
  const handleMulti = (qid, opt, checked) => {
    setAnswers((p) => ({ ...p, [qid]: checked ? [...(p[qid]||[]), opt] : (p[qid]||[]).filter((v) => v !== opt) }));
    setErrors((p) => ({ ...p, [qid]: null }));
  };

  const validate = () => {
    const errs = {};
    (form?.fields || []).forEach((f) => {
      if (!f.required) return;
      const v = answers[f.questionId];
      if (!v || v === '' || (Array.isArray(v) && !v.length)) errs[f.questionId] = 'This field is required';
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); document.getElementById(`f-${Object.keys(errs)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    try {
      setSubmitting(true);
      await responsesApi.submit(slug, answers);
      navigate(`/f/${slug}/success`);
    } catch (err) { alert(err.message || 'Submission failed'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={36} /></div>;
  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-sm shadow-lg flex flex-col items-center gap-3">
        <span className="text-5xl text-slate-400 flex justify-center"><Search size={48} /></span>
        <h2 className="text-xl font-bold text-slate-800">Form not found</h2>
        <p className="text-slate-500 text-sm">This form may have been deleted or the link is incorrect.</p>
      </div>
    </div>
  );

  const fields = (form.fields || []).slice().sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {/* Header card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-pink-500" />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800">{form.title}</h1>
            {form.description && <p className="text-slate-500 mt-2 text-sm leading-relaxed">{form.description}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field.questionId || index} id={`f-${field.questionId}`}
              className={`bg-white rounded-xl border shadow-card p-5 flex flex-col gap-3 transition-colors ${errors[field.questionId] ? 'border-red-300' : 'border-slate-200 focus-within:border-indigo-300'}`}>
              <p className="font-semibold text-slate-800 text-sm leading-snug">
                {field.questionText}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </p>
              <FieldInput field={field} value={answers[field.questionId]} onChange={handleChange} onMultiChange={handleMulti} error={errors[field.questionId]} />
              {errors[field.questionId] && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><AlertTriangle size={12} /> {errors[field.questionId]}</p>}
            </div>
          ))}

          <div className="flex items-center gap-5">
            <Button type="submit" variant="primary" size="lg" loading={submitting}>Submit</Button>
            <button type="button" className="text-sm text-slate-400 hover:text-red-500 underline transition-colors"
              onClick={() => { const init = {}; fields.forEach((f) => { init[f.questionId] = f.type === 'MULTIPLE_CHOICE' ? [] : ''; }); setAnswers(init); setErrors({}); }}>
              Clear form
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 py-4">Powered by <strong>GForms</strong></p>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange, onMultiChange, error }) {
  const cls = `form-input ${error ? 'form-input-error' : ''}`;
  switch (field.type) {
    case 'SHORT_ANSWER': return <input className={cls} type="text" placeholder="Your answer" value={value||''} onChange={(e) => onChange(field.questionId, e.target.value)} />;
    case 'LONG_ANSWER':  return <textarea className={`${cls} resize-y min-h-[100px]`} placeholder="Your answer" rows={4} value={value||''} onChange={(e) => onChange(field.questionId, e.target.value)} />;
    case 'NUMBER':       return <input className={cls} type="number" placeholder="0" value={value||''} onChange={(e) => onChange(field.questionId, e.target.value)} />;
    case 'DATE':         return <input className={cls} type="date" value={value||''} onChange={(e) => onChange(field.questionId, e.target.value)} />;
    case 'YES_NO':
    case 'SINGLE_CHOICE':
      return (
        <div className="flex flex-col gap-2">
          {(field.type === 'YES_NO' ? ['Yes','No'] : field.options||[]).map((opt) => (
            <label key={opt} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer border transition-all text-sm ${value===opt ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-200'}`}>
              <input type="radio" name={field.questionId} value={opt} checked={value===opt} onChange={() => onChange(field.questionId, opt)} className="accent-indigo-600" />{opt}
            </label>
          ))}
        </div>
      );
    case 'MULTIPLE_CHOICE':
      return (
        <div className="flex flex-col gap-2">
          {(field.options||[]).map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt);
            return (
              <label key={opt} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer border transition-all text-sm ${checked ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-200'}`}>
                <input type="checkbox" value={opt} checked={checked} onChange={(e) => onMultiChange(field.questionId, opt, e.target.checked)} className="accent-indigo-600" />{opt}
              </label>
            );
          })}
        </div>
      );
    default: return <input className={cls} type="text" value={value||''} onChange={(e) => onChange(field.questionId, e.target.value)} />;
  }
}