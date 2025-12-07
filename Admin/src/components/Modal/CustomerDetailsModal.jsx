import Modal from './Modal';

const CustomerDetailsModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  const avgOrderValue = customer.totalOrders > 0 
    ? Math.round(customer.totalSpent / customer.totalOrders) 
    : 0;

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
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {customer.status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-gray-600 text-sm">Total Orders</p>
            <p className="text-lg sm:text-xl font-bold text-gray-800">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Spent</p>
            <p className="text-lg sm:text-xl font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Avg Order Value</p>
            <p className="text-lg sm:text-xl font-bold text-green-600">₹{avgOrderValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Order History */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order History</h3>
          <div className="space-y-3">
            {/* Sample order - in real app, this would come from orders data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">ORD-001</span>
                <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-semibold">
                  delivered
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 text-gray-800">15/11/2024</span>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="ml-2 text-gray-800 font-semibold">₹22,500</span>
                </div>
                <div>
                  <span className="text-gray-600">Items:</span>
                  <span className="ml-2 text-gray-800">1 items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Handle block customer
              alert('Block customer functionality');
            }}
            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
          >
            Block Customer
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

