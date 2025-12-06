import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
            Shivam Hosiery
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/about') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/manufacturing" 
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/manufacturing') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Manufacturing
            </Link>
            <Link 
              to="/brands" 
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/brands') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Brands & Clients
            </Link>
            <Link 
              to="/contact" 
              className={`px-3 py-2 rounded transition-colors ${
                isActive('/contact') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/trana" 
              className="px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-900 transition-colors"
            >
              Visit Trana
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                isActive('/about') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              About Us
            </Link>
            <Link 
              to="/manufacturing" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                isActive('/manufacturing') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Manufacturing
            </Link>
            <Link 
              to="/brands" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                isActive('/brands') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Brands & Clients
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                isActive('/contact') ? 'bg-gray-700' : 'hover:bg-gray-600'
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/trana" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 border border-white rounded hover:bg-white hover:text-blue-900 transition-colors"
            >
              Visit Trana
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

