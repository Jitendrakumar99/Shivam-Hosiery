import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchAdminUsers, updateUserRole, updateUserStatus, deleteUser } from '../store/slices/adminUserSlice';
import AdminUserModal from '../components/Modal/AdminUserModal';

const AdminUsers = () => {
  const { adminUsers, loading } = useSelector((state) => state.adminUsers);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap();
      alert(`User role updated to ${newRole}`);
      dispatch(fetchAdminUsers()); // Refresh the list
    } catch (error) {
      alert(error || 'Failed to update user role');
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      await dispatch(updateUserStatus({ id: userId, isActive })).unwrap();
      alert(`User status updated`);
      dispatch(fetchAdminUsers()); // Refresh the list
    } catch (error) {
      alert(error || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (user) => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    if (!window.confirm(`Delete admin user "${user.name || user.email}"? This cannot be undone.`)) return;

    try {
      await dispatch(deleteUser(userId)).unwrap();
      alert('User deleted successfully');
      dispatch(fetchAdminUsers());
    } catch (error) {
      alert(error || 'Failed to delete user');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Users</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage admin users and their roles</p>
        </div>
        <button
          onClick={handleAddUser}
          className="bg-[#1a1a2e] hover:bg-[#16213e] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Admin User</span>
          <span className="sm:hidden">Add User</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading admin users...</p>
        </div>
      )}

      {!loading && adminUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No admin users found. Add your first admin user!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {adminUsers.map((user) => (
          <div key={user._id || user.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{user.name || 'N/A'}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate px-2">{user.email}</p>
              {user.phone && (
                <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 flex-wrap">
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                {user.role || 'admin'}
              </span>
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(user.isActive)}`}>
                {getStatusText(user.isActive)}
              </span>
            </div>
            <div className="space-y-2 mb-3 sm:mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={user.role || 'admin'}
                  onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={user.isActive ? 'active' : 'inactive'}
                  onChange={(e) => handleStatusChange(user._id || user.id, e.target.value === 'active')}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditUser(user)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex-1 text-xs sm:text-sm"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete user"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        mode={modalMode}
        onSuccess={() => {
          dispatch(fetchAdminUsers());
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default AdminUsers;

