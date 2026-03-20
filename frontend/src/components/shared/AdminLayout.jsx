import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      {/*  Sidebar  */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 cursor-pointer select-none"
          onClick={() => navigate('/admin/forms')}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
            G
          </div>
          <span className="text-lg font-bold text-slate-800">Forms</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          <NavLink
            to="/admin/forms"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`
            }
          >
            <span className="text-base">📋</span>
            My Forms
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-mono">v1.0.0</span>
        </div>
      </aside>

      {/*  Main  */}
      <main className="flex-1 min-w-0 bg-slate-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}