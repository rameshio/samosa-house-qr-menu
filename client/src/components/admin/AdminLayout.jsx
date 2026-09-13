import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If rendering the login page, no layout frame
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }



  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
        <div className="text-xl font-bold text-gray-800 tracking-tight">Samosa House Admin</div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2 text-gray-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/></svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`md:flex md:flex-col md:w-64 md:border-r md:border-gray-200 bg-white md:static absolute inset-y-0 left-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-20`}>
        <div className="hidden md:flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800 tracking-tight">Samosa House</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col space-y-1">
          <Link to="/admin" className={`px-4 py-2 rounded-md font-medium ${location.pathname === '/admin' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}>Menu List</Link>
          <Link to="/admin/menu/new" className={`px-4 py-2 rounded-md font-medium ${location.pathname === '/admin/menu/new' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}>Create Item</Link>
          {user?.role === 'OWNER' && (
            <>
              <Link to="/admin/staff" className={`px-4 py-2 rounded-md font-medium ${location.pathname === '/admin/staff' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}>Staff Manager</Link>
              <Link to="/admin/audit" className={`px-4 py-2 rounded-md font-medium ${location.pathname === '/admin/audit' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}>Audit History</Link>
            </>
          )}
        </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-900 truncate">{user?.displayName}</div>
          <div className="text-xs text-gray-500 mb-4">{user?.role}</div>
          <button onClick={logout} className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors">Log out</button>
        </div>
      </div>
      
      {/* Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-10" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}