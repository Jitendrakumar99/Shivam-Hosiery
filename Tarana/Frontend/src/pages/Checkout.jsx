import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createOrder, fetchOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { getMe } from '../store/slices/authSlice';
import { fetchProducts } from '../store/slices/productSlice';
import toast from 'react-hot-toast';

// Related Products Component
const RelatedProductsSection = ({ orderedItems }) => {
  const { products } = useAppSelector((state) => state.products);
  const orderedProductIds = orderedItems.map(item => item.product._id || item.product.id);
  
  // Filter out products that were already ordered and get related products
  const relatedProducts = products
    .filter(product => !orderedProductIds.includes(product._id || product.id))
    .slice(0, 8);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link
            key={product._id || product.id}
            to={`/products/${product._id || product.id}`}
            className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition"
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-32 object-cover rounded mb-3"
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
            <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
            <p className="text-trana-orange font-bold">₹{product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading, order } = useAppSelector((state) => state.orders);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formInitialized, setFormInitialized] = useState(false);
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'Cash on Delivery',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    if (items.length === 0 && !orderPlaced) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Fetch user data to get addresses only if user is not loaded or addresses are missing
    if (isAuthenticated && (!user || (user && !user.addresses))) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, items.length, navigate, orderPlaced, user]);

  useEffect(() => {
    // Pre-fill form with user data or selected address (only once)
    if (user && !formInitialized) {
      if (selectedAddressId && user.addresses) {
        const selectedAddress = user.addresses.find(addr => addr._id === selectedAddressId);
        if (selectedAddress) {
          setFormData({
            name: selectedAddress.name || '',
            phone: selectedAddress.phone || '',
            address: selectedAddress.address || '',
            city: selectedAddress.city || '',
            state: selectedAddress.state || '',
            pincode: selectedAddress.pincode || '',
            email: user.email || '',
            paymentMethod: 'Cash on Delivery',
          });
          setFormInitialized(true);
          return;
        }
      }
      
      // Use default address if available
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setFormData({
            name: defaultAddress.name || '',
            phone: defaultAddress.phone || '',
            address: defaultAddress.address || '',
            city: defaultAddress.city || '',
            state: defaultAddress.state || '',
            pincode: defaultAddress.pincode || '',
            email: user.email || '',
            paymentMethod: 'Cash on Delivery',
          });
          setFormInitialized(true);
          return;
        }
      }

      // Fallback to user basic info
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
      }));
      setFormInitialized(true);
    }
  }, [user, selectedAddressId, formInitialized]);

  // Update form when address selection changes (after initial load)
  useEffect(() => {
    if (user && formInitialized && selectedAddressId && user.addresses) {
      const selectedAddress = user.addresses.find(addr => addr._id === selectedAddressId);
      if (selectedAddress) {
        setFormData(prev => ({
          ...prev,
          name: selectedAddress.name || '',
          phone: selectedAddress.phone || '',
          address: selectedAddress.address || '',
          city: selectedAddress.city || '',
          state: selectedAddress.state || '',
          pincode: selectedAddress.pincode || '',
        }));
      }
    }
  }, [selectedAddressId, user, formInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (formData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    const orderData = {
      items: items.map(item => ({
        product: item.product._id || item.product.id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      paymentMethod: formData.paymentMethod,
    };

    const result = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(result)) {
      const createdOrder = result.payload.data;
      setTrackingId(createdOrder.trackingNumber || createdOrder._id?.slice(-12).toUpperCase());
      
      // Store ordered items and total before clearing cart
      setOrderedItems([...items]);
      setOrderTotal(total);
      
      // Fetch the full order details
      if (createdOrder._id) {
        await dispatch(fetchOrder(createdOrder._id));
      }
      
      // Fetch related products based on ordered items
      if (items.length > 0) {
        const firstProductCategory = items[0].product?.category;
        if (firstProductCategory) {
          dispatch(fetchProducts({ category: firstProductCategory, limit: 8 }));
        } else {
          dispatch(fetchProducts({ limit: 8 }));
        }
      }
      
      dispatch(clearCart());
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    } else {
      toast.error(result.payload || 'Failed to place order. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (!orderPlaced && items.length === 0) {
    return null; // Will redirect
  }

  if (orderPlaced) {
    const orderId = order?._id || null;
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center mb-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-gray-600">Thank you for your order. We'll process it shortly.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Tracking ID</p>
                <p className="text-2xl font-bold text-trana-orange mb-4">{trackingId || 'N/A'}</p>
                <p className="text-sm text-gray-600">
                  Save this tracking ID to track your order status
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4 text-left max-w-2xl mx-auto">
                {orderedItems.map((item) => (
                  <div key={item.product._id || item.product.id} className="flex gap-4 items-center border-b border-gray-200 pb-4 last:border-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                      {item.product.category && (
                        <p className="text-sm text-gray-500 mb-1">{item.product.category}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-trana-orange">₹{item.price * item.quantity}</p>
                      <p className="text-xs text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-trana-orange">₹{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {orderId && (
                <Link
                  to={`/orders/${orderId}`}
                  className="inline-block bg-trana-orange text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  View Order
                </Link>
              )}
              <Link
                to="/orders"
                className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Related Products Section */}
          <RelatedProductsSection orderedItems={orderedItems} />

          {/* Recommendations & Ads Section */}
          <div className="bg-gradient-to-r from-trana-orange to-orange-600 rounded-lg shadow-md p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-6">Special Offers & Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <h3 className="font-bold text-lg">Free Shipping</h3>
                </div>
                <p className="text-sm">On all orders above ₹5000</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-lg">Bulk Discount</h3>
                </div>
                <p className="text-sm">Get up to 20% off on bulk orders</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h3 className="font-bold text-lg">Loyalty Points</h3>
                </div>
                <p className="text-sm">Earn points on every purchase</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="font-bold text-xl">Why Choose Us?</h3>
              </div>
              <ul className="text-sm space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Premium Quality Safety Garments
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Customization Available
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Fast & Reliable Delivery
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Expert Customer Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
              
              {/* Saved Addresses Selection */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Select Delivery Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {user.addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                          selectedAddressId === address._id
                            ? 'border-trana-orange bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {address.isDefault && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                            DEFAULT
                          </span>
                        )}
                        <p className="font-semibold">{address.name}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600">{address.address}</p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/profile"
                    className="text-trana-orange hover:underline text-sm"
                  >
                    Manage Addresses →
                  </Link>
                  <div className="border-t border-gray-200 my-6"></div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      minLength="10"
                      maxLength="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      minLength="6"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-orange"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const product = item.product;
                  return (
                    <div key={product._id || product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-trana-orange">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-trana-orange">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <Link
                to="/cart"
                className="block text-center mt-4 text-trana-orange hover:underline text-sm"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

