import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { createZone, updateZone } from '../../store/slices/deliverySlice';

const DeliveryZoneModal = ({ isOpen, onClose, zone = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    pincodes: '',
    deliveryCharge: '0',
    estimatedDays: '1',
    status: 'active',
  });

  useEffect(() => {
    if (zone && mode === 'edit') {
      setFormData({
        name: zone.name || '',
        pincodes: Array.isArray(zone.pincodes) ? zone.pincodes.join(', ') : '',
        deliveryCharge: zone.deliveryCharge?.toString() || '0',
        estimatedDays: zone.estimatedDays?.toString() || '1',
        status: zone.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        pincodes: '492001, 492002, 492003',
        deliveryCharge: '0',
        estimatedDays: '1',
        status: 'active',
      });
    }
  }, [zone, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const zoneData = {
      ...formData,
      pincodes: formData.pincodes.split(',').map(p => p.trim()).filter(p => p),
      deliveryCharge: parseInt(formData.deliveryCharge) || 0,
      estimatedDays: parseInt(formData.estimatedDays) || 1,
    };

    try {
      if (mode === 'edit' && zone) {
        await dispatch(updateZone({
          id: zone._id || zone.id,
          zoneData,
        })).unwrap();
      } else {
        await dispatch(createZone(zoneData)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Failed to save delivery zone', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Zone Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="Enter zone name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pincodes (comma separated) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.pincodes}
            onChange={(e) => setFormData({ ...formData, pincodes: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="492001, 492002, 492003"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Charge (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.deliveryCharge}
              onChange={(e) => setFormData({ ...formData, deliveryCharge: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Days <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.estimatedDays}
              onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
              placeholder="1"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.status === 'active'}
            onChange={(e) => setFormData({
              ...formData,
              status: e.target.checked ? 'active' : 'inactive',
            })}
            className="w-4 h-4 text-[#1a1a2e] border-gray-300 rounded focus:ring-[#1a1a2e]"
          />
          <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
            Active
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition"
          >
            {mode === 'edit' ? 'Update Zone' : 'Add Zone'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeliveryZoneModal;

