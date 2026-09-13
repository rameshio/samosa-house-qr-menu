import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../../services/api';

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchApi('/api/admin/menu')
      .then(res => {
        if (res.success) setCategories(res.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handlePublish = async () => {
    if (window.confirm('Are you sure you want to publish all draft changes? This will update the public menu immediately.')) {
      try {
        await fetchApi('/api/admin/menu/publish', { method: 'POST' });
        alert('Menu published successfully.');
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const toggleAvailability = async (itemId, isAvailable) => {
    if (!window.confirm(`Mark this item as ${isAvailable ? 'Available' : 'Unavailable'}?`)) return;
    
    // Optimistic UI update
    const previous = [...categories];
    const newCategories = categories.map(cat => ({
      ...cat,
      menuItems: cat.menuItems.map(item => item.id === itemId ? { ...item, isAvailable } : item)
    }));
    setCategories(newCategories);

    try {
      const itemToUpdate = categories.flatMap(c => c.menuItems).find(i => i.id === itemId);
      await fetchApi(`/api/admin/menu/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ version: itemToUpdate.version, isAvailable })
      });
    } catch (err) {
      alert('Failed to update availability: ' + err.message);
      setCategories(previous);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const hasDrafts = categories.some(cat => cat.menuItems.some(item => item.hasDraftChanges));

  const allItems = categories.flatMap(cat => cat.menuItems);
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory ? item.categoryId === filterCategory : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu List</h1>
        <div className="flex space-x-3">
          {hasDrafts && (
            <button onClick={handlePublish} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Publish Changes
            </button>
          )}
          <Link to="/admin/menu/new" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
            Create Item
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search items..." 
          className="border rounded px-3 py-2 flex-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select 
          className="border rounded px-3 py-2"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 flex items-center">
                  <img src={item.imageUrl} alt="" className="h-10 w-10 rounded-full mr-3 object-cover bg-gray-100" />
                  <div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{categories.find(c => c.id === item.categoryId)?.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">${(item.priceCents / 100).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => toggleAvailability(item.id, !item.isAvailable)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.hasDraftChanges ? <span className="text-orange-600 font-medium text-sm">Unpublished Changes</span> : <span className="text-gray-500 text-sm">Published</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/menu/${item.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white shadow rounded-lg p-4 flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover bg-gray-100" />
              <div>
                <div className="font-bold text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{categories.find(c => c.id === item.categoryId)?.name}</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700">${(item.priceCents / 100).toFixed(2)}</span>
              <button 
                onClick={() => toggleAvailability(item.id, !item.isAvailable)}
                className={`px-2 py-1 rounded-full font-semibold ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </button>
            </div>
            <div className="flex justify-between items-center text-sm border-t pt-2">
              {item.hasDraftChanges ? <span className="text-orange-600 font-medium">Unpublished Changes</span> : <span className="text-gray-500">Published</span>}
              <Link to={`/admin/menu/${item.id}/edit`} className="text-indigo-600 font-semibold uppercase tracking-wide">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}