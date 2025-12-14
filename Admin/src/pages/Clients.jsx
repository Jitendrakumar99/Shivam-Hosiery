import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchClients, deleteClient } from '../store/slices/clientSlice';
import ClientModal from '../components/Modal/ClientModal';

const Clients = () => {
  const { clients, loading } = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch(deleteClient(id)).then(() => {
        dispatch(fetchClients());
      });
    }
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Client Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage clients displayed on Shivam Hosiery website</p>
        </div>
        <button
          onClick={handleAddClient}
          className="bg-[#1a1a2e] hover:bg-[#16213e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Client</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading clients...</p>
        </div>
      )}

      {!loading && clients.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No clients found. Add your first client!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {clients.map((client) => (
          <div key={client._id || client.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="h-40 sm:h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              {client.logo ? (
                <img src={client.logo} alt={client.name} className="w-full h-full max-w-full max-h-full object-contain object-center" />
              ) : (
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">{client.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{client.category}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClient(client)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs sm:text-sm"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client._id || client.id)}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
        mode={modalMode}
        onSuccess={() => {
          dispatch(fetchClients());
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default Clients;

