import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import CustomerDetailsModal from '../components/Modal/CustomerDetailsModal';

const Customers = () => {
  const { customers } = useSelector((state) => state.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate pr-2">{customer.name}</h3>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex-shrink-0">
                {customer.status}
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
                <span className="font-semibold">Joined:</span> {customer.joined}
              </p>
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-gray-600 text-xs">Total Orders</p>
                  <p className="font-semibold text-gray-800">{customer.totalOrders}</p>
                </div>
                {customer.totalSpent > 0 && (
                  <div className="text-right">
                    <p className="text-gray-600 text-xs">Total Spent</p>
                    <p className="font-semibold text-green-600 text-sm">₹{customer.totalSpent.toLocaleString()}</p>
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
              <button className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
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
      />
    </div>
  );
};

export default Customers;

