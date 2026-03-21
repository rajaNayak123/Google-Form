import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formsApi, questionsApi } from '../services/api';
import PageHeader from '../components/shared/PageHeader';
import FieldEditor from '../components/admin/FieldEditor';
import QuestionBank from '../components/admin/QuestionBank';
import { Button, Input, Textarea, Spinner } from '../components/shared/UI';
import { generateId } from '../utils/helpers';
import { Pointer } from 'lucide-react';

const blankField = () => ({
  _localId: generateId(),
  questionId: null,
  questionText: '',
  type: 'SHORT_ANSWER',
  options: [],
  required: false,
});

export default function FormBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields]         = useState([blankField()]);
  const [saving, setSaving]         = useState(false);
  const [loadingForm, setLoadingForm] = useState(isEdit);
  const [showBank, setShowBank]     = useState(false);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoadingForm(true);
        const form = await formsApi.getById(id);
        setTitle(form.title);
        setDescription(form.description || '');
        setFields((form.fields || []).map((f) => ({
          _localId: generateId(),
          questionId: f.questionId,
          questionText: f.questionText,
          type: f.type,
          options: f.options || [],
          required: f.required,
          order: f.order,
        })));
      } catch (err) {
        toast.error(err.message);
        navigate('/admin/forms');
      } finally {
        setLoadingForm(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const openBank = useCallback(async () => {
    setShowBank(true);
    try {
      setBankLoading(true);
      setBankQuestions(await questionsApi.getAll());
    } catch { toast.error('Failed to load questions'); }
    finally { setBankLoading(false); }
  }, []);

  const handleFieldChange = (index, updated) =>
    setFields((prev) => prev.map((f, i) => (i === index ? updated : f)));

  const handleAddField = () => setFields((prev) => [...prev, blankField()]);

  const handleDuplicate = (index) => {
    const copy = { ...fields[index], _localId: generateId() };
    setFields((prev) => [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]);
  };

  const handleRemove = (index) => {
    if (fields.length === 1) { toast.warn('A form needs at least one question'); return; }
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFromBank = (questions) => {
    const newFields = questions.map((q) => ({
      _localId: generateId(),
      questionId: q.id,
      questionText: q.text,
      type: q.type,
      options: q.options || [],
      required: q.required,
    }));
    setFields((prev) => [...prev, ...newFields]);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.warn('Please enter a form title'); return; }
    if (fields.some((f) => !f.questionText?.trim())) { toast.warn('All questions must have text'); return; }

    const savedIds = {};
    for (const field of fields) {
      if (!field.questionId) {
        try {
          const q = await questionsApi.create({ text: field.questionText, type: field.type, options: field.options, required: field.required });
          savedIds[field._localId] = q.id;
        } catch { /* non-fatal */ }
      }
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      fields: fields.map((f, i) => ({
        questionId: savedIds[f._localId] || f.questionId || null,
        questionText: f.questionText,
        type: f.type,
        options: f.options || [],
        required: f.required,
        order: i,
      })),
    };

    try {
      setSaving(true);
      if (isEdit) {
        await formsApi.update(id, payload);
        toast.success('Form updated!');
      } else {
        await formsApi.create(payload);
        toast.success('Form created!');
        setTitle('');
        setDescription('');
        setFields([blankField()]);
        navigate('/admin/forms');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingForm) {
    return <div className="flex justify-center items-center min-h-screen"><Spinner size={36} /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <PageHeader
        title={isEdit ? 'Edit Form' : 'New Form'}
        description={isEdit ? 'Update your form questions and settings' : 'Build your form by adding questions below'}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/admin/forms')}>Cancel</Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {isEdit ? 'Save Changes' : 'Create Form'}
            </Button>
          </>
        }
      />

      <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-6">
        {/* Meta card */}
        <div className="bg-white border-t-8 border-[#4285F4] rounded-xl p-8 flex flex-col gap-6 shadow-sm">
          <Input
            label="Form Title *"
            placeholder="e.g. Job Application Form"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold border-0 border-b-2 border-slate-200 focus:border-[#4285F4] focus:ring-0 rounded-none px-0 py-2"
          />
          <Textarea
            label="Description (optional)"
            placeholder="Tell respondents what this form is about…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="border-0 border-b border-slate-200 focus:border-[#4285F4] focus:ring-0 rounded-none px-0 py-1"
          />
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <FieldEditor
              key={field._localId}
              field={field}
              index={index}
              onChange={handleFieldChange}
              onDuplicate={handleDuplicate}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Add actions */}
        <div className="flex gap-4 items-center mt-2 pb-8 border-b border-slate-200">
          <button
            onClick={handleAddField}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Question
          </button>
          <button
            onClick={openBank}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span className="text-base leading-none flex items-center"><Pointer className="w-4 h-4" /></span>
            Choose from existing
          </button>
        </div>
      </div>

      {/*  Modal: Question bank  */}
      {showBank && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <QuestionBank
            questions={bankQuestions}
            loading={bankLoading}
            onAddSelected={handleAddFromBank}
            onClose={() => setShowBank(false)}
          />
        </div>
      )}
    </div>
  );
}