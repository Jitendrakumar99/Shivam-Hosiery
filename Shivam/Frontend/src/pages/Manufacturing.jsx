const Manufacturing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Manufacturing Capabilities</h1>
            <p className="text-base md:text-lg text-gray-200">
              State-of-the-art infrastructure and advanced processes for superior quality production.
            </p>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
           <img 
              src="https://images.unsplash.com/photo-1761396716215-9ccb2a7eda9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Manufacturing facility"
              className="w-full h-full object-cover"
            />
            
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Infrastructure</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our manufacturing facility spans over 50,000 square feet and is equipped with modern machinery and technology. We have invested significantly in creating an infrastructure that supports efficient production while maintaining the highest quality standards.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The facility includes dedicated areas for cutting, stitching, quality control, finishing, and packaging, ensuring a streamlined production process from raw material to finished product.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We maintain strict compliance with environmental and safety regulations, creating a workplace that is both productive and sustainable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-2">50,000+</div>
              <div className="text-gray-600">units per month</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-[#1e3a5f] mb-2">200+</div>
              <div className="text-gray-600">advanced machines</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-[#1e3a5f] mb-2">Multiple</div>
              <div className="text-gray-600">categories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-[#1e3a5f] mb-2">Multi-stage</div>
              <div className="text-gray-600">inspection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Our Production Process
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Material Selection</h3>
              <p className="text-gray-600">
                Sourcing high-quality fabrics and materials from trusted suppliers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Cutting & Preparation</h3>
              <p className="text-gray-600">
                Precision cutting using advanced machinery for accurate patterns.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Stitching & Assembly</h3>
              <p className="text-gray-600">
                Expert stitching by skilled workers ensuring durability and finish.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Check & Packaging</h3>
              <p className="text-gray-600">
                Thorough inspection and professional packaging for delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Certifications & Standards
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">ISO</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ISO 9001:2015</h3>
              <p className="text-gray-600">Quality Management System</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">CE</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">CE Certified</h3>
              <p className="text-gray-600">European Safety Standards</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">ANSI</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">ANSI Compliant</h3>
              <p className="text-gray-600">American National Standards</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Manufacturing;

