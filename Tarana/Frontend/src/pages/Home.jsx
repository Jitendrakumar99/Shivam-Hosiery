import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchProducts } from '../store/slices/productSlice';
import './ProductRangeCarousel.css';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    // Fetch only top-level (parent) categories that are active
    dispatch(fetchCategories({ status: 'active', parent: 'null' }));
    // Fetch products for "You may also like" section
    dispatch(fetchProducts({ limit: 20 }))
      .then((result) => {
        if (fetchProducts.fulfilled.match(result)) {
          // Shuffle and pick 3-4 random products
          const allProducts = result.payload.data || [];
          const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
        }
      });
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    // Navigate to products page filtered by parent category (by slug)
    const slug = (category.slug || category.name.toLowerCase().replace(/\s+/g, '-'));
    navigate(`/products?parentSlug=${slug}`);
  };

  // Get all active parent categories (categories without a parent)
  const parentCategories = (categories || []).filter(cat => {
    // Filter out categories that have a parent (subcategories)
    const hasParent = cat.parent && (cat.parent._id || cat.parent);
    return !hasParent && cat.status === 'active';
  });

  const n = parentCategories.length;
  const isAutoPlaying = true;

  // Reset index when categories change
  useEffect(() => {
    setCurrentIndex(0);
  }, [parentCategories.length]);

  // Update CSS custom property
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.setProperty('--k', currentIndex.toString());
      sectionRef.current.style.setProperty('--n', n.toString());
    }
  }, [currentIndex, n]);

  const handleNavigation = (direction) => {
    setCurrentIndex((prev) => (prev + direction + n) % n);
    resetAutoPlay();
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetAutoPlay();
  };

  // Auto-play functionality
  const startAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (n > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % n);
      }, 4000); // Change slide every 4 seconds
    }
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isAutoPlaying && n > 0) {
      startAutoPlay();
    }
  };

  useEffect(() => {
    if (isAutoPlaying && n > 0) {
      startAutoPlay();
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, n]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (isAutoPlaying && autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
  };

  // Default fallback image for categories without images
  const defaultCategoryImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop';

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-trana-orange text-white py-10 md:py-32 h-[90vh] md:h-screen relative overflow-hidden flex items-center">
        {/* Background Image with Zoom Animation */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1640236889867-2bf2c34f7d8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 animate-parallax-zoom"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r to-transparent opacity-50"></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up tracking-tight leading-tight">
            Trana <span className="text-white">Safety</span> <br className="hidden md:block" />
            Garments
          </h1>
          <p className="text-2xl md:text-2xl mb-4 animate-fade-in-up delay-200 font-medium opacity-90">
            सुरक्षा, हमारी प्राथमिकता.
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl animate-fade-in-up delay-400 text-white/80 font-light">
            Premium safety garments designed for maximum protection and visibility in industrial environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-600 justify-center md:justify-start">
            <Link
              to="/products"
              className="inline-block bg-white text-trana-orange px-10 py-4 rounded-full font-bold hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl transition-all pulse-hover no-underline text-center"
            >
              Browse Products
            </Link>
            <Link
              to="/customize"
              className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-trana-orange hover:scale-105 active:scale-95 transition-all no-underline text-center"
            >
              Customize Your Order
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Safety First</h3>
              <p className="text-gray-600">ANSI/ISEA certified products</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Durable & long-lasting</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Trusted Brand</h3>
              <p className="text-gray-600">500+ satisfied clients</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-trana-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Customizable</h3>
              <p className="text-gray-600">Tailored to your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Range Section */}
      <section className="py-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-4xl font-bold text-center mb-2">Our Product Range</h2>
          <p className="text-center text-gray-600 mb-1 max-w-xl mx-auto">
            Comprehensive safety garment solutions for every industrial need.
          </p>
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trana-orange mx-auto mb-3"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Container */}
              {parentCategories.length > 0 && (
                <div
                  ref={sectionRef}
                  className="product-range-carousel-container"
                  style={{
                    '--n': n.toString(),
                    '--k': currentIndex.toString(),
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Product Cards Stack */}
                  <div className="product-range-stack">
                    {parentCategories.map((category, i) => {
                      const isActive = i === currentIndex;
                      const isNext = i === (currentIndex + 1) % n;
                      const isPrev = i === (currentIndex - 1 + n) % n;

                      // Only show active card and adjacent cards
                      if (n > 3 && !isActive && !isNext && !isPrev) return null;

                      return (
                        <div
                          key={category._id || category.id}
                          className={`category-card ${isActive ? 'active' : isNext ? 'next' : 'prev'}`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          {/* Category Image Container */}
                          <div className="category-image-container">
                            <div className="category-image-wrapper">
                              <img
                                src={category.image || defaultCategoryImage}
                                alt={category.name}
                                className="category-image"
                                onError={(e) => {
                                  e.target.src = defaultCategoryImage;
                                }}
                              />
                              <div className="category-image-overlay"></div>
                            </div>
                          </div>

                          {/* Category Name */}
                          <div className="category-name-container">
                            <span className="category-name">{category.name}</span>
                          </div>
                        </div>
                      );
                    })}
                    {n > 1 && (
                      <div className="carousel-nav-buttons">
                        <button
                          className="carousel-nav-button"
                          onClick={() => handleNavigation(-1)}
                          aria-label="previous category"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                          </svg>
                        </button>

                        <button
                          className="carousel-nav-button"
                          onClick={() => handleNavigation(1)}
                          aria-label="next category"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dot Indicators */}
                  {n > 1 && (
                    <div className="carousel-dots">
                      {parentCategories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                          aria-label={`Go to category ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bulk Order Section */}
      <section className="bg-[#f54a00] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Place a Bulk Order?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get exclusive pricing and dedicated support for bulk orders. Contact us or {isAuthenticated ? 'visit your profile' : 'login to your account'}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="inline-block bg-white text-trana-orange px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
              >
                View Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-block bg-white text-trana-orange px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
              >
                Login / Sign Up
              </Link>
            )}
            <Link
              to="/contact"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white/10 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">You May Also Like</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover our featured products
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const discountPercentage = product.pricing?.compareAtPrice > product.pricing?.price
                  ? Math.round(((product.pricing.compareAtPrice - product.pricing.price) / product.pricing.compareAtPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={product._id || product.id}
                    to={`/products/${product._id || product.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
                  >
                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={product.images[0]}
                            alt={product.title || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {discountPercentage > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {discountPercentage}% OFF
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{product.category?.name || product.category}</p>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-trana-orange transition">
                        {product.title || product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-trana-orange font-bold">₹{product.pricing?.price || product.price}</p>
                        {product.pricing?.compareAtPrice > product.pricing?.price && (
                          <p className="text-sm text-gray-500 line-through">₹{product.pricing.compareAtPrice}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Trana Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Trana?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <svg className="w-8 h-8 text-green-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Certified Products</h3>
              <p className="text-gray-600">All products meet international safety standards</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <svg className="w-8 h-8 text-green-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick turnaround on bulk orders</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <svg className="w-8 h-8 text-green-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Custom Branding</h3>
              <p className="text-gray-600">Add your company logo and colors</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <svg className="w-8 h-8 text-green-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">Best value for quality products</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

