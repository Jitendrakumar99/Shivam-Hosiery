import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { addAdminUser, updateAdminUser } from '../../store/slices/adminUserSlice';

const AdminUserModal = ({ isOpen, onClose, user = null, mode = 'add' }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Customer Support',
    permissions: '',
    status: 'Active',
  });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.role || '',
        email: user.email || '',
        role: user.role || 'Customer Support',
        permissions: Array.isArray(user.permissions) ? user.permissions.join(', ') : (user.permissions === 'all' ? 'all' : ''),
        status: user.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Customer Support',
        permissions: 'products, orders, customers',
        status: 'Active',
      });
    }
  }, [user, mode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      permissions: formData.permissions === 'all' ? ['all'] : formData.permissions.split(',').map(p => p.trim()).filter(p => p),
      roleTag: formData.role.toLowerCase().replace(/\s+/g, ''),
    };

    if (mode === 'edit' && user) {
      dispatch(updateAdminUser({
        id: user.id,
        ...userData,
      }));
    } else {
      dispatch(addAdminUser({
        id: Date.now(),
        ...userData,
      }));
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit Admin User' : 'Add New Admin User'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value, role: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="Customer Support"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="support@shivamhosiery.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Order Manager">Order Manager</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Permissions (comma separated) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.permissions}
            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="orders, customers, reviews"
          />
          <p className="text-xs text-gray-500 mt-1">Enter 'all' for full access, or comma-separated permissions</p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.status === 'Active'}
            onChange={(e) => setFormData({
              ...formData,
              status: e.target.checked ? 'Active' : 'Inactive',
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
            {mode === 'edit' ? 'Update User' : 'Add User'}
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

export default AdminUserModal;

