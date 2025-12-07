import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../../store/slices/productSlice';

const ProductModal = ({ isOpen, onClose, product = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: 'https://images.unsplash.com/ph',
    description: '',
    features: '',
    sizes: 'S, M, L, XL, XXL',
    colors: 'Orange, Yellow, Green',
  });

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        image: product.image || 'https://images.unsplash.com/ph',
        description: product.description || '',
        features: product.features?.join('\n') || '',
        sizes: product.sizes?.join(', ') || 'S, M, L, XL, XXL',
        colors: product.colors?.join(', ') || 'Orange, Yellow, Green',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '0',
        image: 'https://images.unsplash.com/ph',
        description: '',
        features: 'Feature 1\nFeature 2\nFeature 3',
        sizes: 'S, M, L, XL, XXL',
        colors: 'Orange, Yellow, Green',
      });
    }
  }, [product, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.split('\n').filter(f => f.trim()),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      colors: formData.colors.split(',').map(c => c.trim()),
      stock: product?.stock || 0,
      minStock: product?.minStock || 0,
    };

    if (mode === 'edit' && product) {
      dispatch(updateProduct({
        id: product.id,
        ...productData,
      }));
    } else {
      dispatch(addProduct({
        id: Date.now(),
        ...productData,
      }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter product name"
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
              list="categories"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter category"
            />
            <datalist id="categories">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://..."
            />
          </div>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            placeholder="Enter product description"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sizes (comma separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="S, M, L, XL, XXL"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Colors (comma separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Orange, Yellow, Green"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
          >
            {mode === 'edit' ? 'Update Product' : 'Add Product'}
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

export default ProductModal;

