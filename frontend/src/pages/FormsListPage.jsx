import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formsApi } from '../services/api';
import PageHeader from '../components/shared/PageHeader';
import FormCard from '../components/admin/FormCard';
import { Button, Spinner, EmptyState } from '../components/shared/UI';
import { ClipboardList } from 'lucide-react';

export default function FormsListPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadForms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await formsApi.getAll();
      setForms(Array.isArray(res) ? res : (res?.data ?? []));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadForms(); }, [loadForms]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this form? This cannot be undone.')) return;
    try {
      await formsApi.delete(id);
      toast.success('Form deleted');
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="My Forms"
        description="Create, manage, and share your forms"
        actions={
          <Button variant="primary" onClick={() => navigate('/admin/forms/new')}>
            + New Form
          </Button>
        }
      />

      <div className="p-8 flex-1">
        {loading && (
          <div className="flex justify-center py-24"><Spinner size={36} /></div>
        )}

        {!loading && forms.length === 0 && (
          <EmptyState
            icon={<ClipboardList className="w-12 h-12 text-slate-400 mb-2" />}
            title="No forms yet"
            description="Create your first form and start collecting responses."
            action={
              <Button variant="primary" onClick={() => navigate('/admin/forms/new')}>
                + Create Form
              </Button>
            }
          />
        )}

        {!loading && forms.length > 0 && (
          <>
            <p className="text-xs text-slate-400 mb-5 font-medium">
              {forms.length} form{forms.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {forms.map((form) => (
                <FormCard key={form.id} form={form} onDelete={handleDelete} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}