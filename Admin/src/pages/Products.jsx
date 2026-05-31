import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, deleteProduct } from '../store/slices/productSlice';
import ProductModal from '../components/Modal/ProductModal';

const ITEMS_PER_PAGE = 500;

const Products = () => {
  const { products, loading, pagination } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadProducts = useCallback(() => {
    const params = {
      limit: ITEMS_PER_PAGE,
      page: 1,
      status: statusFilter,
    };
    if (searchQuery) {
      params.search = searchQuery;
    }
    dispatch(fetchProducts(params));
  }, [dispatch, searchQuery, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getProductStock = (product) => {
    if (typeof product.totalStock === 'number') return product.totalStock;
    if (!product.variants?.length) return 0;
    return product.variants.reduce(
      (sum, v) => sum + (v.inventory?.quantity ?? v.quantity ?? 0),
      0
    );
  };

  const displayedProducts = products;
  const totalCount = pagination?.totalItems ?? products.length;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id)).then(() => loadProducts());
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage all products — search by name, SKU, category, size, or color
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base shrink-0"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, SKU, category, description, size, color..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm bg-white min-w-[140px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
          {(searchInput || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap"
            >
              Clear filters
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {loading
            ? 'Loading products...'
            : `Showing ${displayedProducts.length} of ${totalCount} product${totalCount === 1 ? '' : 's'}`}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {!loading && displayedProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">
            {searchQuery
              ? `No products found matching "${searchQuery}".`
              : 'No products found. Add your first product!'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product._id || product.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 min-w-20 sm:min-w-24 shrink-0">
                <img
                  src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-1.5 sm:mb-2 flex flex-wrap gap-1">
                  <span className="bg-orange-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold inline-block">
                    {product.category?.name || product.category || 'Uncategorized'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      product.status === 'inactive'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {product.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                  {product.title || product.name}
                </h3>
                {product.sku && (
                  <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>
                )}

                <p className="text-lg sm:text-xl font-bold text-orange-500">
                  ₹{product.pricing?.price?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                </p>
                {(() => {
                  const stock = getProductStock(product);
                  const stockClass =
                    stock === 0
                      ? 'bg-red-100 text-red-800'
                      : stock < 10
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800';
                  return (
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-semibold ${stockClass}`}>
                      Stock: {stock}
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex-1 flex flex-col">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex-1 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition text-xs sm:text-sm"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id || product.id)}
                  className="p-1.5 sm:p-2 border border-gray-300 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        mode={modalMode}
        onSuccess={() => {
          loadProducts();
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default Products;
