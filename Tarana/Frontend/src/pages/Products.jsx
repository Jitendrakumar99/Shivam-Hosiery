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
  
  // Normalize category from URL
  const normalizeCategoryFromURL = (categoryParam) => {
    if (!categoryParam || categoryParam === 'all') return 'all';
    
    // Convert URL format to display format
    const categoryMap = {
      'safety-vests': 'Safety Vests',
      'safety-jackets': 'Safety Jackets',
      'coveralls': 'Coveralls'
    };
    
    // Handle URL encoded spaces (+)
    const decoded = decodeURIComponent(categoryParam).replace(/\+/g, ' ');
    
    // Check if it's already in correct format
    if (['Safety Vests', 'Safety Jackets', 'Coveralls'].includes(decoded)) {
      return decoded;
    }
    
    // Try to match from categoryMap (case-insensitive)
    const lowerDecoded = decoded.toLowerCase().replace(/-/g, '-');
    for (const [key, value] of Object.entries(categoryMap)) {
      if (key === lowerDecoded || value.toLowerCase() === decoded.toLowerCase()) {
        return value;
      }
    }
    
    return decoded; // Return as-is if no match
  };
  
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategoryFromURL(searchParams.get('category')) || 'all'
  );
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const { products, loading, error, pagination } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (searchQuery && searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory, searchQuery]);

  // Sync URL with selected category on mount/URL change
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      const normalizedURL = normalizeCategoryFromURL(urlCategory);
      if (normalizedURL !== selectedCategory) {
        setSelectedCategory(normalizedURL);
      }
    } else if (selectedCategory !== 'all') {
      // If no category in URL but we have one selected, reset to all
      setSelectedCategory('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch wishlist when authenticated to check which products are in wishlist
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleCategoryChange = (category) => {
    const categoryValue = category === 'All' ? 'all' : category;
    setSelectedCategory(categoryValue);
    if (categoryValue === 'all') {
      setSearchParams({});
    } else {
      // Convert to URL-friendly format (lowercase with hyphens)
      const urlCategory = categoryValue.toLowerCase().replace(/\s+/g, '-');
      setSearchParams({ category: urlCategory });
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
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg transition ${
                    (selectedCategory === 'all' && category === 'All') ||
                    category === selectedCategory
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
                    <div className="h-72 bg-gray-200 flex items-center justify-center relative group">
                      <Link to={`/products/${product._id || product.id}`} className="absolute inset-0 z-0 ">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-fit hover:scale-105  transition-transform duration-300" />
                        ) : (
                          <span className="text-gray-500">{product.name} Image</span>
                        )}
                      </Link>
                      {/* Customize Icon - using button with navigate to avoid nested links */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate('/customize', { state: { productImage: product.images && product.images.length > 0 ? product.images[0] : null } });
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200 z-10"
                        title="Customize this product"
                      >
                        <svg className="w-5 h-5 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <Link to={`/products/${product._id || product.id}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-trana-orange transition cursor-pointer">{product.name}</h3>
                      </Link>
                      <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-bold text-trana-orange">Starting from ₹{product.price}</p>
                        <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {isInCart(product) ? (
                          <Link
                            to="/cart"
                            className="flex-1 bg-trana-orange text-white py-2 rounded hover:bg-orange-600 transition text-center"
                          >
                            View Cart
                          </Link>
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
                          {isInWishlist(product._id || product.id) ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
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
