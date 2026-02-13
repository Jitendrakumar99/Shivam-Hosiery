import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productSlice';
import { addToWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { createFlyingAnimation, triggerCartBounce, triggerWishlistAnimation } from '../utils/animations';
import toast from 'react-hot-toast';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const parentSlug = searchParams.get('parentSlug');
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategoryFromURL(searchParams.get('category')) || 'all'
  );
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { products, loading, error, pagination } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'all') {
      params.category = selectedCategory;
    } else if (parentSlug) {
      params.parentSlug = parentSlug;
    }
    if (searchQuery && searchQuery.trim()) {
      params.search = searchQuery.trim();
      // When searching, show all results without pagination
    } else {
      // Only apply pagination when not searching
      params.page = currentPage;
    }
    dispatch(fetchProducts(params));
  }, [dispatch, selectedCategory, searchQuery, currentPage, parentSlug]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

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

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
  }, [dispatch]);

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
      // Preserve parentSlug if present
      if (parentSlug) {
        setSearchParams({ parentSlug });
      } else {
        setSearchParams({});
      }
    } else {
      // Convert to URL-friendly format (lowercase with hyphens)
      const urlCategory = categoryValue.toLowerCase().replace(/\s+/g, '-');
      // Preserve parentSlug for context
      if (parentSlug) {
        setSearchParams({ parentSlug, category: urlCategory });
      } else {
        setSearchParams({ category: urlCategory });
      }
    }
  };

  // Build categories array with 'All' option plus dynamic categories from database
  // Build child categories list; hide parent categories from the filter options
  const childCategories = categories.filter(cat => cat.parent && (!parentSlug || cat.parent.slug === parentSlug));
  const categoryOptions = ['All', ...childCategories.map(cat => cat.name)];

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

  const productRefs = useRef({});

  const animateFlyToCart = (productId, productImage) => {
    const productElement = productRefs.current[productId];
    const cartIcon = document.getElementById('header-cart-icon');

    if (!productElement || !cartIcon || !productImage) return;

    const rect = productElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = productImage;
    flyer.className = 'flying-item';
    flyer.style.left = `${rect.left + rect.width / 2 - 40}px`;
    flyer.style.top = `${rect.top + rect.height / 2 - 40}px`;
    flyer.style.width = '80px';
    flyer.style.height = '80px';
    flyer.style.borderRadius = '50%';
    flyer.style.objectFit = 'cover';
    flyer.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    flyer.style.opacity = '1';

    document.body.appendChild(flyer);

    // Force reflow
    flyer.offsetWidth;

    flyer.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
    flyer.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
    flyer.style.width = '20px';
    flyer.style.height = '20px';
    flyer.style.opacity = '0.5';
    flyer.style.transform = 'scale(0.5) rotate(360deg)';

    setTimeout(() => {
      flyer.remove();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-trana-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg md:text-xl">
            Explore our comprehensive range of safety garments designed for maximum protection and visibility.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-4">
            {/* Full width search bar */}
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category filters - only show when there's a parentSlug */}
            {parentSlug && (
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-lg transition ${(selectedCategory === 'all' && category === 'All') ||
                      category === selectedCategory
                      ? 'bg-trana-primary text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchProducts())}
                className="bg-trana-primary text-white px-6 py-2 rounded hover:bg-green-700 transition"
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
                  <div
                    key={product._id || product.id}
                    ref={el => productRefs.current[product._id || product.id] = el}
                    className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden product-card"
                  >
                    <div className="h-72 bg-gray-200 flex items-center justify-center relative group">
                      <Link to={`/products/${product._id || product.id}`} className="absolute inset-0 z-0 ">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain product-image-zoom transition-transform duration-500" />
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
                        <svg className="w-5 h-5 text-trana-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-1">{product.category?.name || product.category}</p>
                      <Link to={`/products/${product._id || product.id}`}>
                        <h3 className="text-xl font-bold mb-2 hover:text-trana-primary transition-colors duration-300 cursor-pointer">{product.title || product.name}</h3>
                      </Link>

                      {/* Rating */}
                      {product.rating && product.rating.count > 0 && (
                        <div className="flex items-center gap-2 mb-2 transition-all duration-300">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(product.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating.average.toFixed(1)} ({product.rating.count})
                          </span>
                        </div>
                      )}

                      <p className="text-gray-600 mb-4 text-sm line-clamp-2">{product.shortDescription || product.description}</p>

                      <div className="flex justify-between items-center mb-0 transition-all duration-300">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-lg font-bold text-trana-primary">
                              ₹{product.pricing?.price || product.price}
                            </p>
                            {product.pricing?.compareAtPrice > 0 && product.pricing.compareAtPrice > product.pricing.price && (
                              <>
                                <p className="text-sm text-gray-500 line-through">
                                  ₹{product.pricing.compareAtPrice}
                                </p>
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                  {Math.round(((product.pricing.compareAtPrice - product.pricing.price) / product.pricing.compareAtPrice) * 100)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 actions-reveal">
                        {isInCart(product) ? (
                          <Link
                            to="/cart"
                            className="flex-1 bg-trana-primary text-white py-2 rounded hover:bg-green-700 transition text-center"
                          >
                            View Cart
                          </Link>
                        ) : (
                          product.variants && product.variants.length > 0 ? (
                            <Link
                              to={`/products/${product._id || product.id}`}
                              className="flex-1 bg-[#1a1a2e] text-white py-2 rounded hover:bg-[#16213e] transition text-center"
                            >
                              View Options
                            </Link>
                          ) : (
                            <button
                              onClick={(e) => {
                                const productImage = e.currentTarget.closest('.bg-white').querySelector('img');

                                // Trigger flying animation - will automatically target cart icon in header (right side)
                                if (productImage && product.images && product.images.length > 0) {
                                  createFlyingAnimation(product.images[0], productImage);
                                  setTimeout(() => {
                                    triggerCartBounce();
                                  }, 300);
                                }

                                dispatch(addToCart({ product, quantity: 1 }));
                                animateFlyToCart(product._id || product.id, product.images?.[0]);
                                toast.success(`${product.name || product.title} added to cart!`, {
                                  icon: '🛒',
                                  duration: 2000,
                                  position: 'bottom-right',
                                });
                              }}
                              className="flex-1 bg-trana-primary text-white py-2 rounded-full font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg active:scale-95"
                            >
                              Add to Cart
                            </button>
                          )
                        )}
                        <button
                          onClick={async (e) => {
                            if (isAuthenticated) {
                              if (isInWishlist(product._id || product.id)) {
                                toast.info('Product is already in your wishlist');
                                return;
                              }

                              // Trigger wishlist animation
                              triggerWishlistAnimation(e.currentTarget);

                              const result = await dispatch(addToWishlist(product._id || product.id));
                              if (addToWishlist.fulfilled.match(result)) {
                                toast.success(`${product.name} added to wishlist!`, {
                                  duration: 2000,
                                  position: 'bottom-right',
                                });
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
                          className={`px-4 py-2 border rounded transition ${isInWishlist(product._id || product.id)
                            ? 'border-green-500 text-green-600 bg-green-50'
                            : 'border-trana-primary text-trana-primary hover:bg-green-50'
                            }`}
                          title={isInWishlist(product._id || product.id) ? 'Already in wishlist' : 'Add to wishlist'}
                        >
                          {isInWishlist(product._id || product.id) ? (
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {!searchQuery && pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded ${page === currentPage
                        ? 'bg-trana-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section >

      {/* Bulk Quantities Section */}
      < section className="py-12 bg-gray-50" >
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Bulk Quantities?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get special pricing and dedicated support for bulk orders. Contact our sales team or use our B2B portal for enterprise solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-trana-dark text-white px-8 py-3 rounded font-semibold hover:bg-green-900 transition"
            >
              Request Bulk Quote
            </Link>
            <Link
              to="/contact"
              className="bg-trana-primary text-white px-8 py-3 rounded font-semibold hover:bg-green-700 transition"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </section >
    </div >
  );
};

export default Products;
