import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormSuccessPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-12 max-w-md w-full text-center flex flex-col items-center gap-4 animate-pop-in">
        <div className="text-6xl animate-bounce-in">✅</div>
        <h1 className="text-2xl font-bold text-slate-800">Response Submitted!</h1>
        <p className="text-slate-500 text-sm leading-relaxed">Thank you for filling out the form. Your response has been recorded.</p>
        <div className="flex flex-col gap-3 w-full mt-2">
          <button onClick={() => navigate(`/f/${slug}`)} className="btn-primary btn-lg w-full justify-center">Submit another response</button>
          <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-indigo-600 underline transition-colors">Go to home</button>
        </div>
      </div>
    </div>
  );
}