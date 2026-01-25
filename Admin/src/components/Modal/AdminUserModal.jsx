import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createAdminUser, updateUserRole, updateUserStatus } from '../../store/slices/adminUserSlice';

const AdminUserModal = ({ isOpen, onClose, user = null, mode = 'add', onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.adminUsers);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't show password
        phone: user.phone || '',
        company: user.company || '',
        address: user.address || '',
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
        address: '',
        isActive: true,
      });
    }
  }, [user, mode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'edit' && user) {
      // For edit mode, we can update role and status separately
      // Note: Password update would need a separate endpoint
      try {
        if (formData.isActive !== user.isActive) {
          await dispatch(updateUserStatus({
            id: user._id || user.id,
            isActive: formData.isActive
          })).unwrap();
        }
        alert('User updated successfully');
        if (onSuccess) onSuccess();
        else onClose();
      } catch (error) {
        alert(error || 'Failed to update user');
      }
    } else {
      // Create new admin user
      if (!formData.password || formData.password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      }

      try {
        await dispatch(createAdminUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          role: 'admin',
          isActive: formData.isActive
        })).unwrap();
        alert('Admin user created successfully');
        if (onSuccess) onSuccess();
        else onClose();
      } catch (error) {
        alert(error || 'Failed to create admin user');
      }
    }
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="John Doe"
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
            placeholder="admin@shivamhosiery.com"
            disabled={mode === 'edit'}
          />
          {mode === 'edit' && (
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          )}
        </div>

        {mode === 'add' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
              placeholder="Minimum 6 characters"
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="+91 1234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            placeholder="Company name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
            rows={3}
            placeholder="Full address"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.isActive}
            onChange={(e) => setFormData({
              ...formData,
              isActive: e.target.checked,
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
            disabled={loading}
            className="flex-1 px-4 py-3 bg-[#1a1a2e] hover:bg-[#16213e] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (mode === 'edit' ? 'Update User' : 'Add Admin User')}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminUserModal;

