import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { fetchNotifications } from '../store/slices/notificationSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import CartIcon from './CartIcon';
import toast from 'react-hot-toast';
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
  const profileDropdownRef = useRef(null);

  // Fetch notifications and wishlist when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Calculate counts - cart count should be unique products, not total quantity
  const cartCount = cartItems.length; // Count unique products in cart
  const wishlistCount = wishlist?.items?.length || 0;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const totalBadgeCount = cartCount + wishlistCount + unreadNotificationsCount;

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

      <header className="bg-[#f54a00] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="text-2xl font-bold text-white no-underline"
              onClick={closeMobileMenu}
            >
              Trana Safety
            </Link>

            <div className="flex items-center gap-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-4 lg:gap-8 items-center text-sm md:text-base">
                <Link
                  to="/"
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/' ? 'font-bold underline' : ''}`}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/products' ? 'font-bold underline' : ''}`}
                >
                  Products
                </Link>
                <Link
                  to="/customize"
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/customize' ? 'font-bold underline' : ''}`}
                >
                  Customize
                </Link>
                <Link
                  to="/about"
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/about' ? 'font-bold underline' : ''}`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/contact' ? 'font-bold underline' : ''}`}
                >
                  Contact
                </Link>

                <Link
                  to="/shivam-hosiery"
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/shivam-hosiery' ? 'font-bold underline' : ''}`}
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
                  className="relative flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition focus:outline-none"
                  aria-label="Profile menu"
                >
                  {isAuthenticated && user ? (
                    <span className="text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email || ''}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Cart
                      </div>
                      {cartCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount > 9 ? '9+' : cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Wishlist
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {wishlistCount > 9 ? '9+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Notifications
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                        </span>
                      )}
                    </Link>
                    <div className="border-t border-gray-200 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
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
                <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="flex flex-col gap-4 py-4 border-t border-orange-400">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/' ? 'font-bold underline' : ''}`}
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/products' ? 'font-bold underline' : ''}`}
              >
                Products
              </Link>
              <Link
                to="/customize"
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/customize' ? 'font-bold underline' : ''}`}
              >
                Customize
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/about' ? 'font-bold underline' : ''}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/contact' ? 'font-bold underline' : ''}`}
              >
                Contact
              </Link>
              <Link
                to="/shivam-hosiery"
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/shivam-hosiery' ? 'font-bold underline' : ''}`}
              >
                Visit Shivam Hosiery
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/orders' ? 'font-bold underline' : ''}`}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/cart' ? 'font-bold underline' : ''}`}
                  >
                    Cart
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/wishlist' ? 'font-bold underline' : ''}`}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={closeMobileMenu}
                    className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/notifications' ? 'font-bold underline' : ''}`}
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
