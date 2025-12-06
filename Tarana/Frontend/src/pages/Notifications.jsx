import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../store/slices/notificationSlice';
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, isAuthenticated]);

  const handleMarkAsRead = async (id) => {
    const result = await dispatch(markAsRead(id));
    if (markAsRead.fulfilled.match(result)) {
      toast.success('Notification marked as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await dispatch(markAllAsRead());
    if (markAllAsRead.fulfilled.match(result)) {
      toast.success('All notifications marked as read');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this notification?');
    if (confirmed) {
      const result = await dispatch(deleteNotification(id));
      if (deleteNotification.fulfilled.match(result)) {
        toast.success('Notification deleted');
      } else {
        toast.error('Failed to delete notification');
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notif => notif.type === filter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-gray-600">Please login to view your notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-trana-orange hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          {['all', 'order', 'promotion', 'system'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                filter === type
                  ? 'bg-trana-orange text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-600 text-lg">No notifications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id || notification.id}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  !notification.read ? 'border-l-4 border-trana-orange' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-trana-orange rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt || notification.date).toLocaleString()}
                    </p>
                    {notification.link && (
                      <Link
                        to={notification.link}
                        className="text-trana-orange hover:underline text-sm mt-2 inline-block"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id || notification.id)}
                        className="text-sm text-trana-orange hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id || notification.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
