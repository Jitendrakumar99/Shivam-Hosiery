import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createBrand, updateBrand } from '../../store/slices/brandSlice';

const BrandModal = ({ isOpen, onClose, brand = null, mode = 'add', onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.brands);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    slogan: '',
    description: '',
    image: '',
    websiteUrl: '',
    status: 'active',
  });

  useEffect(() => {
    if (brand && mode === 'edit') {
      setFormData({
        name: brand.name || '',
        category: brand.category || '',
        slogan: brand.slogan || '',
        description: brand.description || '',
        image: brand.image || '',
        websiteUrl: brand.websiteUrl || '',
        status: brand.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        slogan: '',
        description: '',
        image: '',
        websiteUrl: '',
        status: 'active',
      });
    }
  }, [brand, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const brandData = {
      name: formData.name,
      category: formData.category,
      slogan: formData.slogan,
      description: formData.description,
      image: formData.image,
      websiteUrl: formData.websiteUrl,
      status: formData.status,
    };

    try {
      if (mode === 'edit' && brand) {
        await dispatch(updateBrand({
          id: brand._id || brand.id,
          brandData,
        })).unwrap();
      } else {
        await dispatch(createBrand(brandData)).unwrap();
      }
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      alert(error || 'Failed to save brand');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Brand' : 'Add New Brand'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
              placeholder="Casual Wear"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tagline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.slogan}
            onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="Style Meets Comfort"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] resize-none"
            placeholder="Everyday casual clothing with quality and comfort."
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Website URL
          </label>
          <input
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="https://..."
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Brand' : 'Add Brand'}
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

export default BrandModal;

