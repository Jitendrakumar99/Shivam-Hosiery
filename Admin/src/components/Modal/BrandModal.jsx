import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { addBrand, updateBrand } from '../../store/slices/brandSlice';

const BrandModal = ({ isOpen, onClose, brand = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    slogan: '',
    description: '',
    fullDescription: '',
    logo: 'https://images.unsplash.com/p',
    image: 'https://images.unsplash.com/p',
    websitePath: '/trana',
    features: 'Feature 1\nFeature 2\nFeature 3',
  });

  useEffect(() => {
    if (brand && mode === 'edit') {
      setFormData({
        name: brand.name || '',
        category: brand.category || '',
        slogan: brand.slogan || '',
        description: brand.description || '',
        fullDescription: brand.fullDescription || '',
        logo: brand.logo || 'https://images.unsplash.com/p',
        image: brand.image || 'https://images.unsplash.com/p',
        websitePath: brand.websitePath || '/trana',
        features: Array.isArray(brand.features) ? brand.features.join('\n') : (brand.features || 'Feature 1\nFeature 2\nFeature 3'),
      });
    } else {
      setFormData({
        name: '',
        category: '',
        slogan: '',
        description: '',
        fullDescription: '',
        logo: 'https://images.unsplash.com/p',
        image: 'https://images.unsplash.com/p',
        websitePath: '/trana',
        features: 'Feature 1\nFeature 2\nFeature 3',
      });
    }
  }, [brand, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const brandData = {
      ...formData,
      features: formData.features.split('\n').filter(f => f.trim()),
    };

    if (mode === 'edit' && brand) {
      dispatch(updateBrand({
        id: brand.id,
        ...brandData,
      }));
    } else {
      dispatch(addBrand({
        id: Date.now(),
        ...brandData,
      }));
    }
    onClose();
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
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] resize-none"
            placeholder="Enter full description of the brand"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
              placeholder="https://..."
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Website Path <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.websitePath}
            onChange={(e) => setFormData({ ...formData, websitePath: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="/trana"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Features (one per line) <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] resize-none font-mono text-sm"
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition"
          >
            {mode === 'edit' ? 'Update Brand' : 'Add Brand'}
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

