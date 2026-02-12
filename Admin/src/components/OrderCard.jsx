import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateOrderStatus, fetchOrders } from '../store/slices/orderSlice';
import { fetchStats } from '../store/slices/reportSlice';
import InvoiceTemplate from './Invoice/InvoiceTemplate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || API_URL.replace('/api', '/uploads');
//order page 
const OrderCard = ({ order }) => {
    const dispatch = useDispatch();
    const [deliveryAgentName, setDeliveryAgentName] = useState(order?.deliveryAgent || '');
    const [trackingId, setTrackingId] = useState(order?.trackingNumber || '');
    const [savingAgent, setSavingAgent] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'pending');
    const [savingPaymentStatus, setSavingPaymentStatus] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('standard');

    // Sync local state when order prop updates
    useEffect(() => {
        if (order) {
            setDeliveryAgentName(order.deliveryAgent || '');
            setTrackingId(order.trackingNumber || '');
            setPaymentStatus(order.paymentStatus || 'pending');

            // Load selected template
            const savedTemplate = localStorage.getItem('invoiceTemplate');
            if (savedTemplate) {
                setSelectedTemplate(savedTemplate);
            }
        }
    }, [order]);

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

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await dispatch(updateOrderStatus({
                id: order._id || order.id,
                status: newStatus,
                paymentStatus: order.paymentStatus // Preserve payment status
            })).unwrap();

            // Refresh orders list and stats
            await dispatch(fetchOrders());

            if (newStatus === 'delivered' || newStatus === 'shipped') {
                await dispatch(fetchStats());
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    };

    const handlePaymentStatusChange = async (e) => {
        
        const newPaymentStatus = e.target.value;
        const previousPaymentStatus = paymentStatus;
        setPaymentStatus(newPaymentStatus);

        if (!order?._id && !order?.id) return;

        setSavingPaymentStatus(true);
        try {
            await dispatch(
                updateOrderStatus({
                    id: order._id || order.id,
                    status: order.status, // Keep existing status
                    paymentStatus: newPaymentStatus,
                    trackingNumber: trackingId,
                    deliveryAgent: deliveryAgentName
                })
            ).unwrap();

            await dispatch(fetchOrders());
            await dispatch(fetchStats());
        } catch (err) {
            console.error('Failed to update payment status', err);
            alert('Failed to update payment status. Please try again.');
            setPaymentStatus(previousPaymentStatus);
        } finally {
            setSavingPaymentStatus(false);
        }
    };

    const handleSaveDeliveryAgent = async () => {
        if (!order?._id && !order?.id) return;
        setSavingAgent(true);
        try {
            await dispatch(
                updateOrderStatus({
                    id: order._id || order.id,
                    status: order.status,
                    deliveryAgent: deliveryAgentName.trim(),
                    trackingNumber: trackingId.trim()
                })
            ).unwrap();
            await dispatch(fetchOrders());
        } catch (err) {
            console.error('Failed to update delivery agent', err);
        } finally {
            setSavingAgent(false);
        }
    };

    const copyTrackingId = () => {
        if (trackingId) {
            navigator.clipboard.writeText(trackingId);
            // Optional: You could add a toast here if you have a toast library
        }
    };

    const handlePrintInvoice = () => {
        const invoiceEl = document.getElementById(`invoice-print-${order._id}`);
        if (invoiceEl) {
            invoiceEl.classList.add('printing-now');
            // Small timeout to ensure the DOM is ready for the browser print engine
            setTimeout(() => {
                window.print();
                invoiceEl.classList.remove('printing-now');
            }, 50);
        } else {
            window.print();
        }
    };

    const totalAmount = Number(order.totalAmount ?? order.total ?? 0);
    const shippingCost = Number(order.shippingCost ?? 0);
    const grandTotal = totalAmount + shippingCost;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-gray-800">#{(order._id || order.id)?.slice(-8)}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold tracking-wider ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                            {getPaymentStatusText(order.paymentStatus || 'pending')}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handlePrintInvoice}
                    className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-xs font-medium transition shadow-sm"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Invoice
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Main Content: Items (Takes up 7 columns for better balance) */}
                <div className="lg:col-span-7 p-3 border-b lg:border-b-0 lg:border-r border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Items ({order.items?.length || 0})</h4>
                    <div className="space-y-2">
                        {(order.items || []).map((it, idx) => {
                            const name = it.product?.title || it.product?.name || 'Item';
                            const qty = Number(it.quantity || 0);
                            const price = Number(it.price || it.product?.price || 0);
                            const itemSubtotal = price * qty;

                            // Robust image resolution with multiple fallbacks
                            let imagePath = '';
                            if (it.product?.images && Array.isArray(it.product.images) && it.product.images.length > 0) {
                                imagePath = it.product.images[0];
                            } else if (it.product?.featuredImage) {
                                imagePath = it.product.featuredImage;
                            } else if (it.product?.image) {
                                imagePath = it.product.image;
                            } else if (typeof it.product?.images === 'string') {
                                imagePath = it.product.images;
                            }

                            if (imagePath && !imagePath.startsWith('http')) {
                                if (imagePath.startsWith('/')) imagePath = imagePath.substring(1);
                                imagePath = `${UPLOAD_URL.endsWith('/') ? UPLOAD_URL : UPLOAD_URL + '/'}${imagePath.replace(/\\/g, '/')}`;
                            } else if (!imagePath) {
                                imagePath = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f3f4f6" width="80" height="80"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }

                            return (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50/50 rounded border border-gray-100 hover:border-gray-200 transition">
                                    <div className="w-12 h-12 flex-shrink-0 bg-white rounded border border-gray-200 overflow-hidden">
                                        <img
                                            src={imagePath}
                                            alt={name}
                                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                                            onClick={() => setExpandedImage(imagePath)}
                                            onError={(e) => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23fee2e2" width="80" height="80"/%3E%3Ctext fill="%23dc2626" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage Error%3C/text%3E%3C/svg%3E'; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900 text-md truncate">{name}</p>
                                                {(it.product?.sku || it.sku) && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-mono font-semibold rounded">
                                                        SKU: {it.sku || it.product?.sku}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-md text-gray-900 mt-0.5">
                                                <span className="font-medium">Qty: {qty}</span>
                                                <span>×</span>
                                                <span>₹{price.toLocaleString('en-IN')}</span>
                                                {it.customization && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="truncate text-gray-600">
                                                            {Object.entries(it.customization).map(([key, value]) => value && `${key}: ${value}`).filter(Boolean).join(', ')}
                                                        </span>
                                                    </>
                                                )}
                                                {it.variantSKU && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs font-mono text-gray-500">
                                                            V-SKU: {it.variantSKU}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900 text-md whitespace-nowrap">₹{itemSubtotal.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="space-y-1.5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Customer Details</h4>
                        <div className="bg-white p-2.5 rounded border border-gray-200 shadow-sm">
                            <p className="font-semibold text-gray-900 text-sm"><span className="text-gray-900 text-xs">Name:-</span>{order.user?.name || order.shippingAddress?.name || 'N/A'}</p>
                            <p className="font-semibold text-gray-900 text-sm"><span className="text-gray-900 text-xs">Email:-</span>{order.user?.email}</p>
                            {order.shippingAddress && (
                                <p className="text-gray-600 text-xs leading-relaxed mt-1.5 pt-1.5 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Shipping Address</h4>
                                    {[
                                        order.shippingAddress.address,
                                        order.shippingAddress.city,
                                        order.shippingAddress.state,
                                        order.shippingAddress.pincode
                                    ].filter(Boolean).join(', ')}
                                    {order.shippingAddress.phone && <span className="block mt-1 font-medium text-gray-700 text-xs">📞 {order.shippingAddress.phone}</span>}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer, Management, Summary (Takes up 5 columns for better spacing) */}
                <div className="lg:col-span-5 bg-gray-50/30 p-3 space-y-4 flex flex-col h-full">
                    {/* Customer Info */}


                    {/* Order Management */}
                    <div className="space-y-2.5 flex-1">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Order Management</h4>
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
                                <select
                                    value={order.status || 'pending'}
                                    onChange={handleStatusChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Payment</label>
                                <select
                                    value={paymentStatus}
                                    onChange={handlePaymentStatusChange}
                                    disabled={savingPaymentStatus}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-white p-2.5 rounded border border-gray-200">
                            <label className="text-sm font-medium text-gray-700 block mb-1.5">Delivery Details</label>
                            <input
                                type="text"
                                value={deliveryAgentName}
                                onChange={(e) => setDeliveryAgentName(e.target.value)}
                                placeholder="Delivery Agent Name"
                                className="w-full px-2.5 py-1.5 mb-1.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                            />
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                        placeholder="Tracking ID"
                                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 focus:bg-white pr-8 transition-colors"
                                    />
                                    <button
                                        onClick={copyTrackingId}
                                        title="Copy Tracking ID"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveDeliveryAgent}
                                    disabled={savingAgent}
                                    className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-sm font-semibold whitespace-nowrap shadow-sm transition-colors"
                                >
                                    {savingAgent ? '...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    {/* Financial Summary */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Subtotal</span>
                            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-700">
                            <span>Shipping</span>
                            <span>₹{shippingCost.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 pt-1.5 border-t border-gray-200 mt-1">
                            <span>Total</span>
                            <span className="text-green-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1 font-medium">
                            Paid via {order.paymentMethod}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button
                            onClick={() => setExpandedImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={expandedImage}
                            alt="Expanded Product"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
            {/* Hidden Invoice for Printing */}
            <div className="hidden print:block">
                <InvoiceTemplate order={order} templateId={selectedTemplate} />
            </div>
        </div>
    );
};

export default OrderCard;
