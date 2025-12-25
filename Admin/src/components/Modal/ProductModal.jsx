import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';

const ProductModal = ({ isOpen, onClose, product = null, mode = 'add', onSuccess }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { loading } = useSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    parentCategory: '',
    subCategory: '',
    category: '',
    pricing: {
      price: '',
      compareAtPrice: '',
    },
    images: [''],
    attributes: {
      gender: 'Unisex',
      fabric: '',
      length: '',
      sleeve: '',
    },
    variants: [],
    seo: {
      title: '',
      description: '',
      keywords: '',
    },
    status: 'active',
  });

  // Helper for variant management
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    dispatch(fetchCategories({ populateChildren: 'true' }));
  }, [dispatch]);

  useEffect(() => {
    if (product && mode === 'edit') {
      // Find parent and subcategory from product category
      const productCategory = categories.find(c => c._id === product.category || c.name === product.category);
      let parentCategory = '';
      let subCategory = '';
      
      if (productCategory) {
        if (productCategory.parent) {
          // This is a subcategory, find its parent
          const parent = categories.find(c => c._id === productCategory.parent);
          parentCategory = parent?._id || '';
          subCategory = productCategory._id || '';
        } else {
          // This is a parent category
          parentCategory = productCategory._id || '';
          subCategory = '';
        }
      }

      setFormData({
        title: product.title || product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        parentCategory,
        subCategory,
        category: product.category?.name || product.category || '',
        pricing: {
          price: product.pricing?.price || product.price || '',
          compareAtPrice: product.pricing?.compareAtPrice || '',
        },
        images: product.images && product.images.length > 0 ? product.images : [''],
        attributes: {
          gender: product.attributes?.gender || 'Unisex',
          fabric: product.attributes?.fabric || '',
          length: product.attributes?.length || '',
          sleeve: product.attributes?.sleeve || '',
        },
        variants: product.variants?.map(v => ({
          size: v.size,
          color: v.color,
          price: v.price,
          quantity: v.inventory?.quantity
        })) || [],
        seo: {
          title: product.seo?.title || '',
          description: product.seo?.description || '',
          keywords: product.seo?.keywords?.join(', ') || '',
        },
        status: product.status || 'active',
      });
    } else {
      // Reset form
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        parentCategory: '',
        subCategory: '',
        category: '',
        pricing: { price: '', compareAtPrice: '' },
        images: [''],
        attributes: { gender: 'Unisex', fabric: '', length: '', sleeve: '' },
        variants: [],
        seo: { title: '', description: '', keywords: '' },
        status: 'active',
      });
    }
  }, [product, mode, isOpen, categories]);

  // Helper functions for category selection
  const getParentCategories = () => {
    return categories.filter(c => !c.parent);
  };

  const getSubCategories = (parentId) => {
    const parent = categories.find(c => (c._id === parentId || c.id === parentId));
    if (parent && parent.children) {
      return parent.children;
    }
    // Fallback to manual filtering
    return categories.filter(c => c.parent && (c.parent._id === parentId || c.parent === parentId));
  };

  const availableSubCategories = getSubCategories(formData.parentCategory);

  const handleParentCategoryChange = (e) => {
    const newParentId = e.target.value;
    setFormData({
      ...formData,
      parentCategory: newParentId,
      subCategory: '', // Reset subcategory when parent changes
    });
  };

  const handleSubCategoryChange = (e) => {
    setFormData({
      ...formData,
      subCategory: e.target.value,
    });
  };

  const handleAddVariant = () => {
    if (!newVariant.size || !newVariant.price || !newVariant.quantity) {
      alert('Size, Price, and Quantity are required for a variant');
      return;
    }
    setFormData({
      ...formData,
      variants: [...formData.variants, { ...newVariant }]
    });
    setNewVariant({ size: '', color: '', price: formData.pricing.price || '', quantity: '' });
  };

  const handleGenerateVariants = () => {
    const price = formData.pricing.price;
    if (!price) {
      alert('Please set a Default Price first to generate variants.');
      return;
    }

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['Red', 'Blue'];
    const generatedVariants = [];

    sizes.forEach(size => {
      colors.forEach(color => {
        generatedVariants.push({
          size,
          color,
          price: price,
          quantity: 100 // Default quantity
        });
      });
    });

    setFormData({
      ...formData,
      variants: generatedVariants
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct payload
    // Determine the category to use (subcategory if selected, otherwise parent)
    const selectedCategoryId = formData.subCategory || formData.parentCategory;
    const selectedCategory = categories.find(c => (c._id === selectedCategoryId || c.id === selectedCategoryId));
    
    const payload = {
      title: formData.title,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: {
        id: selectedCategoryId,
        name: selectedCategory?.name || '',
      },
      pricing: {
        price: parseFloat(formData.pricing.price),
        compareAtPrice: parseFloat(formData.pricing.compareAtPrice) || 0,
        currency: 'INR'
      },
      images: formData.images.filter(i => i.trim()),
      attributes: formData.attributes,
      variants: formData.variants.map(v => ({
        size: v.size,
        color: v.color,
        price: parseFloat(v.price),
        inventory: { quantity: parseInt(v.quantity) }
      })),
      seo: {
        title: formData.seo.title,
        description: formData.seo.description,
        keywords: formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean)
      },
      status: formData.status
    };

    try {
      if (mode === 'edit' && product) {
        await dispatch(updateProduct({
          id: product._id || product.id,
          productData: payload,
        })).unwrap();
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }
      if (onSuccess) {
        onSuccess(payload); // Passing payload back can help generic refresh
      } else {
        onClose();
      }
    } catch (error) {
      alert(error || 'Failed to save product');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'variants', label: 'Variants & Price' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Product' : 'Add New Product'}
      size="2xl"
    >
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC INFO TAB */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                placeholder="Product Title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Category *</label>
                <select
                  required
                  value={formData.parentCategory}
                  onChange={handleParentCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                >
                  <option value="">Select Parent Category</option>
                  {getParentCategories().map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sub Category</label>
                <select
                  value={formData.subCategory}
                  onChange={handleSubCategoryChange}
                  disabled={!formData.parentCategory}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500 disabled:bg-gray-100"
                >
                  <option value="">Select Sub Category</option>
                  {availableSubCategories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                placeholder="Brief summary for listings"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                placeholder="Full product description"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Images</label>
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[idx] = e.target.value;
                      setFormData({ ...formData, images: newImages });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
              >
                + Add Image
              </button>
            </div>
          </div>
        )}

        {/* VARIANTS & PRICE TAB */}
        {activeTab === 'variants' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Base Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Default Price *</label>
                  <input
                    type="number"
                    required={formData.variants.length === 0} // Optional if variants imply price
                    min="0"
                    value={formData.pricing.price}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, price: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Compare At Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.pricing.compareAtPrice}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: { ...formData.pricing, compareAtPrice: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Variants</h4>
                <button
                  type="button"
                  onClick={handleGenerateVariants}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition"
                  title="Generates 10 variants: S, M, L, XL, XXL x Red, Blue"
                >
                  Generate Default Variants
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 items-end bg-gray-50 p-3 rounded">
                <div>
                  <label className="block text-xs text-gray-600">Size</label>
                  <select
                    value={newVariant.size}
                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                    className="w-24 px-2 py-1 border rounded"
                  >
                    <option value="">Select</option>
                    {['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Color</label>
                  <input
                    type="text"
                    list="variant-colors"
                    value={newVariant.color}
                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                    className="w-32 px-2 py-1 border rounded"
                    placeholder="Color"
                  />
                  <datalist id="variant-colors">
                    {['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Orange', 'Purple', 'Pink', 'Grey', 'Brown', 'Navy', 'Maroon', 'Beige', 'Cream'].map(c => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Price</label>
                  <input
                    type="number"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                    className="w-24 px-2 py-1 border rounded"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Qty</label>
                  <input
                    type="number"
                    value={newVariant.quantity}
                    onChange={(e) => setNewVariant({ ...newVariant, quantity: e.target.value })}
                    className="w-20 px-2 py-1 border rounded"
                    placeholder="Qty"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                >
                  Add
                </button>
              </div>

              <div className="border rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Size</th>
                      <th className="px-3 py-2 text-left">Color</th>
                      <th className="px-3 py-2 text-right">Price</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-3 py-4 text-center text-gray-500">No variants added</td>
                      </tr>
                    ) : (
                      formData.variants.map((v, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{v.size}</td>
                          <td className="px-3 py-2">{v.color || '-'}</td>
                          <td className="px-3 py-2 text-right">₹{v.price}</td>
                          <td className="px-3 py-2 text-right">{v.quantity}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(i)}
                              className="text-red-500 hover:text-red-700"
                            >
                              remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ATTRIBUTES TAB */}
        {activeTab === 'attributes' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <select
                value={formData.attributes.gender}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, gender: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              >
                <option value="Unisex">Unisex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fabric</label>
              <input
                type="text"
                value={formData.attributes.fabric}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, fabric: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Length</label>
              <input
                type="text"
                value={formData.attributes.length}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, length: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sleeve</label>
              <input
                type="text"
                value={formData.attributes.sleeve}
                onChange={(e) => setFormData({
                  ...formData,
                  attributes: { ...formData.attributes, sleeve: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.seo.title}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={formData.seo.description}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={formData.seo.keywords}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: { ...formData.seo, keywords: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;
