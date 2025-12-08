import { useState } from 'react';
import { contactService } from '../services/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await contactService.submitContact(formData);
      setSuccessMessage('Thank you! Your message has been sent successfully. We will get back to you soon.');
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
      console.error('Error sending contact form:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'What is the minimum order quantity for bulk orders?',
      answer: 'The minimum order quantity varies by product type. Generally, bulk orders start at 50 units, but we offer flexible terms for larger quantities. Contact our sales team for specific requirements.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship internationally. Shipping costs and delivery times vary by location. Please contact us for international shipping quotes and customs information.'
    },
    {
      question: 'Can I customize the safety garments with my company logo?',
      answer: 'Absolutely! We offer logo embroidery and screen printing services. Customization options are available for orders above 50 units. Our design team can help you with placement and sizing.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfers, credit/debit cards, and for B2B clients, we offer flexible payment terms including credit options and invoicing.'
    },
    {
      question: 'How long does production and delivery take?',
      answer: 'Standard orders typically take 7-14 business days for production and delivery. For customized orders, please allow 14-21 business days. Bulk orders may have different timelines - contact us for specific delivery schedules.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#f54a00] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Trana</h1>
          <p className="text-lg md:text-xl">
            Have questions? Our team is here to help with product inquiries, bulk orders, and customization requests.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-trana-orange mb-2">shivamhosiery.raipur@gmail.com</p>
              <p className="text-sm text-gray-600">Response within 24 hours</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-trana-orange mb-2">+91 XXXX-XXXXXX</p>
              <p className="text-sm text-gray-600">Mon-Sat, 9:00 AM - 6:00 PM</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-700">Raipur, Chhattisgarh, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Form and FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              {successMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXXX XXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Inquiry Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  >
                    <option value="">Select inquiry type</option>
                    <option value="product">Product Inquiry</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="customization">Customization</option>
                    <option value="support">Customer Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    rows="5"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4 mb-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Need Immediate Assistance Card */}
              <div className="bg-white border-2 border-trana-orange rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-trana-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Need Immediate Assistance?</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Our customer support team is available to help you with urgent inquiries. 
                      Request a callback and we'll get back to you as soon as possible.
                    </p>
                    <button className="bg-white text-trana-orange border-2 border-trana-orange px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition">
                      Request Callback
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

