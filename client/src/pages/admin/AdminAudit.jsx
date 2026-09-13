import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';

export default function AdminAudit() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/api/admin/audit').then(res => setLogs(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit History</h1>
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Date</th>
              <th className="py-2 text-left">User</th>
              <th className="py-2 text-left">Action</th>
              <th className="py-2 text-left">Summary</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td className="py-2">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="py-2">{log.user ? log.user.email : 'System'}</td>
                <td className="py-2">{log.action}</td>
                <td className="py-2">{log.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

