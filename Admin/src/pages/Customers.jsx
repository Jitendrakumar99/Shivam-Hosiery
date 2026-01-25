import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchCustomers, deleteCustomer } from '../store/slices/customerSlice';
import { fetchOrders } from '../store/slices/orderSlice';
import CustomerDetailsModal from '../components/Modal/CustomerDetailsModal';

const Customers = () => {
  const { customers, loading } = useSelector((state) => state.customers);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
    // Load orders once so we can show basic stats in the customer details view
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredCustomers = customers.filter(customer => {
    const name = (customer.name || '').toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const phone = (customer.phone || '').toString();
    return name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
  });

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async (customer) => {
    const id = customer?._id || customer?.id;
    if (!id) return;
    if (!window.confirm(`Delete customer "${customer.name || customer.email}"? This cannot be undone.`)) return;

    try {
      await dispatch(deleteCustomer(id)).unwrap();
      alert('Customer deleted successfully');
      dispatch(fetchCustomers());
    } catch (err) {
      alert(err || 'Failed to delete customer');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Customer Management</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage customer accounts</p>
      </div>

      <div className="relative">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] text-sm sm:text-base"
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading customers...</p>
        </div>
      )}

      {!loading && filteredCustomers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No customers found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer._id || customer.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate pr-2">{customer.name}</h3>
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                customer.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {customer.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <p className="text-gray-600 truncate">
                <span className="font-semibold">Email:</span> <span className="truncate block sm:inline">{customer.email}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span> {customer.phone}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Joined:</span> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : customer.joined || 'N/A'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-gray-600 text-xs">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{customer.role || 'user'}</p>
                </div>
                {customer.company && (
                  <div className="text-right">
                    <p className="text-gray-600 text-xs">Company</p>
                    <p className="font-semibold text-gray-800 text-sm truncate">{customer.company}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button
                onClick={() => handleViewCustomer(customer)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs sm:text-sm"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCustomer(customer)}
                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete customer"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={selectedCustomer}
        // Pass all orders so the modal can calculate stats for this customer
        orders={orders}
      />
    </div>
  );
};

export default Customers;

