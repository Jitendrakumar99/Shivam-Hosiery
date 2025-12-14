import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { brandService } from '../services/brandService';
import { clientService } from '../services/clientService';

const Home = () => {
  // Replace with your actual hero background image URL
  const heroImageUrl = 'https://images.unsplash.com/photo-1761396716215-9ccb2a7eda9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <div className="text-4xl font-bold text-slate-900 mb-2">5+</div>
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
            <img 
                src="https://images.unsplash.com/photo-1675176785803-bffbbb0cd2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Manufacturing facility"
                className="w-full h-full object-cover"
              />
          </div>
        </div>
      </section>

      {/* Brand Portfolio Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Clients
          </h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading brands...</p>
            </div>
          ) : (clients || []).filter(c => c?.logo && c?.websiteUrl).length > 0 ? (
            <ClientMarquee items={(clients || []).filter(c => c?.logo && c?.websiteUrl)} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No brands available</p>
            </div>
          )}
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading brands...</p>
            </div>
          ) : brands.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <div key={brand._id || brand.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                    {brand.image ? (
                      <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">Brand Image</span>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">{brand.category}</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{brand.name}</h3>
                    {brand.slogan && <p className="text-sm text-gray-600 mb-1">{brand.slogan}</p>}
                    <p className="text-gray-600 mb-4 text-sm">{brand.description}</p>
                    {brand.websiteUrl && (
                      <a 
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
                      >
                        Visit Website
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No brands available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Client logo marquee without custom CSS (Tailwind + JS)
const ClientMarquee = ({ items, speed = 60 }) => {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const initRef = useRef(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);

  useEffect(() => {
    const animate = (ts) => {
      const track = trackRef.current;
      if (!track) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const width = (track.scrollWidth / 2) || 1; // half because content is duplicated
      if (!initRef.current) {
        posRef.current = -width; // start fully offscreen left
        lastTsRef.current = ts || 0;
        initRef.current = true;
      }
      const dt = Math.max(0, (ts || 0) - lastTsRef.current) / 1000; // seconds
      lastTsRef.current = ts || 0;
      const pixelsPerSecond = speed; // configurable smooth speed
      posRef.current += pixelsPerSecond * dt;
      if (posRef.current >= 0) {
        posRef.current = -width; // seamless reset
      }
      track.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    const handleResize = () => { initRef.current = false; };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items, speed]);

  const list = items || [];

  return (
    <div className="overflow-hidden w-full">
      <div ref={trackRef} className="flex items-center will-change-transform select-none">
        {list.map((client, idx) => (
          <div
            key={(client._id || client.id || idx) + '-a'}
            className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden bg-white shadow ring-1 ring-gray-200 flex items-center justify-center mx-8 shrink-0"
            title={client.name}
          >
            <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
              <img src={client.logo} alt={client.name} className="h-full w-full object-contain" />
            </a>
          </div>
        ))}
        {list.map((client, idx) => (
          <div
            key={(client._id || client.id || idx) + '-b'}
            className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden bg-white shadow ring-1 ring-gray-200 flex items-center justify-center mx-8 shrink-0"
            title={client.name}
          >
            <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
              <img src={client.logo} alt={client.name} className="h-full w-full object-contain" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

