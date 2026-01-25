import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { fetchCustomers } from '../store/slices/customerSlice';
import { fetchStats } from '../store/slices/reportSlice';

const monthLabel = (date) =>
  date.toLocaleString('en-US', { month: 'short' });

function buildRevenueTrendFromOrders(orders) {
  // last 6 months including current month
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ y: d.getFullYear(), m: d.getMonth(), label: monthLabel(d) });
  }

  const trend = months.map((m) => ({ month: m.label, revenue: 0, previousRevenue: 0 }));

  // Only count delivered/shipped orders with paymentStatus 'paid' for revenue
  // Include shipping costs to match Payments page calculation
  const revenueOrders = orders.filter(o => 
    (o.status === 'delivered' || o.status === 'shipped') &&
    (o.paymentStatus === 'paid')
  );

  revenueOrders.forEach((o) => {
    const createdAt = o.createdAt ? new Date(o.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return;

    const orderYear = createdAt.getFullYear();
    const orderMonth = createdAt.getMonth();
    
    // Find current month index
    const idx = months.findIndex((m) => m.y === orderYear && m.m === orderMonth);
    if (idx === -1) return;

    const totalAmount = Number(o.totalAmount ?? o.total ?? 0);
    const shippingCost = Number(o.shippingCost ?? 0);
    const grandTotal = totalAmount + shippingCost;
    if (Number.isFinite(grandTotal) && grandTotal > 0) {
      trend[idx].revenue += grandTotal;
    }
  });

  // Calculate previous month revenue for comparison
  for (let i = 1; i < trend.length; i++) {
    trend[i].previousRevenue = trend[i - 1].revenue;
  }

  return trend;
}

function buildOrderStatusDistribution(orders) {
  const dist = { pending: 0, processing: 0, packed: 0, shipped: 0, delivered: 0, cancelled: 0 };
  orders.forEach((o) => {
    const s = (o.status || 'pending').toLowerCase();
    if (dist[s] !== undefined) dist[s] += 1;
  });
  return dist;
}

function buildPaymentStatusDistribution(orders) {
  const dist = { paid: 0, pending: 0, failed: 0, refunded: 0 };
  orders.forEach((o) => {
    const paymentStatus = (o.paymentStatus || 'pending').toLowerCase();
    if (dist[paymentStatus] !== undefined) {
      dist[paymentStatus] += 1;
    } else {
      // If paymentStatus is not one of the expected values, count as pending
      dist.pending += 1;
    }
  });
  return dist;
}

function calculateTotalRevenue(orders) {
  // Only count delivered/shipped orders with paymentStatus 'paid' for revenue
  // Include shipping costs to match Payments page calculation
  const paidOrders = orders.filter(o => 
    (o.status === 'delivered' || o.status === 'shipped') &&
    (o.paymentStatus === 'paid')
  );
  
  return paidOrders.reduce((total, order) => {
    const totalAmount = Number(order.totalAmount ?? order.total ?? 0);
    const shippingCost = Number(order.shippingCost ?? 0);
    const grandTotal = totalAmount + shippingCost;
    return total + (Number.isFinite(grandTotal) && grandTotal > 0 ? grandTotal : 0);
  }, 0);
}

function RevenueLineChart({ data, maxValue }) {
  const chartHeight = 240;
  const chartWidth = 600;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = padding.left + (index / (data.length - 1 || 1)) * graphWidth;
    const y = padding.top + graphHeight - ((item.revenue || 0) / maxValue) * graphHeight;
    return { x, y, ...item };
  });

  // Create path for the line
  const linePath = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create path for the area under the line
  const areaPath = [
    `M ${points[0].x} ${padding.top + graphHeight}`,
    ...points.map(p => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${padding.top + graphHeight}`,
    'Z'
  ].join(' ');

  // Y-axis labels
  const yAxisSteps = 5;
  const yAxisLabels = [];
  for (let i = 0; i <= yAxisSteps; i++) {
    const value = (maxValue / yAxisSteps) * (yAxisSteps - i);
    const y = padding.top + (graphHeight / yAxisSteps) * i;
    yAxisLabels.push({ value, y });
  }

  return (
    <div className="relative">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full h-64"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {yAxisLabels.map((label, idx) => (
          <line
            key={idx}
            x1={padding.left}
            y1={label.y}
            x2={chartWidth - padding.right}
            y2={label.y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label, idx) => (
          <text
            key={idx}
            x={padding.left - 10}
            y={label.y + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {label.value >= 1000 ? `₹${(label.value / 1000).toFixed(1)}k` : `₹${Math.round(label.value)}`}
          </text>
        ))}

        {/* Area under the line */}
        <path
          d={areaPath}
          fill="url(#revenueGradient)"
          opacity="0.3"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => {
          const revenue = Number(point.revenue || 0);
          const previousRevenue = Number(point.previousRevenue || 0);
          const growthPercent = previousRevenue > 0 
            ? ((revenue - previousRevenue) / previousRevenue) * 100 
            : (revenue > 0 ? 100 : 0);
          const isPositive = growthPercent >= 0;

          return (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all cursor-pointer"
              />
              {/* Hover tooltip */}
              <g className="opacity-0 hover:opacity-100 transition-opacity">
                <rect
                  x={point.x - 35}
                  y={point.y - 45}
                  width="70"
                  height="35"
                  rx="4"
                  fill="#1f2937"
                  className="pointer-events-none"
                />
                <text
                  x={point.x}
                  y={point.y - 30}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  ₹{revenue.toLocaleString('en-IN')}
                </text>
                {index > 0 && previousRevenue > 0 && (
                  <text
                    x={point.x}
                    y={point.y - 15}
                    textAnchor="middle"
                    fontSize="9"
                    fill={isPositive ? '#86efac' : '#fca5a5'}
                    className="pointer-events-none"
                  >
                    {isPositive ? '+' : ''}{growthPercent.toFixed(1)}% vs prev
                  </text>
                )}
              </g>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((item, index) => {
          const x = padding.left + (index / (data.length - 1 || 1)) * graphWidth;
          return (
            <text
              key={index}
              x={x}
              y={chartHeight - padding.bottom + 15}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
              fontWeight="500"
            >
              {item.month}
            </text>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function PieChart({ data, colors }) {
  const entries = Object.entries(data).filter(([, v]) => Number(v) > 0);
  const total = entries.reduce((sum, [, v]) => sum + Number(v), 0);

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        No data to display
      </div>
    );
  }

  const cx = 80;
  const cy = 80;
  const r = 70;
  let startAngle = -Math.PI / 2;

  const paths = entries.map(([key, value], idx) => {
    const fraction = Number(value) / total;
    const angle = fraction * Math.PI * 2;
    const endAngle = startAngle + angle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    startAngle = endAngle;

    return (
      <path key={key} d={d} fill={colors[idx % colors.length]} />
    );
  });

  return (
    <div className="h-64 flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160" className="shrink-0">
        {paths}
      </svg>
      <div className="flex-1 space-y-2">
        {entries.map(([key, value], idx) => {
          // Format payment status labels
          const labelMap = {
            'paid': 'Paid',
            'pending': 'Pending',
            'failed': 'Failed',
            'refunded': 'Refunded'
          };
          const displayLabel = labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
          const percentage = ((Number(value) / total) * 100).toFixed(1);
          
          return (
            <div key={key} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: colors[idx % colors.length] }} />
                <span className="text-gray-700 font-medium">{displayLabel}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-800 font-semibold">{value}</span>
                <span className="text-gray-500 text-xs ml-2">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

  // Calculate total revenue from orders (more accurate than backend stats which may be cached)
  const calculatedTotalRevenue = calculateTotalRevenue(orders || []);
  const totalRevenue = calculatedTotalRevenue > 0 ? calculatedTotalRevenue : (metrics.totalRevenue || 0);
  
  // Calculate average order value from paid orders
  const paidOrders = (orders || []).filter(o => 
    (o.status === 'delivered' || o.status === 'shipped') &&
    (o.paymentStatus === 'paid')
  );
  const calculatedAvgOrderValue = paidOrders.length > 0 
    ? calculateTotalRevenue(orders || []) / paidOrders.length 
    : 0;
  const avgOrderValue = calculatedAvgOrderValue > 0 ? calculatedAvgOrderValue : (metrics.avgOrderValue || 0);

  // Build payment status distribution
  const paymentStatusData = buildPaymentStatusDistribution(orders || []);

  const computedRevenueTrend = buildRevenueTrendFromOrders(orders || []);
  const revenueBars = (computedRevenueTrend.some(i => i.revenue > 0) ? computedRevenueTrend : revenueTrend) || [];
  const revenueMax = Math.max(1, ...revenueBars.map(i => Number(i.revenue) || 0));

  const computedOrderStatusDistribution = buildOrderStatusDistribution(orders || []);
  const statusData = Object.values(computedOrderStatusDistribution).some(v => v > 0)
    ? computedOrderStatusDistribution
    : (orderStatusDistribution || {});

  const pieColors = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#14b8a6'];
  const paymentStatusColors = ['#22c55e', '#f59e0b', '#ef4444', '#f97316']; // Green for paid, Orange for pending, Red for failed, Orange-red for refunded

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
              <p className="text-xs text-gray-500 mt-1">
                From {paidOrders.length} paid {paidOrders.length === 1 ? 'order' : 'orders'}
              </p>
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
          {revenueBars.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No revenue data available</p>
              </div>
          ) : (
            <RevenueLineChart data={revenueBars} maxValue={revenueMax} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Status Distribution</h3>
          <p className="text-sm text-gray-600 mb-4">Current orders by status</p>
          <PieChart data={statusData} colors={pieColors} />
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
                  <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Status Distribution</h3>
          <p className="text-sm text-gray-600 mb-4">Orders by payment status</p>
          <PieChart data={paymentStatusData} colors={paymentStatusColors} />
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

