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
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Safety First</h3>
              <p className="text-gray-600">ANSI/ISEA certified products</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Durable & long-lasting</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Trusted Brand</h3>
              <p className="text-gray-600">500+ satisfied clients</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📈</div>
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
              <div className="text-3xl text-green-600 mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Certified Products</h3>
              <p className="text-gray-600">All products meet international safety standards</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-3xl text-green-600 mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick turnaround on bulk orders</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-3xl text-green-600 mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2">Custom Branding</h3>
              <p className="text-gray-600">Add your company logo and colors</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="text-3xl text-green-600 mb-4">✓</div>
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
