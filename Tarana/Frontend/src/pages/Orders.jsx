import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders, cancelOrder } from '../store/slices/orderSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  const handleCancelOrder = async (orderId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Are you sure you want to cancel this order?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const result = await dispatch(cancelOrder(orderId));
              if (cancelOrder.fulfilled.match(result)) {
                toast.success('Order cancelled successfully');
                dispatch(fetchOrders());
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

  const handleRefresh = () => {
    dispatch(fetchOrders());
    toast.success('Orders refreshed');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter orders: first by current user (safety check), then by status filter
  const userOrders = (orders || []).filter(order => {
    // Ensure we only show orders belonging to the current user
    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    const currentUserId = user?._id?.toString() || user?.id?.toString();
    return orderUserId === currentUserId;
  });

  const filteredOrders = filter === 'all'
    ? userOrders
    : userOrders.filter(order => order.status === filter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-gray-600">Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Refresh orders"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${filter === status
                ? 'bg-trana-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <>
            {filteredOrders && filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No orders found</p>
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id || order.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">Order #{order._id?.slice(-8) || order.id}</h3>
                        <p className="text-gray-600">
                          Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-500 mt-1">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 md:mt-0">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="space-y-4 mb-4">
                        {order.items?.map((item, idx) => {
                          const product = item.product || {};
                          return (
                            <div key={idx} className="flex gap-4 items-center">
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name || 'Product'}
                                    className="w-full h-full object-cover rounded"
                                  />
                                ) : (
                                  <span className="text-gray-400 text-xs">No Image</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{product.name || item.name || 'Product'}</h4>
                                {item.customization && (
                                  <p className="text-xs text-gray-500 mb-1">
                                    {Object.entries(item.customization).map(([key, value]) => value && `${key}: ${value}`).filter(Boolean).join(', ')}
                                  </p>
                                )}
                                {product.category && (
                                  <p className="text-sm text-gray-500">
                                    {typeof product.category === 'object' ? product.category.name : product.category}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-trana-primary">
                                  ₹{(item.price || product.price || 0) * item.quantity}
                                </p>
                                <p className="text-xs text-gray-500">₹{item.price || product.price || 0} each</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-xl font-bold text-trana-primary">₹{order.totalAmount?.toLocaleString() || order.total?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/orders/${order._id || order.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-center"
                      >
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => {
                            if (order.items && order.items.length > 0) {
                              order.items.forEach((item) => {
                                const product = item.product;
                                if (product) {
                                  dispatch(addToCart({ product, quantity: item.quantity }));
                                }
                              });
                              toast.success('All items added to cart!');
                              navigate('/cart');
                            } else {
                              toast.error('No items to reorder');
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Reorder
                        </button>
                      )}
                      {['pending', 'processing'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order._id || order.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
