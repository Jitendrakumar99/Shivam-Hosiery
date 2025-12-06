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
            <p className="mb-2">
              <span className="mr-2">📧</span> shivamhosiery.raipur@gmail.com
            </p>
            <p className="mb-2">
              <span className="mr-2">📞</span> +91 XXXX-XXXXXX
            </p>
            <p>
              <span className="mr-2">📍</span> Raipur, Chhattisgarh, India
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
