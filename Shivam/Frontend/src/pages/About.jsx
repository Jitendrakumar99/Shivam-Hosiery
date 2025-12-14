const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">About Shivam Hosiery</h1>
            <p className="text-base md:text-lg text-gray-200">Building trust through quality manufacturing since our inception.</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded with a vision to revolutionize garment manufacturing, Shivam Hosiery has grown from a small operation to a leading manufacturer in the industry. Our commitment to quality and customer satisfaction has been the cornerstone of our success.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Over the years, we have expanded our operations, invested in state-of-the-art infrastructure, and built a team of skilled professionals dedicated to excellence. Our growth has been driven by innovation, quality assurance, and a deep understanding of our clients' needs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we specialize in manufacturing a wide range of garments, with a particular focus on safety garments under our flagship brand "Trana." Our products are trusted by industries across construction, manufacturing, energy, and infrastructure sectors.
              </p>
            </div>
            <img 
                src="https://images.unsplash.com/photo-1675176785803-bffbbb0cd2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Manufacturing facility"
                className="w-full h-full object-cover"
              />
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Mission</h3>
              <p className="text-gray-600 text-center">
                To deliver superior quality garments that meet international standards while maintaining competitive pricing and timely delivery.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Vision</h3>
              <p className="text-gray-600 text-center">
                To become a leading name in garment manufacturing, recognized for innovation, quality, and customer-centric approach.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Values</h3>
              <p className="text-gray-600 text-center">
                Quality, integrity, innovation, and customer satisfaction form the foundation of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Shivam Hosiery?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-1 bg-slate-900 shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Assurance</h3>
                <p className="text-gray-600">
                  Rigorous quality checks at every stage of production ensure that every garment meets our high standards.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-slate-900 shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Skilled Workforce</h3>
                <p className="text-gray-600">
                  Our experienced team brings expertise and dedication to every project we undertake.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-slate-900 shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Advanced Infrastructure</h3>
                <p className="text-gray-600">
                  State-of-the-art machinery and modern facilities enable efficient production with consistent quality.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-slate-900 shrink-0"></div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Timely Delivery</h3>
                <p className="text-gray-600">
                  We understand the importance of deadlines and ensure on-time delivery for all orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

