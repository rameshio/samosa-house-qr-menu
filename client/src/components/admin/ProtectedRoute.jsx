import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ requireOwner }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireOwner && user.role !== 'OWNER') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You need OWNER privileges to view this page.</p>
        <a href="/admin" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Return to Dashboard</a>
      </div>
    );
  }

  return <Outlet />;
}