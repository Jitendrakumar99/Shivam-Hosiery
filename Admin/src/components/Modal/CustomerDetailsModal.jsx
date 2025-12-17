import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateCustomerStatus, updateCustomerRole } from '../../store/slices/customerSlice';

const CustomerDetailsModal = ({ isOpen, onClose, customer, orders = [] }) => {
  if (!customer) return null;

  // Filter orders for this customer
  const customerId = customer._id || customer.id;
  const dispatch = useDispatch();
  const [localRole, setLocalRole] = useState(customer.role || 'user');
  const [localIsActive, setLocalIsActive] = useState(customer.isActive !== false);
  const customerOrders = orders.filter((order) => {
    const orderUserId =
      order.user?._id?.toString() ||
      order.user?._id ||
      order.user?.id ||
      order.user?.toString();
    return orderUserId && orderUserId.toString() === customerId?.toString();
  });

  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || order.total || 0),
    0
  );

  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" size="md">
      <div className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="text-gray-800 font-medium">{customer.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="text-gray-800 font-medium">{customer.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="text-gray-800 font-medium">{customer.phone}</p>
            </div>
            {customer.address && (
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="text-gray-800 font-medium">{customer.address}</p>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {localIsActive === false ? 'Inactive' : 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Role</label>
                <select
                  value={localRole}
                  onChange={(e) => setLocalRole(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  onClick={() => dispatch(updateCustomerRole({ id: customerId, role: localRole }))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                >
                  Save Role
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">{totalOrders}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Spent</p>
            <p className="text-lg sm:text-xl font-bold text-green-600">
              ₹{totalSpent.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Avg Order Value</p>
            <p className="text-lg sm:text-xl font-bold text-green-600">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order History</h3>
          <div className="space-y-3">
            {customerOrders.length === 0 && (
              <p className="text-sm text-gray-600">No orders found for this customer.</p>
            )}
            {customerOrders.slice(0, 3).map((order) => (
              <div key={order._id || order.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {(order._id || order.id || '').toString().slice(-8).toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold capitalize">
                    {order.status || 'unknown'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 text-gray-800">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 text-gray-800 font-semibold">
                      ₹{(order.totalAmount || order.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Items:</span>
                    <span className="ml-2 text-gray-800">
                      {order.items?.length || 0} items
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              const next = !localIsActive;
              setLocalIsActive(next);
              dispatch(updateCustomerStatus({ id: customerId, isActive: next }));
            }}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${localIsActive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {localIsActive ? 'Block Customer' : 'Unblock Customer'}
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

export default CustomerDetailsModal;

