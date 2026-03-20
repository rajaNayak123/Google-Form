import React from 'react';

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap px-8 py-6 bg-white border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}