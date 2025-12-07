import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { addClient, updateClient } from '../../store/slices/clientSlice';

const ClientModal = ({ isOpen, onClose, client = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
  });

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client.name || '',
        category: client.category || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
      });
    }
  }, [client, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'edit' && client) {
      dispatch(updateClient({
        id: client.id,
        ...formData,
        logo: client.logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      }));
    } else {
      dispatch(addClient({
        id: Date.now(),
        ...formData,
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Client' : 'Add New Client'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder={mode === 'edit' ? 'Industrial Safety Solutions' : 'ABC Corporation'}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Industry <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition"
          >
            {mode === 'edit' ? 'Update Client' : 'Add Client'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;

