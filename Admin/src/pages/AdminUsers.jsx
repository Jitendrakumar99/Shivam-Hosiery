import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { deleteAdminUser } from '../store/slices/adminUserSlice';
import AdminUserModal from '../components/Modal/AdminUserModal';

const AdminUsers = () => {
  const { adminUsers } = useSelector((state) => state.adminUsers);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      dispatch(deleteAdminUser(id));
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

  const getRoleColor = (roleTag) => {
    switch (roleTag) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'inventory': return 'bg-orange-100 text-orange-800';
      case 'support': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Users & Roles</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage admin users and their permissions</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {adminUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{user.role}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate px-2">{user.email}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 flex-wrap">
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${getRoleColor(user.roleTag)}`}>
                {user.roleTag}
              </span>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {user.status}
              </span>
            </div>
            <div className="mb-3 sm:mb-4">
              <p className="text-xs text-gray-600 mb-2 text-center px-2 line-clamp-2">
                Permissions: {user.permissions.includes('all') ? 'all' : user.permissions.join(', ')}
              </p>
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
                onClick={() => handleDelete(user.id)}
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

      <AdminUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminUsers;

