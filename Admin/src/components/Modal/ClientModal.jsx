import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, updateClient } from '../../store/slices/clientSlice';

const ClientModal = ({ isOpen, onClose, client = null, mode = 'add', onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.clients);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    logo: '',
    websiteUrl: '',
    status: 'active',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  const IMAGE_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client.name || '',
        category: client.category || '',
        logo: client.logo || '',
        websiteUrl: client.websiteUrl || '',
        status: client.status || 'active',
      });
      setPreview(client.logo ? (client.logo.startsWith('/') ? `${IMAGE_BASE_URL}${client.logo}` : client.logo) : '');
    } else {
      setFormData({
        name: '',
        category: '',
        logo: '',
        websiteUrl: '',
        status: 'active',
      });
      setPreview('');
      setSelectedFile(null);
    }
  }, [client, mode, isOpen, IMAGE_BASE_URL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreview('');
    setFormData(prev => ({ ...prev, logo: '' }));
    
    // Revoke object URL if it was a selected file to avoid memory leaks
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('websiteUrl', formData.websiteUrl);
    data.append('status', formData.status);
    
    if (selectedFile) {
      data.append('logo', selectedFile);
    } else {
      // If no new file, send the current logo value (could be empty if deleted)
      data.append('logo', formData.logo || '');
    }

    try {
      if (mode === 'edit' && client) {
        await dispatch(updateClient({
          id: client._id || client.id,
          clientData: data,
        })).unwrap();
      } else {
        await dispatch(createClient(data)).unwrap();
      }
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      alert(error || 'Failed to save client');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Client' : 'Add New Client'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm"
            placeholder={mode === 'edit' ? 'Industrial Safety Solutions' : 'ABC Corporation'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm"
            placeholder={mode === 'edit' ? 'Manufacturing' : 'Construction'}
            list="industries"
          />
          <datalist id="industries">
            <option value="Construction" />
            <option value="Manufacturing" />
            <option value="Transportation" />
            <option value="Energy" />
            <option value="Infrastructure" />
            <option value="Mining" />
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Logo
          </label>
          
          <div className="flex items-center gap-4">
            {preview ? (
              <div className="relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <img 
                  src={preview} 
                  alt="Logo Preview" 
                  className="w-full h-full object-contain" 
                />
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1a1a2e] hover:bg-gray-50 transition-colors shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] font-semibold text-gray-500 mt-1 uppercase">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            
            <div className="flex-1 text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Upload company logo</p>
              <p>Recommended: Square image, WebP or PNG format. Max size: 5MB.</p>
              {selectedFile && (
                <p className="mt-1 text-[#1a1a2e] font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Website URL
          </label>
          <input
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm bg-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Client' : 'Add Client'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-semibold transition text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;

