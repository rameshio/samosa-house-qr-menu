import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApi } from '../../services/api';

export default function AdminMenuEditor() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceDollarString: '',
    categoryId: '',
    imageUrl: '',
    version: 1
  });
  
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [conflictError, setConflictError] = useState(false);

  useEffect(() => {
    // Fetch categories and item data
    fetchApi('/api/admin/menu')
      .then(res => {
        setCategories(res.data);
        if (isEditing) {
          const item = res.data.flatMap(c => c.menuItems).find(i => i.id === id);
          if (item) {
            setFormData({
              name: item.draftName || item.name,
              description: item.draftDescription ?? item.description,
              priceDollarString: ((item.draftPriceCents ?? item.priceCents) / 100).toFixed(2),
              categoryId: item.categoryId,
              imageUrl: item.draftImageUrl ?? item.imageUrl,
              version: item.version
            });
          } else {
            setError('Item not found');
          }
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Unsupported file type. Please use JPEG, PNG, or WebP.');
      return;
    }
    
    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    };
  }, [uploadPreview]);

  const uploadImage = async () => {
    if (!uploadFile) return formData.imageUrl;
    
    setUploading(true);
    const form = new FormData();
    form.append('image', uploadFile);
    
    try {
      const res = await fetchApi('/api/admin/upload', {
        method: 'POST',
        body: form
      });
      return res.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConflictError(false);
    
    const priceCents = Math.round(parseFloat(formData.priceDollarString) * 100);
    if (isNaN(priceCents) || priceCents < 0) {
      setError('Invalid price');
      return;
    }

    try {
      const finalImageUrl = await uploadImage();
      
      const payload = {
        name: formData.name,
        description: formData.description,
        priceCents,
        categoryId: formData.categoryId,
        imageUrl: finalImageUrl,
        version: formData.version
      };

      if (isEditing) {
        await fetchApi(`/api/admin/menu/items/${id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi('/api/admin/menu/items', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      
      navigate('/admin');
    } catch (err) {
      if (err.message.includes('Conflict')) {
        setConflictError(true);
      } else {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Menu Item' : 'Create Menu Item'}</h1>
      </div>

      {conflictError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Conflict Detected</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Another staff member has modified this item while you were editing it. Your changes have not been saved to prevent overwriting their work.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-red-100 px-3 py-2 rounded text-red-800 font-medium hover:bg-red-200"
                >
                  Reload Latest Version
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              required
              value={formData.priceDollarString}
              onChange={e => setFormData({ ...formData, priceDollarString: e.target.value })}
              className="w-full border rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            required
            value={formData.categoryId}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            rows="3"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded overflow-hidden bg-gray-100 border flex items-center justify-center">
              {(uploadPreview || formData.imageUrl) ? (
                <img src={uploadPreview || formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">No image</span>
              )}
            </div>
            <div>
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, or WebP up to 5MB.</p>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={() => {
              if (window.confirm('Discard unsaved changes?')) navigate('/admin');
            }}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={uploading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 font-medium disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Save Draft'}
          </button>
        </div>
      </form>
    </div>
  );
}