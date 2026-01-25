const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f54a00] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Trana</h1>
          <p className="text-2xl md:text-3xl mb-4">सुरक्षा, हमारी प्राथमिकता.</p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Safety, Our Priority - Committed to protecting workers through quality safety garments.
          </p>
        </div>
      </section>

      {/* The Trana Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Trana Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Trana Safety was founded with a singular mission: to provide workers across industries with 
                  premium safety garments that don't compromise on protection, comfort, or visibility. Our journey 
                  began with recognizing a critical need in the market for high-quality, certified safety wear that 
                  meets international standards while remaining accessible.
                </p>
                <p>
                  The name "Trana" embodies our core values - protection and security. Every product we design and 
                  manufacture reflects our unwavering commitment to worker safety. We understand that in hazardous 
                  environments, the right safety garment can be the difference between life and death.
                </p>
                <p>
                  Through years of innovation, rigorous quality control, and a deep understanding of industrial 
                  safety requirements, Trana has become a trusted partner for businesses and workers who refuse to 
                  compromise on safety. We combine advanced materials, cutting-edge reflective technology, and 
                  ergonomic design to create garments that provide maximum visibility and protection in the most 
                  challenging work environments.
                </p>
              </div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
  <img 
    src="https://media.istockphoto.com/id/523629776/photo/textile-industry-sock.jpg?s=612x612&w=0&k=20&c=fGjcIB4nYJwzqwVsA7-5HA832r4xaSbzuVBRME7JAuU="
    alt="Safety Gloves"
    className="w-full h-full object-cover"
  />
  <span className="text-gray-500 absolute">Safety Gloves Image</span>
</div>
          </div>
        </div>
      </section>

      {/* Mission, Promise*/}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#f54a00] rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-trana-orange rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide world-class safety garments that protect workers while ensuring compliance with 
                international safety standards.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-trana-orange rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-trana-orange rounded-lg"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Promise</h3>
              <p className="text-gray-600">
                Every Trana product is designed, manufactured, and tested with one goal: keeping workers safe 
                and visible in hazardous environments.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-trana-orange rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-trana-orange transform rotate-45"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Commitment</h3>
              <p className="text-gray-600">
                Continuous innovation, uncompromising quality, and dedicated customer support drive everything 
                we do at Trana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Trana Different Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Makes Trana Different</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Quality Materials</h3>
                <p className="text-gray-600 mb-4">
                  We source only the finest materials and components to ensure durability, comfort, and long-lasting 
                  performance in demanding work environments.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>High-grade 3M reflective tape</li>
                  <li>Breathable, moisture-wicking fabrics</li>
                  <li>Weather-resistant materials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Customization Options</h3>
                <p className="text-gray-600 mb-4">
                  Every business is unique, and so are your safety needs. We offer comprehensive customization 
                  services to match your brand and requirements.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Company logo embroidery</li>
                  <li>Custom color options</li>
                  <li>Specialized design modifications</li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Safety Standards</h3>
                <p className="text-gray-600 mb-4">
                  Compliance isn't optional - it's essential. All our products meet or exceed international safety 
                  standards and certifications.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>ANSI/ISEA 107 compliant</li>
                  <li>CE certified</li>
                  <li>NFPA ratings for flame-resistant options</li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Dedicated Support</h3>
                <p className="text-gray-600 mb-4">
                  From initial consultation to after-sales service, our team is committed to providing exceptional 
                  support at every step.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Expert product consultation</li>
                  <li>Flexible bulk ordering</li>
                  <li>After-sales support and warranty services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recognition & Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Recognition & Certifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-trana-orange rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-trana-orange rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">ISO 9001:2015</h3>
              <p className="text-gray-600 text-sm">Quality Management</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-trana-orange rounded-lg flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-trana-orange rounded-lg"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">ANSI/ISEA 107</h3>
              <p className="text-gray-600 text-sm">Hi-Vis Standards</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-trana-orange rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-trana-orange transform rotate-45"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">CE Certified</h3>
              <p className="text-gray-600 text-sm">European Standards</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-trana-orange rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-trana-orange rounded-full"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Industry Leader</h3>
              <p className="text-gray-600 text-sm">Safety Garments</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

