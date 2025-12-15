const Footer = () => {
  return (
    <footer className="bg-[#f54a00] text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl mb-4">Trana Safety Garments</h3>
            <p className="leading-relaxed">
              Premium safety garments designed for maximum protection and comfort.
            </p>
          </div>
          <div>
            <h3 className="text-xl mb-4">Quick Links</h3>
            <ul className="list-none p-0 space-y-2">
              <li><a href="/privacy" className="text-white no-underline hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="text-white no-underline hover:underline">Terms & Conditions</a></li>
              <li><a href="/shipping" className="text-white no-underline hover:underline">Shipping Information</a></li>
              <li><a href="/returns" className="text-white no-underline hover:underline">Return Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-4">Contact Information</h3>
            <p className="mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:shivamhosiery.raipur@gmail.com" className="hover:underline">shivamhosiery.raipur@gmail.com</a>
            </p>
            <p className="mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+91XXXXXXXXXX" className="hover:underline">+91 XXXX-XXXXXX</a>
            </p>
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Raipur, Chhattisgarh, India
            </p>
          </div>
        </div>
        <div className="border-t border-white/30 pt-4 text-center">
          <p>© 2025 Trana Safety. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
