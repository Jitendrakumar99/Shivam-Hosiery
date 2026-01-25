import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrder, cancelOrder } from '../store/slices/orderSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { order, loading, error } = useAppSelector((state) => state.orders);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id && isAuthenticated) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id, isAuthenticated]);

  const handleCancelOrder = async () => {
    if (!order) return;
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Are you sure you want to cancel this order?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const result = await dispatch(cancelOrder(order._id || order.id));
              if (cancelOrder.fulfilled.match(result)) {
                toast.success('Order cancelled successfully');
                dispatch(fetchOrder(id));
              } else {
                toast.error('Failed to cancel order');
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Cancel
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            No
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  const handleReorder = () => {
    if (!order || !order.items || order.items.length === 0) {
      toast.error('No items to reorder');
      return;
    }

    order.items.forEach((item) => {
      const product = item.product;
      if (product) {
        dispatch(addToCart({ product, quantity: item.quantity }));
      }
    });

    toast.success('All items added to cart!');
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'shipped':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-gray-600">Please login to view order details.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <Link
              to="/orders"
              className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if order belongs to current user
  const orderUserId = order.user?._id?.toString() || order.user?.toString();
  const currentUserId = user?._id?.toString() || user?.id?.toString();
  if (orderUserId !== currentUserId && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You are not authorized to view this order.</p>
            <Link
              to="/orders"
              className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-trana-orange">Home</Link></li>
            <li>/</li>
            <li><Link to="/orders" className="hover:text-trana-orange">Orders</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">Order #{order._id?.slice(-8).toUpperCase()}</li>
          </ol>
        </nav>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Details</h1>
              <p className="text-gray-600">
                Order ID: <span className="font-semibold">{order._id?.slice(-8).toUpperCase()}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt || order.date).toLocaleString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                <span>{getStatusIcon(order.status)}</span>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="font-semibold text-blue-900">Tracking Number</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{order.trackingNumber}</p>
              <p className="text-sm text-blue-600 mt-1">Use this number to track your shipment</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, idx) => {
                  const product = item.product;
                  return (
                    <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product?.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product?.name || 'Product'}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">Image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{product?.name || 'Product'}</h3>
                        {item.customization && (
                          <p className="text-sm text-gray-500 mb-1">
                            {Object.entries(item.customization).map(([key, value]) => value && `${key}: ${value}`).filter(Boolean).join(', ')}
                          </p>
                        )}
                        {product?.category && (
                          <p className="text-sm text-gray-500 mb-2">
                            {typeof product.category === 'object' ? product.category.name : product.category}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                            <p className="text-sm text-gray-600">Price: <span className="font-semibold">₹{item.price || product?.price || 0}</span> each</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-trana-orange">
                              ₹{(item.price || product?.price || 0) * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Order Placed</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt || order.date).toLocaleString()}</p>
                  </div>
                </div>
                {order.status === 'processing' && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Processing</p>
                      <p className="text-sm text-gray-600">Your order is being prepared</p>
                    </div>
                  </div>
                )}
                {['shipped', 'delivered'].includes(order.status) && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Shipped</p>
                      <p className="text-sm text-gray-600">
                        {order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'Your order has been shipped'}
                      </p>
                    </div>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Delivered</p>
                      <p className="text-sm text-gray-600">Your order has been delivered</p>
                    </div>
                  </div>
                )}
                {order.status === 'cancelled' && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Cancelled</p>
                      <p className="text-sm text-gray-600">This order has been cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-gray-700">Shipping Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                    {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                    {order.shippingAddress.email && <p>{order.shippingAddress.email}</p>}
                    <p>{order.shippingAddress.address}</p>
                    {(order.shippingAddress.city || order.shippingAddress.state || order.shippingAddress.pincode) && (
                      <p>
                        {order.shippingAddress.city}
                        {order.shippingAddress.city && order.shippingAddress.state && ', '}
                        {order.shippingAddress.state}
                        {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
                      </p>
                    )}
                  </div>
                  {order.deliveryAgent && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-1 text-gray-700">Shipping Partner</h3>
                      <p className="text-sm text-gray-600">{order.deliveryAgent}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Information */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-gray-700">Payment Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold">Method:</span> {order.paymentMethod || 'Cash on Delivery'}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : order.paymentStatus === 'refunded'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus === 'paid' 
                        ? 'Paid' 
                        : order.paymentStatus === 'failed' 
                        ? 'Failed' 
                        : order.paymentStatus === 'refunded'
                        ? 'Refunded'
                        : 'Pending'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{(order.totalAmount || order.total || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={order.shippingCost > 0 ? 'font-semibold' : 'font-semibold text-green-600'}>
                    {order.shippingCost > 0
                      ? `₹${order.shippingCost.toLocaleString()}`
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-trana-orange">
                    ₹{(
                      (order.totalAmount || order.total || 0) +
                      (order.shippingCost || 0)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {['pending', 'processing'].includes(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    className="w-full bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Cancel Order
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button
                    onClick={handleReorder}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Reorder
                  </button>
                )}
                <Link
                  to="/orders"
                  className="block w-full text-center bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

