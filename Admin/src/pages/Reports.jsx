import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchStats } from '../store/slices/reportSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import * as XLSX from 'xlsx';

const monthLabel = (date) =>
  date.toLocaleString('en-US', { month: 'short' });

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

function buildRevenueTrendFromOrders(orders) {
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
    const idx = months.findIndex((m) => m.y === createdAt.getFullYear() && m.m === createdAt.getMonth());
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

function buildCategoryDistribution(products) {
  const dist = {};
  products.forEach((p) => {
    const catName = p.category?.name || p.category || 'Uncategorized';
    dist[catName] = (dist[catName] || 0) + 1;
  });
  const total = products.length;
  if (total === 0) return {};
  const result = {};
  Object.entries(dist).forEach(([cat, count]) => {
    result[cat] = Math.round((count / total) * 100);
  });
  return result;
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
          fill="url(#revenueGradientReports)"
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
          <linearGradient id="revenueGradientReports" x1="0%" y1="0%" x2="0%" y2="100%">
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
        {entries.map(([key, value], idx) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: colors[idx % colors.length] }} />
              <span className="capitalize text-gray-700">{key}</span>
            </div>
            <span className="text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const Reports = () => {
  const dispatch = useDispatch();
  const { metrics, loading: statsLoading } = useSelector((state) => state.reports);
  const { orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchOrders());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportSalesReport = () => {
    const reportData = (orders || []).map(order => ({
      'Order ID': order._id?.toString().toUpperCase() || 'N/A',
      'Short ID': `#${order._id?.toString().slice(-8).toUpperCase()}` || 'N/A',
      'Date': new Date(order.createdAt).toLocaleString(),
      'Customer Name': order.shippingAddress?.name || order.user?.name || 'N/A',
      'Customer Email': order.user?.email || 'N/A',
      'Customer Phone': order.shippingAddress?.phone || 'N/A',
      'Total Items Quantity': (order.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0),
      'Detailed Items': order.items?.map(it => {
        const name = it.product?.title || it.product?.name || 'Item';
        const sku = it.sku || it.product?.sku || 'N/A';
        const qty = it.quantity || 0;
        const price = it.price || 0;
        const subtotal = qty * price;
        const custom = it.customization
          ? Object.entries(it.customization).map(([k, v]) => `${k}: ${v}`).filter(([k, v]) => v).join(', ')
          : '';
        return `${name} [SKU: ${sku}] (Qty: ${qty} x ₹${price.toLocaleString()} = ₹${subtotal.toLocaleString()})${custom ? ' { ' + custom + ' }' : ''}`;
      }).join(' | '),
      'Net Amount': order.totalAmount || 0,
      'Shipping Cost': order.shippingCost || 0,
      'Total Paid': (order.totalAmount || 0) + (order.shippingCost || 0),
      'Payment Method': order.paymentMethod || 'N/A',
      'Order Status': (order.status || 'pending').toUpperCase(),
      'Payment Status': (order.paymentStatus || 'pending').toUpperCase(),
      'Tracking Number': order.trackingNumber || 'Not Shipped',
      'Delivery Agent': order.deliveryAgent || 'N/A',
      'Shipping Address': `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`
    }));
    exportToExcel(reportData, 'Full_Sales_Report');
  };

  const exportCustomerReport = () => {
    const customersMap = {};
    (orders || []).forEach(order => {
      const email = order.user?.email || 'Guest';
      if (!customersMap[email]) {
        customersMap[email] = {
          'Customer Name': order.shippingAddress?.name || order.user?.name || 'N/A',
          'Primary Email': email,
          'Phone Number': order.shippingAddress?.phone || 'N/A',
          'Total Orders Placed': 0,
          'Total Lifetime Spend': 0,
          'Last Order Date': new Date(order.createdAt).toLocaleDateString()
        };
      }
      customersMap[email]['Total Orders Placed'] += 1;
      customersMap[email]['Total Lifetime Spend'] += (order.totalAmount || 0) + (order.shippingCost || 0);

      const orderDate = new Date(order.createdAt);
      const lastDate = new Date(customersMap[email]['Last Order Date']);
      if (orderDate > lastDate) {
        customersMap[email]['Last Order Date'] = orderDate.toLocaleDateString();
      }
    });
    exportToExcel(Object.values(customersMap), 'All_Customers_Report');
  };

  const exportInventoryReport = () => {
    const reportData = (products || []).map(product => ({
      'Product Title': product.title || product.name || 'N/A',
      'SKU ID': product.sku || 'N/A',
      'Main Category': product.category?.name || product.category || 'N/A',
      'Current Price (₹)': product.price || 0,
      'Stock Quantity': product.stock || 0,
      'Availability': product.stock > 10 ? 'In Stock' : (product.stock > 0 ? 'Low Stock' : 'Out of Stock'),
      'Description': product.description?.replace(/<[^>]*>?/gm, '').slice(0, 100) || 'N/A'
    }));
    exportToExcel(reportData, 'Full_Inventory_Status');
  };

  const exportPaymentReport = () => {
    const reportData = (orders || []).map(order => ({
      'Order Reference': order._id?.toString().toUpperCase() || 'N/A',
      'Transaction Date': new Date(order.createdAt).toLocaleString(),
      'Settled Amount (₹)': (order.totalAmount || 0) + (order.shippingCost || 0),
      'Payment Gateway/Method': order.paymentMethod || 'N/A',
      'Verification Status': (order.paymentStatus || 'pending').toUpperCase(),
      'Payer Name': order.shippingAddress?.name || 'N/A',
      'Customer Email': order.user?.email || 'N/A'
    }));
    exportToExcel(reportData, 'Financial_Payments_Report');
  };

  const exportAll = () => {
    exportSalesReport();
    exportCustomerReport();
    exportInventoryReport();
    exportPaymentReport();
  };

  const exportRevenueTrendReport = () => {
    const reportData = revenueTrend.map(item => ({
      'Reporting Month': item.month,
      'Revenue Generated (₹)': item.revenue,
      'Previous Month Revenue (₹)': item.previousRevenue,
      'Growth Index (%)': item.previousRevenue > 0
        ? (((item.revenue - item.previousRevenue) / item.previousRevenue) * 100).toFixed(2)
        : (item.revenue > 0 ? '100.00' : '0.00')
    }));
    exportToExcel(reportData, 'Monthly_Revenue_Trend');
  };

  const exportStatusDistributionReport = () => {
    const reportData = Object.entries(orderStatusDistribution).map(([status, count]) => ({
      'Operational Status': status.toUpperCase(),
      'Total Orders in Pipeline': count,
      'Distribution Percentage (%)': ((count / (orders?.length || 1)) * 100).toFixed(2)
    }));
    exportToExcel(reportData, 'Pipeline_Status_Distribution');
  };

  const exportCategoryDistributionReport = () => {
    const reportData = Object.entries(categoryDistribution).map(([cat, percent]) => ({
      'Product Category': cat,
      'Catalog Share (%)': percent,
      'Total Products in Category': (products || []).filter(p => (p.category?.name || p.category) === cat).length
    }));
    exportToExcel(reportData, 'Inventory_Share_By_Category');
  };

  const revenueTrend = buildRevenueTrendFromOrders(orders || []);
  const orderStatusDistribution = buildOrderStatusDistribution(orders || []);
  const categoryDistribution = buildCategoryDistribution(products || []);
  const revenueMax = Math.max(1, ...revenueTrend.map(i => Number(i.revenue) || 0));
  const pieColors = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#14b8a6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹{(() => {
                const calculatedRevenue = calculateTotalRevenue(orders || []);
                return calculatedRevenue > 0 ? calculatedRevenue : (metrics.totalRevenue || 0);
              })().toLocaleString('en-IN')}</p>
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
              <p className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalOrders || 0}</p>
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
              <p className="text-2xl font-bold text-gray-800 mt-1">{metrics.totalCustomers || 0}</p>
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
              <p className="text-gray-600 text-sm">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹{Math.round(metrics.avgOrderValue || 0).toLocaleString('en-IN')}</p>
              <p className="text-gray-500 text-xs mt-2">Per order</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Last 6 months performance</p>
            </div>
            <button
              onClick={exportRevenueTrendReport}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          {revenueTrend.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No revenue data available</p>
            </div>
          ) : (
            <RevenueLineChart data={revenueTrend} maxValue={revenueMax} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Order Status Distribution</h3>
              <p className="text-sm text-gray-600">Current order pipeline</p>
            </div>
            <button
              onClick={exportStatusDistributionReport}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          <PieChart data={orderStatusDistribution} colors={pieColors} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Product Category Distribution</h3>
              <p className="text-sm text-gray-600">Products by category</p>
            </div>
            <button
              onClick={exportCategoryDistributionReport}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          {Object.keys(categoryDistribution).length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No category data available</p>
            </div>
          ) : (
            <PieChart data={categoryDistribution} colors={['#1e40af', '#ea580c', '#0d9488', '#a855f7', '#ef4444', '#14b8a6']} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Coupon Performance</h3>
              <p className="text-sm text-gray-600">Coupon usage statistics</p>
            </div>
            <button
              onClick={() => alert('Coupon statistics not available')}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {Object.keys(categoryDistribution).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Coupon system not yet implemented</p>
                <p className="text-sm mt-2">Coupon performance data will appear here once coupons are added</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Coupon system not yet implemented</p>
                <p className="text-sm mt-2">Coupon performance data will appear here once coupons are added</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Export Reports</h3>
        <p className="text-sm text-gray-600 mb-4">Download detailed reports in various formats</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Sales Report', action: exportSalesReport },
            { name: 'Customer Report', action: exportCustomerReport },
            { name: 'Inventory Report', action: exportInventoryReport },
            { name: 'Payment Report', action: exportPaymentReport },
            { name: 'Coupon Usage Report', action: () => alert('Coupon system data not yet available') },
            { name: 'Performance Report', action: exportAll }
          ].map((report) => (
            <button
              key={report.name}
              onClick={report.action}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition min-w-[120px]"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-sm text-gray-700 text-center">{report.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;

