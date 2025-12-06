import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import CartIcon from './CartIcon';
import toast from 'react-hot-toast';
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

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
                  to="/about" 
                  className={`text-white no-underline transition hover:opacity-80 ${location.pathname === '/about' ? 'font-bold underline' : ''}`}
                >
                  About
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
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                    } else {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }
                  }}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition focus:outline-none"
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      👤 Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      📦 Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      🛒 Cart
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      ❤️ Wishlist
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      🔔 Notifications
                    </Link>
                    <div className="border-t border-gray-200 mt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        🚪 Logout
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
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
                to="/about" 
                onClick={closeMobileMenu}
                className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/about' ? 'font-bold underline' : ''}`}
              >
                About
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
                    to="/profile" 
                    onClick={closeMobileMenu}
                    className={`text-white no-underline transition hover:opacity-80 py-2 ${location.pathname === '/profile' ? 'font-bold underline' : ''}`}
                  >
                    Profile
                  </Link>
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
