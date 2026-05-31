import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/slices/productSlice';
import { addToWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { createFlyingAnimation, triggerCartBounce, triggerWishlistAnimation } from '../utils/animations';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const [sortBy, setSortBy] = useState('newest');
  const [expandedParents, setExpandedParents] = useState({});

  // Normalize category from URL
  const normalizeCategoryFromURL = (categoryParam) => {
    if (!categoryParam || categoryParam === 'all') return 'all';

    // Try to convert slug to Title Case (e.g., 'lab-coats' -> 'Lab Coats')
    const decoded = decodeURIComponent(categoryParam)
      .replace(/\+/g, ' ')
      .replace(/-/g, ' ');

    return decoded.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
    params.limit = ITEMS_PER_PAGE;
    params.page = currentPage;
    if (searchQuery && searchQuery.trim()) {
      params.search = searchQuery.trim();
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

  // Fix selectedCategory once categories load to match database Exactly (case sensitivity)
  useEffect(() => {
    if (categories.length > 0 && selectedCategory !== 'all') {
      const normalizedCurrent = selectedCategory.toLowerCase().replace(/[-\s]+/g, '-');
      const match = categories.find(cat =>
        cat.name.toLowerCase().replace(/[-\s]+/g, '-') === normalizedCurrent
      );
      if (match && match.name !== selectedCategory) {
        setSelectedCategory(match.name);
      }
    }
  }, [categories, selectedCategory]);

  const handleCategoryChange = (category, isParent = false, forceReset = false) => {
    if (isParent) {
      setExpandedParents(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
      return;
    }

    const categoryValue = category === 'All' ? 'all' : category;
    setSelectedCategory(categoryValue);

    if (categoryValue === 'all') {
      if (parentSlug && !forceReset) {
        setSearchParams({ parentSlug });
      } else {
        setSearchParams({});
      }
    } else {
      const urlCategory = categoryValue.toLowerCase().replace(/\s+/g, '-');
      if (parentSlug && !forceReset) {
        setSearchParams({ parentSlug, category: urlCategory });
      } else {
        setSearchParams({ category: urlCategory });
      }
    }
  };

  // Build hierarchical categories
  const parentCategories = categories.filter(cat => !cat.parent);
  const getSubcategories = (parentId) => categories.filter(cat => cat.parent && (cat.parent._id === parentId || cat.parent.id === parentId));

  // Filter and Sort products client-side
  const filteredProducts = products
    .filter(p => (p.pricing?.price || p.price) <= priceRange)
    .sort((a, b) => {
      const priceA = a.pricing?.price || a.price;
      const priceB = b.pricing?.price || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating?.average || 0) - (a.rating?.average || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // newest
    });

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
    <div className="min-h-screen bg-page-bg">
      {/* Hero Section */}
      <section className="bg-page-header-bg text-black pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg md:text-xl">
            Explore our comprehensive range of safety garments designed for maximum protection and visibility.
          </p>
        </div>
      </section>

      {/* Search and Main Content */}
      <section className="py-8 bg-page-bg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filter - Desktop */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-32 space-y-8">
                {/* Search in Sidebar */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-slate-800">Search</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-trana-primary bg-white shadow-sm"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-slate-800">Categories</h3>
                  <div className="space-y-2">
                    {/* All Option */}
                    <label className="flex items-center group cursor-pointer mb-4">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => handleCategoryChange('All')}
                        className="hidden"
                      />
                      <span className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${selectedCategory === 'all'
                        ? 'border-trana-primary bg-trana-primary'
                        : 'border-slate-300 group-hover:border-trana-primary'
                        }`}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </span>
                      <span className={`transition-colors font-medium ${selectedCategory === 'all'
                        ? 'text-trana-primary font-bold'
                        : 'text-slate-600 group-hover:text-trana-primary'
                        }`}>
                        All Products
                      </span>
                    </label>

                    {/* Hierarchy Loop */}
                    {parentCategories.map((parent) => {
                      const subs = getSubcategories(parent._id || parent.id);
                      const isExpanded = expandedParents[parent.name];

                      return (
                        <div key={parent._id || parent.id} className="space-y-2">
                          <button
                            onClick={() => handleCategoryChange(parent.name, true)}
                            className="flex items-center justify-between w-full group py-1"
                          >
                            <span className="text-slate-700 font-semibold group-hover:text-trana-primary transition-colors">
                              {parent.name}
                            </span>
                            <svg
                              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {isExpanded && (
                            <div className="pl-4 space-y-2 border-l-2 border-slate-100 ml-1">
                              {subs.map((sub) => (
                                <label key={sub._id || sub.id} className="flex items-center group cursor-pointer">
                                  <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === sub.name}
                                    onChange={() => handleCategoryChange(sub.name)}
                                    className="hidden"
                                  />
                                  <span className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${selectedCategory === sub.name
                                    ? 'border-trana-primary bg-trana-primary'
                                    : 'border-slate-300 group-hover:border-trana-primary'
                                    }`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                  </span>
                                  <span className={`text-sm transition-colors ${selectedCategory === sub.name
                                    ? 'text-trana-primary font-semibold'
                                    : 'text-slate-500 group-hover:text-trana-primary'
                                    }`}>
                                    {sub.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-slate-800">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-trana-primary mb-2"
                  />
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>₹0</span>
                    <span>Up to ₹{priceRange}</span>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    handleCategoryChange('all', false, true);
                    setPriceRange(10000);
                    setSearchQuery('');
                  }}
                  className="w-full py-2 text-sm text-slate-500 hover:text-trana-primary font-semibold border border-slate-200 rounded-lg transition-colors hover:bg-slate-50"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Toggle & Sort */}
              <div className="sticky top-[80px] z-30 flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm lg:shadow-none">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-slate-700 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Filters
                </button>

                <div className="text-slate-500 text-sm">
                  {pagination?.totalItems != null ? (
                    <>
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalItems)} of{' '}
                      {pagination.totalItems} products
                      {pagination.totalPages > 1 && (
                        <span className="text-slate-400"> · Page {currentPage} of {pagination.totalPages}</span>
                      )}
                    </>
                  ) : (
                    <>Showing {filteredProducts.length} products</>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-sm font-semibold text-slate-800 focus:ring-0 cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Products Area */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-trana-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-500 font-medium animate-pulse">Fetching premium safety gear...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-3xl border border-red-100">
                  <p className="text-red-600 font-medium mb-4">{error}</p>
                  <button
                    onClick={() => dispatch(fetchProducts())}
                    className="bg-trana-primary text-white px-8 py-2 rounded-xl hover:bg-green-700 transition-all shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <div className="text-slate-200 mb-4 inline-block">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg font-medium">No products match your criteria</p>
                  <button
                    onClick={() => {
                      handleCategoryChange('all');
                      setPriceRange(10000);
                      setSearchQuery('');
                    }}
                    className="mt-4 text-trana-primary font-semibold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id || product.id}
                        ref={el => productRefs.current[product._id || product.id] = el}
                        className="bg-card-bg border border-gray-200 rounded-lg shadow-md overflow-hidden product-card"
                      >
                        <div className="h-56 bg-gray-50 flex items-center justify-center relative group">
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
                            className="absolute top-2 right-2 bg-card-bg rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200 z-10"
                            title="Customize this product"
                          >
                            <svg className="w-5 h-5 text-trana-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-1">{product.category?.name || product.category}</p>
                          <Link to={`/products/${product._id || product.id}`}>
                            <h3 className="text-lg font-bold mb-1 hover:text-trana-primary transition-colors duration-300 cursor-pointer">{product.title || product.name}</h3>
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

                          <p className="text-gray-500 mb-3 text-xs line-clamp-1">{product.shortDescription || product.description}</p>

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
                                className="flex-1 bg-trana-primary text-white py-2 rounded hover:bg-trana-dark transition text-center"
                              >
                                View Cart
                              </Link>
                            ) : (
                              product.variants && product.variants.length > 0 ? (
                                <Link
                                  to={`/products/${product._id || product.id}`}
                                  className="flex-1 bg-trana-dark text-white py-2 rounded hover:opacity-90 transition text-center"
                                >
                                  View Options
                                </Link>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    const productImage = e.currentTarget.closest('.bg-card-bg').querySelector('img');

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
                                  className="flex-1 bg-trana-primary text-white py-2 rounded-full font-semibold hover:bg-trana-dark transition shadow-md hover:shadow-lg active:scale-95"
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
                  {pagination && pagination.totalPages > 1 && (
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
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <div className={`fixed top-[80px] left-0 right-0 bottom-0 z-[100] lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`absolute right-0 top-0 bottom-0 w-72 bg-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl h-[calc(100dvh-80px)] max-h-[calc(100dvh-80px)]`}>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Search in Drawer */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-800">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-trana-primary"
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories in Drawer */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-800">Categories</h3>
                <div className="space-y-4">
                  {/* All Option Mobile */}
                  <label className="flex items-center group cursor-pointer border-b border-slate-50 pb-4">
                    <input
                      type="radio"
                      name="category-mobile"
                      checked={selectedCategory === 'all'}
                      onChange={() => {
                        handleCategoryChange('All');
                        setIsSidebarOpen(false);
                      }}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${selectedCategory === 'all'
                      ? 'border-trana-primary bg-trana-primary'
                      : 'border-slate-300'
                      }`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </span>
                    <span className={`text-lg transition-colors ${selectedCategory === 'all'
                      ? 'text-trana-primary font-bold'
                      : 'text-slate-700 font-medium'
                      }`}>
                      All Products
                    </span>
                  </label>

                  {/* Hierarchy Loop Mobile */}
                  {parentCategories.map((parent) => {
                    const subs = getSubcategories(parent._id || parent.id);
                    const isExpanded = expandedParents[parent.name];

                    return (
                      <div key={parent._id || parent.id} className="space-y-3">
                        <button
                          onClick={() => handleCategoryChange(parent.name, true)}
                          className="flex items-center justify-between w-full py-2"
                        >
                          <span className="text-lg font-bold text-slate-800">
                            {parent.name}
                          </span>
                          <svg
                            className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="pl-6 space-y-4 border-l-2 border-slate-100 ml-2 py-1">
                            {subs.map((sub) => (
                              <label key={sub._id || sub.id} className="flex items-center group cursor-pointer">
                                <input
                                  type="radio"
                                  name="category-mobile"
                                  checked={selectedCategory === sub.name}
                                  onChange={() => {
                                    handleCategoryChange(sub.name);
                                    setIsSidebarOpen(false);
                                  }}
                                  className="hidden"
                                />
                                <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${selectedCategory === sub.name
                                  ? 'border-trana-primary bg-trana-primary'
                                  : 'border-slate-300'
                                  }`}>
                                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </span>
                                <span className={`text-base transition-colors ${selectedCategory === sub.name
                                  ? 'text-trana-primary font-semibold'
                                  : 'text-slate-600'
                                  }`}>
                                  {sub.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Range in Drawer */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-slate-800">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-trana-primary mb-2"
                />
                <div className="flex justify-between text-sm text-slate-500 font-medium font-outfit">
                  <span>₹0</span>
                  <span>Up to ₹{priceRange}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-3 bg-trana-primary text-black font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  handleCategoryChange('all', false, true);
                  setPriceRange(10000);
                  setSearchQuery('');
                }}
                className="w-full mt-3 py-2 text-sm text-slate-500 hover:text-trana-primary font-semibold transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Quantities Section */}
      <section className="py-12 bg-section-bg" >
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
