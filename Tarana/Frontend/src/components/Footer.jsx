import { useState } from 'react';

const Footer = () => {
  const [activeLocation, setActiveLocation] = useState(1);

  return (
    <footer className="bg-footer-bg text-black py-16 mt-16 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Section 1: Logo */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="/trana_logo2.jpeg" alt="Traan Safety" className="h-14 w-auto object-contain bg-white rounded-md p-1" />
            </div>
            <p className="leading-relaxed opacity-80">
              Premium safety garments designed for maximum protection and comfort. Trusted by professionals worldwide.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-xl mb-6 font-bold text-black">Quick Links</h3>
            <ul className="list-none p-0 space-y-3">
              <li><a href="/" className="text-black/70 no-underline hover:text-white transition">Home</a></li>
              <li><a href="/products" className="text-black/70 no-underline hover:text-white transition">Products</a></li>
              <li><a href="/privacy" className="text-black/70 no-underline hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/terms" className="text-black/70 no-underline hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="/shipping" className="text-black/70 no-underline hover:text-white transition">Shipping Information</a></li>
              <li><a href="/returns" className="text-black/70 no-underline hover:text-white transition">Return Policy</a></li>
            </ul>
          </div>

          {/* Section 3: Contact Us */}
          <div>
            <h3 className="text-xl mb-6 font-bold text-black">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-center group">
                <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                
                <a href="mailto:shivamhosiery.raipur@gmail.com" className="text-black/70 hover:text-white transition text-sm break-all">shivamhosiery.raipur@gmail.com</a>
              </p>
              <p className="flex items-center group">
                <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+91 88271 04318" className="text-black/70 hover:text-white transition">+91 88271 04318</a>
              </p>
              <p className="flex items-center group">
                <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-black/70">Raipur, Chhattisgarh, India</span>
              </p>
            </div>
            <div className="space-y-4 mt-4">
              <p className="flex items-center group">
                <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                
                <a href="mailto:shivamhosiery.vishakhapatnam@gmail.com" className="text-black/70 hover:text-white transition text-sm break-all">shivamhosiery.vishakhapatnam@gmail.com</a>
              </p>
              <p className="flex items-center group">
                <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+91 88271 00000" className="text-black/70 hover:text-white transition">+91 88271 00000</a>
              </p>
              <p className="flex items-center group">
                <svg className="w-5 h-5 mr-3 text-black group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-black/70">Visakhapatnam, Andhra Pradesh, India</span>
              </p>
            </div>
          </div>

          {/* Section 4: Location */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Visit Us</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveLocation(1)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${activeLocation === 1 ? 'bg-black text-white border-black' : 'border-black/40 text-black/70 hover:border-black'}`}
                >
                  Raipur
                </button>
                <button
                  onClick={() => setActiveLocation(2)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${activeLocation === 2 ? 'bg-black text-white border-black' : 'border-black/40 text-black/70 hover:border-black'}`}
                >
                  Visakhapatnam
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-black/20 h-56 group transition-all hover:border-black/40">
              <iframe
                src={activeLocation === 1
                  ? "https://www.google.com/maps?q=Shivam+Hosiery+Raipur&output=embed"
                  : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110051.25732990695!2d83.20434359426523!3d17.72902748125963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39431389e6973f%3A0x92d9c20395498468!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e1!3m2!1sen!2sin!4v1771089699396!5m2!1sen!2sin"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full transition-all duration-300"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="border-t border-black/20 pt-8 mt-8 text-center text-black/60 text-sm">
          <p>© 2026 Traan Safety. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
