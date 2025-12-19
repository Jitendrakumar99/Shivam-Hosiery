import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, updateCategory } from '../../store/slices/categorySlice';

const CategoryModal = ({ isOpen, onClose, category = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    image: '',
    parent: '',
  });

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'active',
        image: category.image || '',
        parent: category.parent?._id || category.parent || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        image: '',
        parent: '',
      });
    }
  }, [category, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent: formData.parent || null, // Ensure empty string becomes null
    };

    if (mode === 'edit' && category) {
      dispatch(updateCategory({
        id: category._id || category.id,
        categoryData: payload,
      }));
    } else {
      dispatch(createCategory(payload));
    }
    onClose();
  };

  // Filter out the current category from potential parents to prevent cycles (simple check)
  const availableParents = categories.filter(c =>
    mode !== 'edit' || (c._id !== category?._id && c.id !== category?.id)
  );

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
            Category Image URL
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Parent Category
          </label>
          <select
            value={formData.parent}
            onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
          >
            <option value="">None (Top Level)</option>
            {availableParents.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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

