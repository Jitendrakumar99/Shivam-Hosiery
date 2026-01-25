import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchOrders } from '../store/slices/orderSlice';
import { setTransactions } from '../store/slices/paymentSlice';
import { buildTransactionsFromOrders } from '../store/slices/paymentSlice';

const Payments = () => {
  const dispatch = useDispatch();
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { transactions, summary, loading } = useSelector((state) => state.payments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, amount
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Build transactions from orders whenever orders change
  useEffect(() => {
    if (orders && orders.length > 0) {
      const transactions = buildTransactionsFromOrders(orders);
      dispatch(setTransactions(transactions));
    }
  }, [orders, dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = 
        transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || transaction.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        const dateA = new Date(a.datetime || a.date);
        const dateB = new Date(b.datetime || b.date);
        comparison = dateA - dateB;
      } else if (sortBy === 'amount') {
        comparison = Number(a.amount || 0) - Number(b.amount || 0);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Payment & Transactions</h1>
        <p className="text-gray-600 mt-1">View all payment transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Successful</p>
              <p className="text-2xl font-bold text-gray-800">₹{summary.successful.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-800">₹{summary.pending.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Failed</p>
              <p className="text-2xl font-bold text-gray-800">₹{summary.failed.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Refunded</p>
              <p className="text-2xl font-bold text-gray-800">₹{summary.refunded.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by transaction ID, order ID, customer name or email..."
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
            <option value="all">All Status</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order);
            }}
            className="px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm sm:text-base"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      {ordersLoading || loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No transactions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">Transaction ID: {transaction.id}</p>
                      <p className="text-xs sm:text-sm text-gray-600">Order ID: {transaction.orderId.slice(-8)}</p>
                    </div>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                      transaction.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      transaction.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      transaction.orderStatus === 'processing' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.orderStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-600 mb-0.5">Customer</p>
                      <p className="font-semibold text-gray-800 truncate">{transaction.customer}</p>
                      <p className="text-gray-500 text-xs truncate">{transaction.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-0.5">Payment Method</p>
                      <p className="font-semibold text-gray-800">{transaction.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-0.5">Date</p>
                      <p className="font-semibold text-gray-800">{transaction.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between lg:justify-end gap-4 lg:ml-6">
                  <div className="text-right lg:text-left">
                    <p className="text-lg sm:text-xl font-bold text-gray-800">₹{transaction.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Payment Status: <span className="capitalize font-medium">{transaction.paymentStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtered Results Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ₹{filteredTransactions.filter(t => t.status === 'success').reduce((sum, t) => sum + Number(t.amount || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600 mt-1">Successful</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                ₹{filteredTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + Number(t.amount || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                ₹{filteredTransactions.filter(t => t.status === 'failed').reduce((sum, t) => sum + Number(t.amount || 0), 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-600 mt-1">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {filteredTransactions.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

