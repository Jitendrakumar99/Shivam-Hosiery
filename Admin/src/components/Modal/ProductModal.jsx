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
  const [hasInitialized, setHasInitialized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    sku: '',
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
    minOrderQuantity: 0,
  });

  // Helper for variant management
  const [variantColor, setVariantColor] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const IMAGE_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

  useEffect(() => {
    dispatch(fetchCategories({ populateChildren: 'true' }));
  }, [dispatch]);

  useEffect(() => {
    if (product && mode === 'edit') {
      // Extract category ID from product.category object
      // product.category can be: { id: ObjectId, name: String, parent: String } or just a string/ID
      const categoryId = product.category?.id || product.category?._id || product.category;

      let parentCategory = '';
      let subCategory = '';

      // Only try to find category in list if categories are loaded
      if (categories.length > 0 && categoryId) {
        // Find the category in the categories list
        let productCategory = categories.find(c => {
          const cId = c._id || c.id;
          const pId = categoryId?._id || categoryId;
          return String(cId) === String(pId);
        });

        // If not found by ID, try by name
        if (!productCategory && product.category?.name) {
          productCategory = categories.find(c => c.name === product.category.name);
        }

        if (productCategory) {
          // Check if this category has a parent (it's a subcategory)
          // parent can be: populated object { _id, name, slug } or just ObjectId
          const parentId = productCategory.parent?._id || productCategory.parent || product.category?.parent;

          if (parentId) {
            // This is a subcategory
            const parentIdStr = String(parentId?._id || parentId);
            // Find the parent category in the list
            const parent = categories.find(c => {
              const cId = c._id || c.id;
              return String(cId) === parentIdStr;
            });

            if (parent) {
              parentCategory = String(parent._id || parent.id);
              subCategory = String(productCategory._id || productCategory.id);
            } else {
              // Parent not found in categories list, but we have the ID
              parentCategory = parentIdStr;
              subCategory = String(productCategory._id || productCategory.id);
            }
          } else {
            // This is a parent category (no parent)
            parentCategory = String(productCategory._id || productCategory.id);
            subCategory = '';
          }
        } else if (categoryId) {
          // Category not found in list, but we have the ID
          // Check if any category in the list has this category as its parent (making it a parent category)
          const hasChildren = categories.some(c => {
            const cParentId = c.parent?._id || c.parent;
            return cParentId && String(cParentId) === String(categoryId);
          });

          if (hasChildren) {
            // It's a parent category (has children)
            parentCategory = String(categoryId);
            subCategory = '';
          } else {
            // Check if it's a subcategory by looking for a category with this ID that has a parent
            const subCat = categories.find(c => {
              const cId = c._id || c.id;
              const cParentId = c.parent?._id || c.parent;
              return String(cId) === String(categoryId) && cParentId;
            });

            if (subCat) {
              // It's a subcategory
              const parentId = subCat.parent?._id || subCat.parent;
              parentCategory = String(parentId);
              subCategory = String(categoryId);
            } else {
              // Can't determine, assume it's a parent category
              parentCategory = String(categoryId);
              subCategory = '';
            }
          }
        }
      } else if (categoryId) {
        // Categories not loaded yet, but we have the category ID
        // Use product.category.parent if available to determine if it's a subcategory
        const productParentId = product.category?.parent;

        if (productParentId) {
          // It's a subcategory
          parentCategory = String(productParentId);
          subCategory = String(categoryId);
        } else {
          // Assume it's a parent category (will be corrected when categories load)
          parentCategory = String(categoryId);
          subCategory = '';
        }
      }

      setFormData({
        title: product.title || product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        parentCategory,
        subCategory,
        category: product.category?.name || '',
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
          quantity: v.inventory?.quantity ?? v.quantity ?? 0,
          sku: v.sku || ''
        })) || [],
        seo: {
          title: product.seo?.title || '',
          description: product.seo?.description || '',
          keywords: product.seo?.keywords?.join(', ') || '',
        },
        status: product.status || 'active',
        minOrderQuantity: product.minOrderQuantity || 0,
      });
    } else if (!product || mode !== 'edit') {
      // Reset form for add mode or when product is cleared
      setFormData({
        title: '',
        sku: '',
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
        minOrderQuantity: 0,
      });
      setHasInitialized(true);
      // Reset files when product changes
      setSelectedFiles([]);
      setPreviews([]);
    }
  }, [product, mode, isOpen, categories, hasInitialized]);

  // Reset initialization when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen]);

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

  const handleAddColorVariants = (colorInput) => {
    const color = (typeof colorInput === 'string' ? colorInput : variantColor);
    const price = formData.pricing.price;

    if (!price) {
      alert('Please set a Default Price first.');
      return;
    }
    if (!color) {
      alert('Please enter or select a color.');
      return;
    }

    const colorExists = formData.variants.some(v => v.color?.toLowerCase() === color.toLowerCase());
    if (colorExists) {
      alert(`Color "${color}" is already added.`);
      return;
    }

    const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];
    const newVariants = sizes.map(size => ({
      size,
      color,
      price: price,
      quantity: 100 // Default quantity
    }));

    setFormData({
      ...formData,
      variants: [...formData.variants, ...newVariants]
    });
    setVariantColor('');
  };

  const handleRemoveColorVariants = (colorToRemove) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter(v => v.color !== colorToRemove)
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
      sku: formData.sku,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: {
        ...(selectedCategoryId && /^[0-9a-fA-F]{24}$/.test(selectedCategoryId) ? { id: selectedCategoryId } : {}),
        name: selectedCategory?.name || formData.category || '',
      },
      pricing: {
        price: parseFloat(formData.pricing.price) || 0,
        compareAtPrice: parseFloat(formData.pricing.compareAtPrice) || 0,
        currency: 'INR'
      },
      images: formData.images.filter(i => i.trim()),
      attributes: formData.attributes,
      variants: formData.variants.map(v => ({
        size: v.size,
        color: v.color,
        price: parseFloat(v.price) || 0,
        inventory: { quantity: parseInt(v.quantity) || 0 },
        sku: v.sku || ''
      })),
      seo: {
        title: formData.seo.title,
        description: formData.seo.description,
        keywords: formData.seo.keywords ? formData.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
      },
      status: formData.status,
      minOrderQuantity: parseInt(formData.minOrderQuantity) || 0,
    };

    try {
      let response;
      if (selectedFiles.length > 0) {
        const data = new FormData();
        data.append('data', JSON.stringify(payload));
        selectedFiles.forEach(file => {
          data.append('images', file);
        });

        if (mode === 'edit' && product) {
          response = await dispatch(updateProduct({
            id: product._id || product.id,
            productData: data,
          })).unwrap();
        } else {
          response = await dispatch(createProduct(data)).unwrap();
        }
      } else {
        if (mode === 'edit' && product) {
          response = await dispatch(updateProduct({
            id: product._id || product.id,
            productData: payload,
          })).unwrap();
        } else {
          response = await dispatch(createProduct(payload)).unwrap();
        }
      }

      if (onSuccess) {
        onSuccess(response);
      } else {
        onClose();
      }
    } catch (error) {
      alert(error || 'Failed to save product');
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      alert('You can only have up to 5 images per product.');
      return;
    }

    setSelectedFiles(prev => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
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
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                  placeholder="Stock Keeping Unit"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                    <option key={cat._id || cat.id} value={String(cat._id || cat.id)}>
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
                    <option key={cat._id || cat.id} value={String(cat._id || cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Min Order Qty</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-orange-500"
                  placeholder="Min quantity"
                />
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                {/* Existing Images */}
                {formData.images.filter(img => img && img.trim()).map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square border rounded-lg overflow-hidden bg-gray-50">
                    <img 
                      src={img.startsWith('/') ? `${IMAGE_BASE_URL}${img}` : img} 
                      alt="Product" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-1 py-0.5 text-center">
                      Existing
                    </div>
                  </div>
                ))}

                {/* New Previews */}
                {previews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square border rounded-lg overflow-hidden bg-orange-50 ring-2 ring-orange-200">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-[10px] px-1 py-0.5 text-center">
                      New
                    </div>
                  </div>
                ))}

                {/* Upload Button */}
                {(formData.images.length + selectedFiles.length) < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] font-semibold text-gray-500 mt-1 uppercase">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                * You can upload up to 5 images. Images will be converted to WebP and optimized for speed.
              </p>
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
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Color to Add All Sizes
                </label>

                <div className="flex flex-wrap gap-3 items-center">
                  {/* Preset Colors */}
                  <div className="flex gap-2">
                    {['Red', 'Blue', 'Black', 'White', 'Green', 'Yellow', 'Pink'].map(
                      (color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setVariantColor(color.toLowerCase())}
                          className={`group flex flex-col items-center gap-1 p-1 rounded transition-colors
              ${variantColor === color.toLowerCase()
                              ? 'bg-orange-50 ring-1 ring-orange-200'
                              : 'hover:bg-gray-100'
                            }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm
                         group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                          <span
                            className={`text-[10px] ${variantColor === color.toLowerCase()
                              ? 'text-orange-600 font-bold'
                              : 'text-gray-500'
                              }`}
                          >
                            {color}
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  <div className="h-8 w-px bg-gray-300 mx-2" />

                  {/* Custom Color Picker (Same Size & Style) */}
                  <button
                    type="button"
                    className={`group flex flex-col items-center gap-1 p-1 rounded transition-colors
        ${variantColor &&
                        !['red', 'blue', 'black', 'white', 'green', 'yellow', 'pink'].includes(
                          variantColor
                        )
                        ? 'bg-orange-50 ring-1 ring-orange-200'
                        : 'hover:bg-gray-100'
                      }`}
                  >
                    <label className="cursor-pointer">
                      <input
                        type="color"
                        onChange={(e) => setVariantColor(e.target.value)}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300 shadow-sm
                     group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: variantColor || '#ffffff' }}
                      />
                    </label>
                    <span className="text-[10px] text-gray-500">Custom</span>
                  </button>

                  {/* Color Name / Hex Input */}
                  <input
                    type="text"
                    list="variant-colors"
                    value={variantColor}
                    onChange={(e) => setVariantColor(e.target.value)}
                    className="w-32 px-2 py-1.5 border text-sm rounded-lg"
                    placeholder="Color / Hex"
                  />

                  <datalist id="variant-colors">
                    {[
                      'Green',
                      'Yellow',
                      'Orange',
                      'Purple',
                      'Pink',
                      'Grey',
                      'Brown',
                      'Navy',
                      'Maroon',
                      'Beige',
                      'Cream',
                    ].map((c) => (
                      <option key={c} value={c.toLowerCase()} />
                    ))}
                  </datalist>

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={() => handleAddColorVariants()}
                    className="bg-orange-500 text-white px-4 py-1.5 rounded text-sm font-semibold
                 hover:bg-orange-600 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 mt-2">
                  * Select a color and click "Add" to generate variants for S, M, L, XL, XXL,
                  XXXL, and Free Size.
                </p>
              </div>


              {/* Added Colors Management */}
              {formData.variants.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Manage Added Colors</h5>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(formData.variants.map(v => v.color))].filter(Boolean).map(color => (
                      <div key={color} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm">
                        <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.toLowerCase() }} />
                        <span className="text-sm font-medium text-gray-700">{color}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariants(color)}
                          className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                          title={`Delete all ${color} variants`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
