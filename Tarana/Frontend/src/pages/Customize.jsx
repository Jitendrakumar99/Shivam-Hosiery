import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Customize = () => {
  const location = useLocation();
  const { productImage } = location.state || {};
  const [formData, setFormData] = useState({
    productType: '',
    primaryColor: 'Orange (Hi-Vis)',
    size: '',
    reflectiveTape: true,
    companyLogo: '',
    logoPlacement: 'Front Center',
    customizationPrompt: '',
    quantity: 1
  });

  const [previewGenerated, setPreviewGenerated] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGeneratePreview = () => {
    setPreviewGenerated(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f54a00] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customize Your Safety Garment</h1>
          <p className="text-lg md:text-xl">
            Use our AI-powered preview system to visualize your custom safety garment before ordering.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customization Options */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Customization Options</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    required
                  >
                    <option value="">Select product type</option>
                    <option value="safety-vest">Safety Vest</option>
                    <option value="safety-jacket">Safety Jacket</option>
                    <option value="coverall">Coverall</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Primary Color <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    required
                  >
                    <option value="Orange (Hi-Vis)">Orange (Hi-Vis)</option>
                    <option value="Yellow (Hi-Vis)">Yellow (Hi-Vis)</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    required
                  >
                    <option value="">Select size</option>
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">Extra Large</option>
                    <option value="XXL">2X Large</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="reflectiveTape"
                    id="reflectiveTape"
                    checked={formData.reflectiveTape}
                    onChange={handleChange}
                    className="w-4 h-4 text-trana-orange border-gray-300 rounded focus:ring-trana-orange"
                  />
                  <label htmlFor="reflectiveTape" className="ml-2 text-sm font-semibold">
                    Add 360° Reflective Tape
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Company Logo/Text
                  </label>
                  <input
                    type="text"
                    name="companyLogo"
                    value={formData.companyLogo}
                    onChange={handleChange}
                    placeholder="Enter text for logo or company name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank if no logo required.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Logo Placement
                  </label>
                  <select
                    name="logoPlacement"
                    value={formData.logoPlacement}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  >
                    <option value="Front Center">Front Center</option>
                    <option value="Back Center">Back Center</option>
                    <option value="Left Chest">Left Chest</option>
                    <option value="Right Chest">Right Chest</option>
                    <option value="Sleeve">Sleeve</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Customization Prompt
                  </label>
                  <textarea
                    name="customizationPrompt"
                    value={formData.customizationPrompt}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe any other specific customization requests (e.g., 'add a yellow stripe', 'change collar style')"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use this to describe AI-powered edits.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum order: 1 unit.</p>
                </div>

                <button
                  onClick={handleGeneratePreview}
                  className="w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
                >
                  <span>✨</span>
                  Generate AI Preview
                </button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Preview</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 mb-6 flex items-center justify-center bg-gray-50 relative overflow-hidden">
                {productImage ? (
                  <img src={productImage} alt="Product Preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p className="text-gray-600">No product image selected</p>
                    <p className="text-sm text-gray-500 mt-2">Please select a product from the products page to customize.</p>
                  </div>
                )}
                {previewGenerated && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating AI preview...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Estimated Price:</span>
                  <span className="text-xl font-bold text-trana-orange">₹500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Delivery Time:</span>
                  <span className="text-gray-700">7-14 business days</span>
                </div>
              </div>

              <button className="w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                Add to Cart
              </button>

              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">✨</span>
                  <div>
                    <p className="text-sm font-semibold mb-1">Powered by AI Preview Technology</p>
                    <p className="text-xs text-gray-600">
                      Our AI system generates realistic previews of your customized garments using advanced image generation technology (Banana AI API integration).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Customization Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Logo Printing</h3>
              <p className="text-gray-600">
                Screen printing and embroidery options available for company logos and text.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Color Matching</h3>
              <p className="text-gray-600">
                Custom color options available for bulk orders to match your corporate branding.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Design Consultation</h3>
              <p className="text-gray-600">
                Free consultation with our design team for orders above 100 units.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Customize;

