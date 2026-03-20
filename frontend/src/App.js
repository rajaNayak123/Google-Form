import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './components/shared/AdminLayout';
import FormsListPage from './pages/FormsListPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormResponsesPage from './pages/FormResponsesPage';
import PublicFormPage from './pages/PublicFormPage';
import FormSuccessPage from './pages/FormSuccessPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/f/:slug" element={<PublicFormPage />} />
        <Route path="/f/:slug/success" element={<FormSuccessPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="forms" replace />} />
          <Route path="forms" element={<FormsListPage />} />
          <Route path="forms/new" element={<FormBuilderPage />} />
          <Route path="forms/:id/edit" element={<FormBuilderPage />} />
          <Route path="forms/:id/responses" element={<FormResponsesPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin/forms" replace />} />
        <Route path="*" element={<Navigate to="/admin/forms" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}
