import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchZones, deleteZone } from '../store/slices/deliverySlice';
import DeliveryZoneModal from '../components/Modal/DeliveryZoneModal';

const Delivery = () => {
  const { zones, loading, error } = useSelector((state) => state.delivery);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    dispatch(fetchZones());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this zone?')) {
      dispatch(deleteZone(id));
    }
  };

  const handleAddZone = () => {
    setSelectedZone(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditZone = (zone) => {
    setSelectedZone(zone);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedZone(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Delivery & Logistics</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage delivery zones and charges</p>
        </div>
        <button
          onClick={handleAddZone}
          className="bg-[#1a1a2e] hover:bg-[#16213e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Zone</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600 text-sm">Loading delivery zones...</div>
      )}
      {error && !loading && (
        <div className="text-center py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {zones.map((zone) => (
          <div key={zone._id || zone.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate pr-2">{zone.name}</h3>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold capitalize flex-shrink-0">
                {zone.status}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">Pincodes Covered</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(zone.pincodes || []).slice(0, 3).map((pincode, index) => (
                    <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {pincode}
                    </span>
                  ))}
                  {zone.pincodes && zone.pincodes.length > 3 && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      +{zone.pincodes.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Delivery Charge</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">₹{zone.deliveryCharge}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm text-gray-600">Est. Days</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{zone.estimatedDays} days</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-4">
              <button
                onClick={() => handleEditZone(zone)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-xs sm:text-sm"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDelete(zone._id || zone.id)}
                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <DeliveryZoneModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        zone={selectedZone}
        mode={modalMode}
      />
    </div>
  );
};

export default Delivery;

