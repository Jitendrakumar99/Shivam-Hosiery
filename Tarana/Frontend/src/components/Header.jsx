import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import CartIcon from './CartIcon';
import toast from 'react-hot-toast';

// Derived configuration for handling image URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.endsWith('/api') ? API_URL.replace(/\/api$/, '') : API_URL;
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || BASE_URL;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { notifications } = useAppSelector((state) => state.notifications);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [hoveredParent, setHoveredParent] = useState(null);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [mobileExpandedParent, setMobileExpandedParent] = useState(null);
  const profileDropdownRef = useRef(null);
  const productsMenuRef = useRef(null);
  const productsMenuTimer = useRef(null);
  const { categories } = useAppSelector((state) => state.categories);

  // Derived category helpers
  const parentCategories = categories.filter(cat => !cat.parent);
  const getSubcategories = (parentId) =>
    categories.filter(cat => cat.parent && (cat.parent._id === parentId || cat.parent === parentId));

  // Handle scroll for transparent header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications and wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch categories for the mega menu
  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
  }, [dispatch]);

  // Products menu hover handlers
  const openProductsMenu = () => {
    if (productsMenuTimer.current) clearTimeout(productsMenuTimer.current);
    setIsProductsMenuOpen(true);
  };

  const closeProductsMenu = () => {
    productsMenuTimer.current = setTimeout(() => {
      setIsProductsMenuOpen(false);
      setHoveredParent(null);
    }, 150);
  };

  const handleCategoryClick = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/products?category=${slug}`);
    setIsProductsMenuOpen(false);
    setHoveredParent(null);
  };

  // Calculate counts - cart count should be unique products, not total quantity
  const cartCount = cartItems.length; // Count unique products in cart
  const wishlistCount = wishlist?.items?.length || 0;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const totalBadgeCount = cartCount + wishlistCount + unreadNotificationsCount;

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${UPLOAD_URL}${normalizedPath}`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>

      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 text-black ${isScrolled
          ? 'bg-[#ffde32]/90 backdrop-blur-md shadow-md py-2'
          : 'bg-[#ffde32] py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 ">
          <div className="flex justify-between items-center py-2">
            <Link
              to="/"
              className="flex items-center gap-2 no-underline group"
              onClick={closeMobileMenu}
            >
              <div className="rounded-lg p-1 shadow-md hover:shadow-lg transition-transform hover:scale-105 duration-300 logo-enter h-19 w-20 flex items-center justify-center overflow-hidden">
                <img
                  src="/traan.jpeg"
                  alt="Trana Safety"
                  className="w-auto h-full object-contain"
                />
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-4 lg:gap-8 items-center text-base md:text-lg font-medium">
                <Link
                  to="/"
                  className={`text-black no-underline transition hover:opacity-60 ${location.pathname === '/' ? 'font-bold' : ''}`}
                >
                  Home
                </Link>

                {/* Products Mega Menu */}
                <div
                  className="relative"
                  ref={productsMenuRef}
                  onMouseEnter={openProductsMenu}
                  onMouseLeave={closeProductsMenu}
                >
                  <button
                    onClick={() => {
                      navigate('/products');
                      setIsProductsMenuOpen(false);
                      setHoveredParent(null);
                    }}
                    className={`text-black no-underline transition hover:opacity-60 font-medium text-base md:text-lg flex items-center gap-1 ${location.pathname === '/products' ? 'font-bold' : ''}`}
                  >
                    Products
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mega Dropdown */}
                  {isProductsMenuOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50"
                      onMouseEnter={openProductsMenu}
                      onMouseLeave={closeProductsMenu}
                    >
                      {/* Triangle pointer */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
                        <div className="w-3 h-3 bg-white border border-black/10 rotate-45 origin-bottom-left translate-x-0.5 shadow-sm"></div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-2xl border border-black/10 overflow-hidden flex" style={{ minWidth: '480px' }}>
                        {/* Left: Parent Categories */}
                        <div className="w-48 bg-[#fffde7] border-r border-black/8 py-3">
                          <p className="text-xs font-bold text-black/40 uppercase tracking-widest px-4 pb-2">Categories</p>
                          {parentCategories.length === 0 ? (
                            <p className="text-sm text-black/40 px-4 py-2">Loading...</p>
                          ) : (
                            parentCategories.map((parent) => {
                              const subs = getSubcategories(parent._id || parent.id);
                              return (
                                <button
                                  key={parent._id || parent.id}
                                  onMouseEnter={() => setHoveredParent(parent._id || parent.id)}
                                  onClick={() => {
                                    if (subs.length === 0) handleCategoryClick(parent.name);
                                  }}
                                  className={`w-full text-left flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-all ${hoveredParent === (parent._id || parent.id)
                                    ? 'bg-[#ffde32] text-black'
                                    : 'text-black/80 hover:bg-[#ffde32]/60'
                                    }`}
                                >
                                  <span>{parent.name}</span>
                                  {subs.length > 0 && (
                                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  )}
                                </button>
                              );
                            })
                          )}
                          {/* All Products option */}
                          <div className="border-t border-black/8 mt-2 pt-2">
                            <Link
                              to="/products"
                              onClick={() => { setIsProductsMenuOpen(false); setHoveredParent(null); }}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-black no-underline hover:bg-[#ffde32]/60 transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                              </svg>
                              All Products
                            </Link>
                          </div>
                        </div>

                        {/* Right: Subcategories */}
                        <div className="flex-1 py-3">
                          {hoveredParent ? (
                            (() => {
                              const subs = getSubcategories(hoveredParent);
                              const parent = parentCategories.find(p => (p._id || p.id) === hoveredParent);
                              return subs.length > 0 ? (
                                <>
                                  <p className="text-xs font-bold text-black/40 uppercase tracking-widest px-4 pb-2">{parent?.name}</p>
                                  <div className="grid grid-cols-2 gap-0.5 px-2">
                                    {subs.map((sub) => (
                                      <button
                                        key={sub._id || sub.id}
                                        onClick={() => handleCategoryClick(sub.name)}
                                        className="text-left px-3 py-2.5 rounded-lg text-sm text-black/80 font-medium hover:bg-[#ffde32]/40 hover:text-black transition-all"
                                      >
                                        {sub.name}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-black/30 py-8">
                                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                  <p className="text-sm">Click to view products</p>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-black/25 py-8">
                              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                              </svg>
                              <p className="text-sm">Hover a category</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to="/customize"
                  className={`text-black no-underline transition hover:opacity-60 ${location.pathname === '/customize' ? 'font-bold' : ''}`}
                >
                  Customize
                </Link>
                <Link
                  to="/about"
                  className={`text-black no-underline transition hover:opacity-60 ${location.pathname === '/about' ? 'font-bold' : ''}`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`text-black no-underline transition hover:opacity-60 ${location.pathname === '/contact' ? 'font-bold' : ''}`}
                >
                  Contact
                </Link>

                <Link
                  to="/shivam-hosiery"
                  className={`text-black no-underline transition hover:opacity-60 ${location.pathname === '/shivam-hosiery' ? 'font-bold' : ''}`}
                >
                  Visit Shivam Hosiery
                </Link>
              </nav>

              {/* Profile Icon with Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  id="header-profile-icon"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                    } else {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }
                  }}
                  className="relative flex items-center justify-center w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full transition focus:outline-none "
                  aria-label="Profile menu"
                >
                  {isAuthenticated && user ? (
                    user.avatar ? (
                      <img
                        src={getAvatarUrl(user.avatar)}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border-2 border-black/30"
                      />
                    ) : (
                      <span className="text-black font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )
                  ) : (
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {/* Notification Badge */}
                  {isAuthenticated && totalBadgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu - Only show when user is logged in */}
                {isAuthenticated && user && isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-dropdown-bg rounded-xl shadow-2xl border border-white/20 py-2 z-50 backdrop-blur-md ring-1 ring-black/5">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-text-primary">{user.name || 'User'}</p>
                      <p className="text-xs text-text-secondary truncate">{user.email || ''}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-slate-50 transition"
                    >
                      <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-slate-50 transition"
                    >
                      <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Cart
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-trana-primary text-slate-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Wishlist
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-trana-primary text-slate-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {wishlistCount > 9 ? '9+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-text-primary hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-trana-primary text-slate-900 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-gray-50 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hamburger Button for Mobile */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-[2px] bg-black transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-[2px] bg-black transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-[2px] bg-black transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav
            className={`md:hidden overflow-y-auto transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100vh-80px)] opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className={`flex flex-col gap-4 py-4 border-t border-black/20`}>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/' ? 'font-bold' : ''}`}
              >
                Home
              </Link>

              {/* Mobile Products Accordion */}
              <div className="border-b border-black/10 pb-2">
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className={`w-full text-left flex items-center justify-between text-black font-medium py-2 ${location.pathname === '/products' ? 'font-bold' : ''}`}
                >
                  Products
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMobileProductsOpen && (
                  <div className="mt-1 ml-2 space-y-1">
                    <Link
                      to="/products"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 text-sm text-black font-bold no-underline py-1.5 hover:opacity-60"
                    >
                      All Products
                    </Link>
                    {parentCategories.map((parent) => {
                      const subs = getSubcategories(parent._id || parent.id);
                      const isExpanded = mobileExpandedParent === (parent._id || parent.id);
                      return (
                        <div key={parent._id || parent.id}>
                          <button
                            onClick={() => {
                              if (subs.length > 0) {
                                setMobileExpandedParent(isExpanded ? null : (parent._id || parent.id));
                              } else {
                                handleCategoryClick(parent.name);
                                closeMobileMenu();
                              }
                            }}
                            className="w-full text-left flex items-center justify-between text-sm text-black font-semibold py-1.5 hover:opacity-60"
                          >
                            {parent.name}
                            {subs.length > 0 && (
                              <svg
                                className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </button>
                          {isExpanded && subs.length > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-black/20 pl-3">
                              {subs.map((sub) => (
                                <button
                                  key={sub._id || sub.id}
                                  onClick={() => { handleCategoryClick(sub.name); closeMobileMenu(); }}
                                  className="w-full text-left text-sm text-black/70 py-1 hover:text-black transition-all"
                                >
                                  {sub.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <Link
                to="/customize"
                onClick={closeMobileMenu}
                className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/customize' ? 'font-bold' : ''}`}
              >
                Customize
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/about' ? 'font-bold' : ''}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/contact' ? 'font-bold' : ''}`}
              >
                Contact
              </Link>
              <Link
                to="/shivam-hosiery"
                onClick={closeMobileMenu}
                className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/shivam-hosiery' ? 'font-bold' : ''}`}
              >
                Visit Shivam Hosiery
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/orders' ? 'font-bold' : ''}`}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/cart' ? 'font-bold' : ''}`}
                  >
                    Cart
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/wishlist' ? 'font-bold' : ''}`}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={closeMobileMenu}
                    className={`text-black no-underline transition hover:opacity-60 py-2 ${location.pathname === '/notifications' ? 'font-bold' : ''}`}
                  >
                    Notifications
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
