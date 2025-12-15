import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-trana-orange text-white py-10 md:py-32 h-screen relative overflow-hidden">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1640236889867-2bf2c34f7d8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" 
          alt="Hero Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-trana-orange opacity-5"></div>
        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Trana Safety Garments</h1>
          <p className="text-2xl md:text-3xl mb-4">सुरक्षा, हमारी प्राथमिकता.</p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            Premium safety garments designed for maximum protection and visibility in industrial environments.
          </p>
          <div className="flex gap-4">
          <Link 
            to="/products" 
            className="inline-block bg-white text-trana-orange px-8 py-3  rounded font-semibold hover:bg-gray-100 transition"
          >
            Browse Products
          </Link>
          <Link 
            to="/customize" 
            className="inline-block bg-white text-trana-orange px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Product Range</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Comprehensive safety garment solutions for every industrial need.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Safety Vest Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Safety Vests</h3>
                <p className="text-gray-600 mb-4">
                  High-visibility vests with reflective features for maximum visibility.
                </p>
                <Link 
                  to="/products?category=safety-vests" 
                  className="inline-block bg-trana-orange text-white px-6 py-2 rounded hover:bg-orange-600 transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Safety Jacket Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Safety Jackets</h3>
                <p className="text-gray-600 mb-4">
                  Weather-resistant jackets with insulation and reflective features.
                </p>
                <Link 
                  to="/products?category=safety-jackets" 
                  className="inline-block bg-trana-orange text-white px-6 py-2 rounded hover:bg-orange-600 transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Coveralls Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Coveralls</h3>
                <p className="text-gray-600 mb-4">
                  Full-body protection with reinforced construction and safety features.
                </p>
                <Link 
                  to="/products?category=coveralls" 
                  className="inline-block bg-trana-orange text-white px-6 py-2 rounded hover:bg-orange-600 transition"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Order Section */}
      <section className="bg-[#f54a00] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Place a Bulk Order?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Get exclusive pricing and dedicated support for bulk orders. Contact us or login to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="inline-block bg-white text-trana-orange px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
            >
              Login / Sign Up
            </Link>
            <Link 
              to="/contact" 
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white/10 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

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
