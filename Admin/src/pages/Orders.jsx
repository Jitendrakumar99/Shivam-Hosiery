import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import { fetchStats } from '../store/slices/reportSlice';
import { useState, useEffect } from 'react';
import OrderDetailsModal from '../components/Modal/OrderDetailsModal';

const Orders = () => {
  const { orders, loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Update selectedOrder when orders list updates
  useEffect(() => {
    if (selectedOrder && orders.length > 0) {
      const updatedOrder = orders.find(
        o => (o._id || o.id) === (selectedOrder._id || selectedOrder.id)
      );
      if (updatedOrder) {
        // Only update if there are actual changes to avoid infinite loops
        const orderChanged = 
          updatedOrder.status !== selectedOrder.status ||
          updatedOrder.paymentStatus !== selectedOrder.paymentStatus ||
          updatedOrder.deliveryAgent !== selectedOrder.deliveryAgent;
        if (orderChanged) {
          setSelectedOrder(updatedOrder);
        }
      }
    }
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const orderId = (order._id || order.id || '').toString();
    const customerName = (order.user?.name || order.customer || '').toLowerCase();
    const email = (order.user?.email || order.email || '').toLowerCase();
    const matchesSearch = 
      orderId.includes(searchTerm.toLowerCase()) ||
      customerName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const currentOrder = orders.find(o => (o._id || o.id) === orderId);
      await dispatch(updateOrderStatus({ 
        id: orderId, 
        status: newStatus,
        paymentStatus: currentOrder?.paymentStatus // Preserve payment status
      })).unwrap();
      // Refresh orders list to show updated status
      await dispatch(fetchOrders());
      // Refresh stats if status change might affect revenue
      if (newStatus === 'delivered' || newStatus === 'shipped') {
        await dispatch(fetchStats());
      }
      // Update selectedOrder if it's the one being changed
      if (selectedOrder && (selectedOrder._id || selectedOrder.id) === orderId) {
        const updatedOrder = orders.find(
          o => (o._id || o.id) === orderId
        );
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    // Refresh orders list and stats when modal closes to ensure all updates are reflected
    await dispatch(fetchOrders());
    await dispatch(fetchStats()); // Refresh stats in case payment status changed
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid': return 'Paid';
      case 'failed': return 'Failed';
      case 'pending': return 'Pending';
      case 'refunded': return 'Refunded';
      default: return 'Pending';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage all customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm sm:text-base"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm sm:text-base"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No orders found.</p>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id || order.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">{(order._id || order.id)?.slice(-8) || 'N/A'}</h3>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    Order Status: {order.status || 'N/A'}
                  </span>
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                    Payment Status: {getPaymentStatusText(order.paymentStatus || 'pending')}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600 mb-0.5">Customer</p>
                    <p className="font-semibold text-gray-800 truncate">{order.user?.name || order.customer || 'N/A'}</p>
                    <p className="text-gray-500 text-xs truncate">{order.user?.email || order.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Order Date</p>
                    <p className="font-semibold text-gray-800">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Total Amount</p>
                    <p className="font-semibold text-green-600">₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Items</p>
                    <p className="font-semibold text-gray-800">{order.items?.length || order.items || 0} products</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Payment Method</p>
                    <p className="font-semibold text-gray-800 truncate">{order.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Delivery Agent</p>
                    <p className="font-semibold text-gray-800 truncate">{order.deliveryAgent || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-2 lg:ml-6 w-full sm:w-auto sm:min-w-[200px] lg:min-w-[220px]">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewOrder(order)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:bg-gray-100 border border-gray-300 rounded-lg transition" aria-label="Print">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default Orders;

