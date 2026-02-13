import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile, getMe, changePassword, addAddress, updateAddress, deleteAddress } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import api from '../services/api';

// Derived configuration for handling image URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.endsWith('/api') ? API_URL.replace(/\/api$/, '') : API_URL;
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL || BASE_URL;

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const defaultAddress = user?.addresses?.find?.((a) => a.isDefault) || (user?.addresses && user.addresses[0]) || null;
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [addressData, setAddressData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || defaultAddress?.address || '',
        company: user.company || ''
      });
    } else if (isAuthenticated) {
      dispatch(getMe());
    }
  }, [dispatch, isAuthenticated, user, defaultAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${UPLOAD_URL}${normalizedPath}`;
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;

      if (data.success) {
        const fullAvatarPath = `${UPLOAD_URL}${data.file.path}`;
        const result = await dispatch(updateProfile({ ...formData, avatar: fullAvatarPath }));
        if (updateProfile.fulfilled.match(result)) {
          toast.success('Profile picture updated!');
          setAvatarPreview(null);
        }
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error(result.payload || 'Failed to update profile');
    }
  };

  const handlePasswordSave = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));

    if (changePassword.fulfilled.match(result)) {
      toast.success('Password changed successfully!');
      setIsEditingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast.error(result.payload || 'Failed to change password');
    }
  };

  const handleAddAddress = async () => {
    if (!addressData.name || !addressData.phone || !addressData.address || !addressData.city || !addressData.state || !addressData.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    const result = await dispatch(addAddress(addressData));
    if (addAddress.fulfilled.match(result)) {
      toast.success('Address added successfully!');
      setIsAddingAddress(false);
      setAddressData({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    } else {
      toast.error(result.payload || 'Failed to add address');
    }
  };

  const handleUpdateAddress = async () => {
    if (!addressData.name || !addressData.phone || !addressData.address || !addressData.city || !addressData.state || !addressData.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    const result = await dispatch(updateAddress({ addressId: editingAddressId, addressData }));
    if (updateAddress.fulfilled.match(result)) {
      toast.success('Address updated successfully!');
      setEditingAddressId(null);
      setAddressData({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    } else {
      toast.error(result.payload || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Are you sure you want to delete this address?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const result = await dispatch(deleteAddress(addressId));
              if (deleteAddress.fulfilled.match(result)) {
                toast.success('Address deleted successfully');
              } else {
                toast.error(result.payload || 'Failed to delete address');
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  const startEditAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressData({
      name: address.name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      isDefault: address.isDefault || false
    });
  };

  const cancelEditAddress = () => {
    setEditingAddressId(null);
    setIsAddingAddress(false);
    setAddressData({
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-gray-600">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <h1 className="text-3xl font-bold">My Account</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="relative group">
                  <div className="w-16 h-16 bg-trana-primary rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {avatarPreview || user?.avatar ? (
                      <img src={avatarPreview || getAvatarUrl(user.avatar)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                    {uploading ? '...' : 'Edit'}
                  </label>
                </div>
                <div>
                  <h2 className="font-bold text-lg">{user?.name}</h2>
                  <p className="text-sm text-gray-600 truncate max-w-[150px]">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'profile'
                    ? 'bg-trana-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'password'
                    ? 'bg-trana-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Change Password
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'addresses'
                    ? 'bg-trana-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'notifications'
                    ? 'bg-trana-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'cards'
                    ? 'bg-trana-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Saved Cards
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            address: user?.address || defaultAddress?.address || '',
                            company: user?.company || ''
                          });
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        title="Email cannot be changed"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Company Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.company || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Change Password */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Change Password</h2>
                  {isEditingPassword && (
                    <button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {!isEditingPassword ? (
                  <div>
                    <p className="text-gray-600 mb-4">Click the button below to change your password.</p>
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmNewPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmNewPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handlePasswordSave}
                      disabled={loading}
                      className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  {!isAddingAddress && !editingAddressId && (
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Add New Address
                    </button>
                  )}
                </div>

                {(isAddingAddress || editingAddressId) && (
                  <div className="mb-8 p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={addressData.name}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={addressData.phone}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Address *</label>
                        <textarea
                          name="address"
                          value={addressData.address}
                          onChange={handleAddressChange}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={addressData.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={addressData.state}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={addressData.pincode}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressData.isDefault}
                            onChange={handleAddressChange}
                            className="w-4 h-4 text-trana-primary border-gray-300 rounded focus:ring-trana-primary"
                          />
                          <span className="text-sm text-gray-700">Set as default address</span>
                        </label>
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <button
                          onClick={cancelEditAddress}
                          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={editingAddressId ? handleUpdateAddress : handleAddAddress}
                          disabled={loading}
                          className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {user?.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address) => (
                      <div key={address._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {address.isDefault && (
                              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-2">
                                DEFAULT
                              </span>
                            )}
                            <h3 className="font-bold text-lg mb-2">{address.name}</h3>
                            <p className="text-gray-600 mb-1">{address.phone}</p>
                            <p className="text-gray-600 mb-1">{address.address}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditAddress(address)}
                              className="text-trana-primary hover:text-green-700 px-3 py-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-red-600 hover:text-red-700 px-3 py-1"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No addresses saved yet.</p>
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="bg-trana-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive order updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-trana-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-trana-orange"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-trana-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-trana-orange"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Promotional Emails</h3>
                      <p className="text-sm text-gray-600">Receive offers and promotions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-trana-orange rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-trana-orange"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Cards */}
            {activeTab === 'cards' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Saved Cards</h2>
                  <button className="bg-trana-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                    Add New Card
                  </button>
                </div>
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No saved cards yet.</p>
                  <p className="text-sm text-gray-500">Add a card for faster checkout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
