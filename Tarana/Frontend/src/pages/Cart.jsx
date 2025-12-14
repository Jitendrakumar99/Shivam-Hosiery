import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { getMe } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateQuantity({ productId, quantity: parseInt(quantity) }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-600 mb-4">Please login to view your cart.</p>
          <Link
            to="/login"
            className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product;
                return (
                  <div key={product._id || product.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <span className="text-gray-500 text-xs">Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2">₹{item.price} each</p>
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-semibold">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(product._id || product.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                          />
                          <button
                            onClick={() => handleRemove(product._id || product.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-trana-orange">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-4">
              {/* Saved Addresses */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                  <div className="space-y-3">
                    {user.addresses.filter(addr => addr.isDefault).map((address) => (
                      <div key={address._id} className="border border-gray-200 rounded-lg p-4">
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
                    {user.addresses.filter(addr => !addr.isDefault).slice(0, 1).map((address) => (
                      <div key={address._id} className="border border-gray-200 rounded-lg p-4">
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
                    className="block text-center mt-4 text-trana-orange hover:underline text-sm"
                  >
                    Manage Addresses
                  </Link>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-trana-orange">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-trana-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition text-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/products"
                  className="block text-center mt-4 text-trana-orange hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

