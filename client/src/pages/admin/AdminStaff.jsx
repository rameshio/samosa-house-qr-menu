import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/api/admin/staff').then(res => setStaff(res.data)).finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (id, isActive) => {
    if (!window.confirm(`Change status to ${isActive ? 'Active' : 'Disabled'}?`)) return;
    try {
      await fetchApi(`/api/admin/staff/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) });
      setStaff(staff.map(s => s.id === id ? { ...s, isActive } : s));
    } catch (e) { alert(e.message); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Manager</h1>
      <div className="bg-white shadow rounded p-6">
        <ul>
          {staff.map(s => (
            <li key={s.id} className="py-4 flex justify-between">
              <div>
                <div className="font-bold">{s.displayName} ({s.role})</div>
                <div className="text-sm text-gray-500">{s.email}</div>
              </div>
              <button onClick={() => toggleStatus(s.id, !s.isActive)} className="px-3 py-1 border rounded">
                {s.isActive ? 'Disable' : 'Enable'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

