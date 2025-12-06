import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productSlice';
import { addToWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { products, loading, error, pagination } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory, searchQuery]);

  // Fetch wishlist when authenticated to check which products are in wishlist
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleCategoryChange = (category) => {
    const categoryValue = category.toLowerCase().replace(' ', '-');
    setSelectedCategory(categoryValue);
    if (categoryValue === 'all') {
      setSearchParams({});
      // No need to dispatch fetchProducts here, useEffect will handle it
    } else {
      setSearchParams({ category: categoryValue });
      // No need to dispatch fetchProducts here, useEffect will handle it
    }
  };

  const categories = ['All', 'Safety Vests', 'Safety Jackets', 'Coveralls'];

  // Filter products client-side for search query
  // This client-side filter is no longer needed as search is handled by the backend.
  // Leaving it here as a placeholder in case client-side filtering is needed for other properties later.
  const filteredProducts = products; // products are already filtered by backend

  // Check if product is in cart
  const isInCart = (product) => {
    const productId = String(product._id || product.id);
    return cartItems.some(item => {
      const itemProductId = String(item.product._id || item.product.id);
      return itemProductId === productId;
    });
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.items) return false;
    const id = productId._id || productId.id || productId;
    return wishlist.items.some(item => 
      (item.product?._id || item.product?.id) === id
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-trana-orange text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg md:text-xl">
            Explore our comprehensive range of safety garments designed for maximum protection and visibility.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                />
                <span className="absolute left-3 top-2.5">🔍</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg transition ${
                    (selectedCategory === 'all' && category === 'All') ||
                    category.toLowerCase().replace(' ', '-') === selectedCategory
                      ? 'bg-trana-orange text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchProducts())}
                className="bg-trana-orange text-white px-6 py-2 rounded hover:bg-orange-600 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id || product.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <Link to={`/products/${product._id || product.id}`}>
                      <div className="h-64 bg-gray-200 flex items-center justify-center cursor-pointer relative">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <span className="text-gray-500">{product.name} Image</span>
                        )}
                        {/* Customize Icon */}
                        <Link
                          to={'/customize'}
                          state={{ productImage: product.images && product.images.length > 0 ? product.images[0] : null }}
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200"
                          title="Customize this product"
                        >
                          <svg className="w-5 h-5 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </Link>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <Link to={`/products/${product._id || product.id}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-trana-orange transition cursor-pointer">{product.name}</h3>
                      </Link>
                      <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Key Features:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {product.features?.slice(0, 3).map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-bold text-trana-orange">Starting from ₹{product.price}</p>
                        <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {isInCart(product) ? (
                          <button
                            onClick={() => {
                              dispatch(removeFromCart(product._id || product.id));
                              toast.success(`${product.name} removed from cart!`);
                            }}
                            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                          >
                            Remove from Cart
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              dispatch(addToCart({ product, quantity: 1 }));
                              toast.success(`${product.name} added to cart!`);
                            }}
                            disabled={product.stock <= 0}
                            className="flex-1 bg-trana-orange text-white py-2 rounded hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add to Cart
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (isAuthenticated) {
                              if (isInWishlist(product._id || product.id)) {
                                toast.info('Product is already in your wishlist');
                                return;
                              }
                              const result = await dispatch(addToWishlist(product._id || product.id));
                              if (addToWishlist.fulfilled.match(result)) {
                                toast.success(`${product.name} added to wishlist!`);
                                // Refresh wishlist to update UI
                                dispatch(fetchWishlist());
                              } else {
                                const errorMsg = result.payload || 'Failed to add to wishlist';
                                if (errorMsg.includes('already in wishlist')) {
                                  toast.info('Product is already in your wishlist');
                                  // Refresh wishlist to ensure UI is in sync
                                  dispatch(fetchWishlist());
                                } else {
                                  toast.error(errorMsg);
                                }
                              }
                            } else {
                              toast.error('Please login to add to wishlist');
                              navigate('/login');
                            }
                          }}
                          className={`px-4 py-2 border rounded transition ${
                            isInWishlist(product._id || product.id)
                              ? 'border-green-500 text-green-600 bg-green-50'
                              : 'border-trana-orange text-trana-orange hover:bg-orange-50'
                          }`}
                          title={isInWishlist(product._id || product.id) ? 'Already in wishlist' : 'Add to wishlist'}
                        >
                          {isInWishlist(product._id || product.id) ? '✓' : '❤️'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pagination && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => dispatch(fetchProducts({ page }))}
                      className={`px-4 py-2 rounded ${
                        page === pagination.currentPage
                          ? 'bg-trana-orange text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Bulk Quantities Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Bulk Quantities?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get special pricing and dedicated support for bulk orders. Contact our sales team or use our B2B portal for enterprise solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-trana-orange text-white px-8 py-3 rounded font-semibold hover:bg-orange-600 transition"
            >
              Request Bulk Quote
            </Link>
            <Link
              to="/contact"
              className="bg-trana-orange text-white px-8 py-3 rounded font-semibold hover:bg-orange-600 transition"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
