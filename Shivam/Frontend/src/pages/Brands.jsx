import { Link } from 'react-router-dom';

const Brands = () => {
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
      <section className="relative bg-slate-900 text-white py-16 md:py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Our Brands & Clientele</h1>
            <p className="text-base md:text-lg text-gray-200 mb-8">
              Discover our diverse brand portfolio and the trusted partners who choose us for quality, reliability, and excellence in every garment.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-2xl">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">4+</div>
                <div className="text-gray-300 text-sm md:text-base">Brands</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-gray-300 text-sm md:text-base">Clients</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">6+</div>
                <div className="text-gray-300 text-sm md:text-base">Industries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            Our Brands
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Each brand represents our commitment to quality, innovation, and customer satisfaction in its respective category.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Trana */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                {/* Replace this div with: <img src="YOUR_IMAGE_URL" alt="Brand image" className="w-full h-full object-cover" /> */}
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

      {/* Brand Philosophy Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
              Our Brand Philosophy
            </h2>
            <p className="text-gray-600 text-center leading-relaxed">
              Every brand under the Shivam Hosiery umbrella shares our core values of quality, innovation, and customer satisfaction. We believe in creating products that not only meet but exceed expectations, ensuring that each brand maintains its unique identity while upholding our company's reputation for excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            What Our Clients Say
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Hear from the organizations that trust us with their garment needs.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <div className="text-4xl text-yellow-400 mb-4">"</div>
              <p className="text-gray-600 mb-4 italic">
                Exceptional quality and timely delivery. Shivam Hosiery has been our trusted partner for safety garments for over 5 years.
              </p>
              <div className="flex text-yellow-400 mb-2">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-gray-500">Project Manager, Construction Company</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <div className="text-4xl text-yellow-400 mb-4">"</div>
              <p className="text-gray-600 mb-4 italic">
                The customization options and attention to detail are impressive. Their products meet all our safety requirements.
              </p>
              <div className="flex text-yellow-400 mb-2">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-gray-500">Safety Officer, Manufacturing Unit</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">
              <div className="text-4xl text-yellow-400 mb-4">"</div>
              <p className="text-gray-600 mb-4 italic">
                Professional service and competitive pricing. We highly recommend Shivam Hosiery for bulk orders.
              </p>
              <div className="flex text-yellow-400 mb-2">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-gray-500">Procurement Head, Infrastructure Project</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Industries We Serve
          </h2>
          <p className="text-center text-gray-300 mb-12">
            Providing specialized garment solutions across diverse sectors.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {['Construction', 'Manufacturing', 'Transportation', 'Energy', 'Mining', 'Infrastructure'].map((industry) => (
              <button
                key={industry}
                className="border-2 border-white px-4 py-3 rounded-lg hover:bg-white hover:text-[#1e3a5f] transition-colors font-semibold"
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clientele Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
            Our Clientele
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We are proud to serve a diverse range of clients, from small businesses to large corporations. Our commitment to quality and service has helped us build long-lasting relationships.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'National Construction Corp', industry: 'Construction' },
              { name: 'Industrial Safety Solutions', industry: 'Manufacturing' },
              { name: 'Metro Rail Services', industry: 'Transportation' },
              { name: 'Power Grid Corporation', industry: 'Energy' },
              { name: 'Highway Development Authority', industry: 'Infrastructure' },
              { name: 'Mining Corporation Ltd', industry: 'Mining' },
            ].map((client) => (
              <div key={client.name} className="bg-white border border-gray-200 p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{client.name}</h3>
                <p className="text-sm text-gray-600">{client.industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-slate-800 p-8 rounded-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner With Us?</h2>
            <p className="text-xl text-gray-200 mb-8">
              Join hundreds of satisfied clients who trust Shivam Hosiery for their garment needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-[#1e3a5f] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                to="/trana"
                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold border-2 border-white hover:bg-slate-800 transition-colors"
              >
                Explore Trana Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brands;

