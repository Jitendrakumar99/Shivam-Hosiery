import { Link } from 'react-router-dom';

const Home = () => {
  // Replace with your actual hero background image URL
  const heroImageUrl = 'https://images.unsplash.com/photo-1761396716215-9ccb2a7eda9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  
  // Brand website URLs - Replace with actual URLs
  const brandUrls = {
    trana: 'https://trana.example.com', // Replace with actual Trana website URL
    comfortWear: 'https://comfortwear.example.com', // Replace with actual ComfortWear website URL
    activeSports: 'https://activesports.example.com', // Replace with actual ActiveSports website URL
    corporatePro: 'https://corporatepro.example.com', // Replace with actual CorporatePro website URL
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-24 lg:py-32 overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url("${heroImageUrl}")`,
    }}
  >
    {/* Dark overlay for text readability */}
    <div className="absolute inset-0 bg-slate-900/75"></div>
  </div>

  {/* Content */}
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="max-w-3xl">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
        Shivam Hosiery & Trana
      </h1>
      <p className="text-base md:text-lg lg:text-xl mb-6 text-gray-200 drop-shadow-md">
        Leading manufacturer of quality garments with a commitment to excellence, safety, and innovation.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/about" 
          className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center shadow-lg"
        >
          Learn More
        </Link>
        <Link 
          to="/trana" 
          className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-gray-700 transition-colors text-center shadow-lg"
        >
          Visit Trana Safety
        </Link>
      </div>
    </div>
  </div>
</section>


      {/* Statistics Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">500+</div>
              <div className="text-gray-600">Satisfied Clients</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">ISO</div>
              <div className="text-gray-600">Certified Quality</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">10M+</div>
              <div className="text-gray-600">Units Produced</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About Shivam Hosiery
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                With over 25 years of experience in garment manufacturing, Shivam Hosiery has established itself as a trusted name in the industry. Our journey began with a vision to provide high-quality garments that meet international standards while maintaining competitive pricing.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Today, we operate from a state-of-the-art facility spanning over 50,000 square feet, equipped with modern machinery and a skilled workforce. We specialize in manufacturing various types of garments, including our flagship brand "Trana" for safety garments, which has become synonymous with quality and reliability in industrial protection.
              </p>
              <Link 
                to="/about" 
                className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Read More
              </Link>
            </div>
            <div className="rounded-lg h-64 md:h-96 overflow-hidden bg-gray-200 flex items-center justify-center">
              {/* Replace this div with: <img src="YOUR_IMAGE_URL" alt="Manufacturing facility" className="w-full h-full object-cover" /> */}
              <span className="text-gray-400">Manufacturing Image</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Portfolio Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Brand Portfolio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">T</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Trana</h3>
              <p className="text-sm text-gray-600">Safety Garments</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">ComfortWear</h3>
              <p className="text-sm text-gray-600">Casual Wear</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">ActiveSports</h3>
              <p className="text-sm text-gray-600">Sports Apparel</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-1">CorporatePro</h3>
              <p className="text-sm text-gray-600">Corporate Uniforms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Our Brands
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We manufacture quality products under various brands, each specializing in different market segments.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trana */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                {/* Replace this div with: <img src="YOUR_IMAGE_URL" alt="Safety garments" className="w-full h-full object-cover" /> */}
                <span className="text-gray-400">Safety Image</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">Safety Garments</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Trana</h3>
                <p className="text-sm text-gray-600 mb-1">सुरक्षा हमारी प्राथमिकता</p>
                <p className="text-gray-600 mb-4 text-sm">Premium safety garments designed for industrial protection.</p>
                <a 
                  href={brandUrls.trana}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ComfortWear */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-400">Casual Image</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">Casual Wear</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">ComfortWear</h3>
                <p className="text-sm text-gray-600 mb-1">Style Meets Comfort</p>
                <p className="text-gray-600 mb-4 text-sm">Everyday casual clothing with quality and comfort.</p>
                <a 
                  href={brandUrls.comfortWear}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ActiveSports */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-400">Sports Image</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">Sports Apparel</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">ActiveSports</h3>
                <p className="text-sm text-gray-600 mb-1">Performance Redefined</p>
                <p className="text-gray-600 mb-4 text-sm">Performance-focused sportswear for active lifestyles.</p>
                <a 
                  href={brandUrls.activeSports}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CorporatePro */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-400">Corporate Image</span>
              </div>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">Corporate Uniforms</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">CorporatePro</h3>
                <p className="text-sm text-gray-600 mb-1">Professional Excellence</p>
                <p className="text-gray-600 mb-4 text-sm">Professional uniforms for businesses and organizations.</p>
                <a 
                  href={brandUrls.corporatePro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
                >
                  Visit Website
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

