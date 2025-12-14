import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { fetchCustomers } from '../store/slices/customerSlice';
import { fetchStats } from '../store/slices/reportSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { customers, loading: customersLoading } = useSelector((state) => state.customers);
  const { metrics, revenueTrend, orderStatusDistribution, loading: statsLoading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  const lowStockProducts = products.filter(p => p.stock && p.stock < 10);
  const totalRevenue = metrics.totalRevenue || 0;
  const avgOrderValue = metrics.avgOrderValue || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{metrics.revenueGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalOrders || orders.length}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{metrics.ordersGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalCustomers || customers.length}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>+{metrics.customersGrowth}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalProducts || products.length}</p>
              {lowStockProducts.length > 0 && (
                <p className="text-red-600 text-sm mt-2">{lowStockProducts.length} low stock</p>
              )}
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue Trend</h3>
          <p className="text-sm text-gray-600 mb-4">Monthly revenue for the last 6 months</p>
          <div className="h-64 flex items-end justify-between gap-2">
            {revenueTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(item.revenue / 100000) * 100}%` }}
                />
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Status Distribution</h3>
          <p className="text-sm text-gray-600 mb-4">Current orders by status</p>
          <div className="h-64 flex items-end justify-between gap-2">
            {Object.entries(orderStatusDistribution).map(([status, value]) => (
              <div key={status} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-orange-500 rounded-t" style={{ height: '100%' }} />
                <span className="text-xs text-gray-600 mt-2 capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Shivam Website
            </button>
            <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Trana Website
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Orders</h3>
          <p className="text-sm text-gray-600 mb-4">Latest customer orders</p>
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order._id || order.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                <div>
                  <p className="font-semibold text-gray-800">{order._id?.slice(-8) || order.id}</p>
                  <p className="text-sm text-gray-600">{order.user?.name || order.customer || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Low Stock Alerts</h3>
          <p className="text-sm text-gray-600 mb-4">Products running low on inventory</p>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product._id || product.id} className="pb-3 border-b last:border-0">
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-red-600 mt-1">
                  {product.stock} units
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-3xl font-bold text-gray-800">{metrics.pendingOrders || orders.filter(o => o.status === 'pending').length}</p>
          <p className="text-gray-600 mt-2">Pending Orders</p>
          <p className="text-sm text-gray-500">Requires attention</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
          <p className="text-gray-600 mt-2">Active Customers</p>
          <p className="text-sm text-gray-500">Total registered</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-3xl font-bold text-gray-800">₹{Math.round(avgOrderValue).toLocaleString('en-IN')}</p>
          <p className="text-gray-600 mt-2">Average Order Value</p>
          <p className="text-sm text-gray-500">Per order</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

