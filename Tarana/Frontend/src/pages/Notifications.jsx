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
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'promotion':
        return (
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2v2m0 0v5m0-5h2m-2 0h-2m4 0h2a2 2 0 012 2v3a2 2 0 01-2 2h-2m-4 0H8m4 0v-5m0 5H8m4 0h4" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-trana-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
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
              className="text-trana-primary hover:underline"
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
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${filter === type
                  ? 'bg-trana-primary text-white'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-600 text-lg">No notifications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id || notification.id}
                className={`bg-white rounded-lg shadow-md p-6 ${!notification.read ? 'border-l-4 border-trana-primary' : ''
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-trana-primary rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt || notification.date).toLocaleString()}
                    </p>
                    {notification.link && (
                      <Link
                        to={notification.link}
                        className="text-trana-primary hover:underline text-sm mt-2 inline-block"
                      >
                        View Details →
                      </Link>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id || notification.id)}
                        className="text-sm text-trana-primary hover:underline"
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
