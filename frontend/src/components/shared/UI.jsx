import React from 'react';

/* Spinner  */
export function Spinner({ size = 20 }) {
  return (
    <svg className="animate-spin text-indigo-600 flex-shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/*  Button  */
export function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', type = 'button', ...props }) {
  const base = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger' }[variant] ?? 'btn-primary';
  const sz   = { sm: 'btn-sm', md: '', lg: 'btn-lg' }[size] ?? '';
  return (
    <button type={type} className={`${base} ${sz} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}

/*  Badge  */
export function Badge({ children, color = 'brand' }) {
  const colors = { brand: 'bg-indigo-100 text-indigo-700', success: 'bg-emerald-100 text-emerald-700', danger: 'bg-red-100 text-red-600', neutral: 'bg-slate-100 text-slate-600', warning: 'bg-amber-100 text-amber-700' };
  return <span className={`badge ${colors[color] ?? colors.brand}`}>{children}</span>;
}

/*  EmptyState  */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-8 gap-3">
      {icon && <div className="text-5xl leading-none">{icon}</div>}
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      {description && <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}


/* Input */
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-slate-600">{label}</label>}
      <input className={`form-input ${error ? 'form-input-error' : ''} ${className}`} {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

/*  Textarea  */
export function Textarea({ label, error, rows = 3, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-slate-600">{label}</label>}
      <textarea rows={rows} className={`form-input resize-y min-h-[72px] ${error ? 'form-input-error' : ''} ${className}`} {...props} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}


/* Checkbox  */
export function Checkbox({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 select-none">
      <input type="checkbox" className="w-4 h-4 accent-indigo-600 cursor-pointer" {...props} />
      <span>{label}</span>
    </label>
  );
}