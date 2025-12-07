import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../../store/slices/orderSlice';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const dispatch = useDispatch();

  if (!order) return null;

  const handlePaymentStatusChange = (e) => {
    // In a real app, this would update payment status
    console.log('Payment status changed to:', e.target.value);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order Details - ${order.id}`} size="lg">
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="text-gray-800 font-medium">{order.customer}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="text-gray-800 font-medium">{order.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Delivery Address:</span>
              <p className="text-gray-800 font-medium">
                Industrial Area, Raipur, CG - 492001
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">High Visibility Safety Vest</p>
                <p className="text-sm text-gray-600 mt-1">Variant: XL, Orange</p>
                <p className="text-sm text-gray-600">Quantity: 50</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 text-sm">Price per item</p>
                <p className="font-semibold text-gray-800">₹450</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-800">₹22,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-800">₹{order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charges:</span>
              <span className="font-semibold text-gray-800">₹0</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-lg font-bold text-green-600">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Update Payment Status */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Update Payment Status
          </label>
          <select
            defaultValue="completed"
            onChange={handlePaymentStatusChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Payment Method & Delivery Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-sm">
          <div>
            <span className="text-gray-600">Payment Method:</span>
            <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
          </div>
          {order.deliveryAgent && (
            <div>
              <span className="text-gray-600">Delivery Agent:</span>
              <p className="font-semibold text-gray-800">{order.deliveryAgent}</p>
            </div>
          )}
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

