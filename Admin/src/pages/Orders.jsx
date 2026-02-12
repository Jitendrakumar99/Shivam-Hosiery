import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../store/slices/orderSlice';
import { useState, useEffect } from 'react';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const { orders, loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <OrderCard key={order._id || order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
