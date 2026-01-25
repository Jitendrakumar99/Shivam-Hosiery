import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { brandService } from '../services/brandService';
import { clientService } from '../services/clientService';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state for clients section
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, clientsData] = await Promise.all([
          brandService.getBrands({ status: 'active' }),
          clientService.getClients({ status: 'active' })
        ]);
        setBrands(brandsData.data || []);
        setClients(clientsData.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
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
                <div className="text-3xl md:text-4xl font-bold mb-2">{brands.length}+</div>
                <div className="text-gray-300 text-sm md:text-base">Brands</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{clients.length}+</div>
                <div className="text-gray-300 text-sm md:text-base">Clients</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {Array.from(new Set(clients.map((c) => c.category))).length || 0}+
                </div>
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
            Our Brand
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our brand represents our commitment to quality, innovation, and customer satisfaction in its respective category.
          </p>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading brands...</p>
            </div>
          ) : brands.length > 0 ? (
            (() => {
              // Find Trana brand or use first brand
              const tranBrand = brands.find(b => b.name?.toLowerCase().includes('trana')) || brands[0];
              const brandImage = tranBrand.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop';
              
              return (
                <div className="max-w-7xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-lg overflow-hidden shadow-lg">
                    {/* Left Section - Image with Overlay */}
                    <div className="relative h-[500px] lg:h-auto overflow-hidden">
                      <img 
                        src={brandImage} 
                        alt={tranBrand.name || 'Trana Safety'} 
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay with Text */}
                      <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/60 flex flex-col justify-end p-6 md:p-8">
                        <div className="mb-4">
                          <span className="inline-block bg-[#f54a00] text-white px-4 py-2 rounded text-sm font-semibold mb-3">
                            Safety Garments
                          </span>
                        </div>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                          {tranBrand.name || 'Trana'}
                        </h3>
                        <p className="text-white text-lg md:text-xl">
                          सुरक्षा, हमारी प्राथमिकता
                        </p>
                      </div>
                    </div>

                    {/* Right Section - Content */}
                    <div className="bg-white p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                        Premium Safety Solutions
                      </h3>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {tranBrand.name || 'Trana'} is our flagship brand dedicated to manufacturing premium safety garments for industrial and workplace protection. With a focus on high-visibility clothing, {tranBrand.name || 'Trana'} ensures that workers remain safe and visible in hazardous environments.
                      </p>
                      
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        Our products meet international safety standards and are trusted by leading organizations across multiple industries including construction, manufacturing, energy, and infrastructure.
                      </p>

                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {[
                          'ANSI/ISEA 107 certified products',
                          'High-visibility safety vests and jackets',
                          'Industrial coveralls and protective wear',
                          'Customization options available',
                          'Bulk ordering with B2B portal'
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#f54a00] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Call-to-Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to="/trana"
                          className="inline-flex items-center justify-center bg-[#f54a00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e04400] transition-colors"
                        >
                          Explore {tranBrand.name || 'Trana'} Products
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link
                          to="/customize"
                          className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Customize Products
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No brands available</p>
            </div>
          )}
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
              Our brand under the Shivam Hosiery umbrella shares our core values of quality, innovation, and customer satisfaction. We believe in creating products that not only meet but exceed expectations, ensuring that each brand maintains its unique identity while upholding our company's reputation for excellence.
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

      {/* Industries We Serve Section (static) */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Industries We Serve
          </h2>
          <p className="text-center text-gray-300 mb-12">
            Providing specialized garment solutions across diverse sectors.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {[
              'Construction',
              'Manufacturing',
              'Transportation',
              'Energy',
              'Mining',
              'Infrastructure',
            ].map((industry) => (
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading clients...</p>
            </div>
          ) : clients.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {clients
                  .slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)
                  .map((client) => (
                    <a
                      key={client._id || client.id}
                      href={client.websiteUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-200 p-6 rounded-lg shadow-md text-center block"
                    >
                      <div className="w-full relative mb-4" style={{ paddingTop: '100%' }}>
                        {/* Square aspect ratio container */}
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                          {client.logo ? (
                            <img
                              src={client.logo}
                              alt={client.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.category}</p>
                    </a>
                  ))}
              </div>

              {/* Pagination controls for clients section */}
              {clients.length > clientsPerPage && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.ceil(clients.length / clientsPerPage) }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        type="button"
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === page
                            ? 'bg-slate-900 text-white'
                            : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, Math.ceil(clients.length / clientsPerPage))
                      )
                    }
                    disabled={currentPage === Math.ceil(clients.length / clientsPerPage)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No clients available</p>
            </div>
          )}
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

