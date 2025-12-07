import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { addCategory, updateCategory } from '../../store/slices/categorySlice';

const CategoryModal = ({ isOpen, onClose, category = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1640236889867-2bf2c34f7d8f?w=',
    status: 'active',
  });

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || 'https://images.unsplash.com/photo-1640236889867-2bf2c34f7d8f?w=',
        status: category.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1640236889867-2bf2c34f7d8f?w=',
        status: 'active',
      });
    }
  }, [category, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'edit' && category) {
      dispatch(updateCategory({
        id: category.id,
        ...formData,
      }));
    } else {
      dispatch(addCategory({
        id: Date.now(),
        ...formData,
      }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Category' : 'Add New Category'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] resize-none"
            placeholder="Enter category description"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.status === 'active'}
            onChange={(e) => setFormData({
              ...formData,
              status: e.target.checked ? 'active' : 'inactive',
            })}
            className="w-4 h-4 text-[#1a1a2e] border-gray-300 rounded focus:ring-[#1a1a2e]"
          />
          <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition"
          >
            {mode === 'edit' ? 'Update Category' : 'Add Category'}
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

export default CategoryModal;

