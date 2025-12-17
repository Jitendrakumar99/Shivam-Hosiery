import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateOrderStatus } from '../../store/slices/orderSlice';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const dispatch = useDispatch();
  const [deliveryAgentInput, setDeliveryAgentInput] = useState(order?.deliveryAgent || '');
  const [savingAgent, setSavingAgent] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'pending');
  const [savingPayment, setSavingPayment] = useState(false);

  if (!order) return null;

  const handleSavePaymentStatus = async () => {
    if (!order?._id && !order?.id) return;
    setSavingPayment(true);
    try {
      await dispatch(
        updateOrderStatus({
          id: order._id || order.id,
          status: order.status,
          paymentStatus,
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update payment status', err);
    } finally {
      setSavingPayment(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleSaveDeliveryAgent = async () => {
    if (!order?._id && !order?.id) return;
    setSavingAgent(true);
    try {
      await dispatch(
        updateOrderStatus({
          id: order._id || order.id,
          status: order.status,
          deliveryAgent: deliveryAgentInput.trim(),
        })
      ).unwrap();
    } catch (err) {
      console.error('Failed to update delivery agent', err);
    } finally {
      setSavingAgent(false);
    }
  };

  const displayId = (order._id || order.id || '').toString();
  const totalAmount = Number(order.totalAmount ?? order.total ?? 0);
  const shippingCost = Number(order.shippingCost ?? 0);
  const grandTotal = totalAmount + shippingCost;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Details - ${displayId}`} size="lg">
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
          <div className="space-y-2 bg-gray-50 rounded-lg p-4">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="text-gray-800 font-medium">{order.user?.name || order.shippingAddress?.name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="text-gray-800 font-medium">{order.user?.email || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">Delivery Address:</span>
              <p className="text-gray-800 font-medium">
                {[
                  order.shippingAddress?.address,
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.pincode,
                ].filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {(order.items || []).map((it, idx) => {
              const name = it.product?.name || 'Item';
              const qty = Number(it.quantity || 0);
              const price = Number(it.price || it.product?.price || 0);
              const itemSubtotal = price * qty;
              return (
                <div key={idx} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{name}</p>
                      <p className="text-sm text-gray-600">Quantity: {qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">Price per item</p>
                      <p className="font-semibold text-gray-800">₹{price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-800">₹{itemSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address with separate pincode */}
        {order.shippingAddress && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {order.shippingAddress.name && (
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
              )}
              {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
              {order.shippingAddress.address && <p>{order.shippingAddress.address}</p>}
              {(order.shippingAddress.city || order.shippingAddress.state) && (
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.city && order.shippingAddress.state && ', '}
                  {order.shippingAddress.state}
                </p>
              )}
              {order.shippingAddress.pincode && (
                <p>
                  <span className="font-semibold">Pincode: </span>
                  <span>{order.shippingAddress.pincode}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges:</span>
              <span className="font-semibold text-gray-800">
                ₹{shippingCost.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-green-600">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Update Payment Status */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Update Payment Status
          </label>
          <div className="flex flex-col gap-2">
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <button
              type="button"
              onClick={handleSavePaymentStatus}
              disabled={savingPayment}
              className="self-start px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingPayment ? 'Saving...' : 'Save Payment Status'}
            </button>
          </div>
        </div>

        {/* Payment Method & Delivery Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-sm">
          <div>
            <span className="text-gray-600">Payment Method:</span>
            <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
          </div>
          <div>
            <span className="text-gray-600">Delivery Agent:</span>
            <div className="mt-1 flex flex-col gap-2">
              <input
                type="text"
                value={deliveryAgentInput}
                onChange={(e) => setDeliveryAgentInput(e.target.value)}
                placeholder="Enter delivery / shipping partner name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm"
              />
              <button
                type="button"
                onClick={handleSaveDeliveryAgent}
                disabled={savingAgent}
                className="self-start px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingAgent ? 'Saving...' : 'Save Delivery Agent'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handlePrintInvoice}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;

