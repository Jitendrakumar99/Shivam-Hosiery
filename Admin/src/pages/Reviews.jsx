import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, updateReviewStatus, deleteReview, replyToReview } from '../store/slices/reviewSlice';

const Reviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.reviews);
  const [activeTab, setActiveTab] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === 'all') return true;
    return review.status === activeTab;
  });

  const handleStatusUpdate = (id, status) => {
    dispatch(updateReviewStatus({ id, status }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(id));
    }
  };

  const handleReplySubmit = (id) => {
    if (!replyText.trim()) return;
    dispatch(replyToReview({ id, message: replyText }));
    setReplyText('');
    setReplyingTo(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Review Management</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage customer reviews.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {['all', 'pending', 'approved', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab
                ? 'bg-[#1a1a2e] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-[#1a1a2e] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow border border-gray-200">
            <svg
              className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-gray-500 text-base sm:text-lg">No reviews found.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review._id || review.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6 transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm sm:text-base">
                        {review.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">
                          Verified Purchase: {review.verifiedPurchase ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${review.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : review.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {review.status}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center gap-1">{renderStars(review.rating)}</div>

                  <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{review.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3">{review.comment}</p>

                  {/* Product Info */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg mb-3 sm:mb-4">
                    {review.product?.images?.[0] || review.product?.image ? (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={review.product?.images?.[0] || review.product?.image}
                          alt={review.product?.name || review.product?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-800">
                        Product: {review.product?.name || review.product?.title || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>

                  {/* Admin Reply */}
                  {review.adminReply && (
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 border border-blue-100">
                      <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">Response from Store:</p>
                      <p className="text-xs sm:text-sm text-blue-700">{review.adminReply.message}</p>
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === (review._id || review.id) && !review.adminReply && (
                    <div className="mt-3 sm:mt-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] resize-none text-sm"
                        placeholder="Write your reply..."
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReplySubmit(review._id || review.id)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1a1a2e] text-white rounded-lg text-xs sm:text-sm hover:bg-[#16213e]"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4 justify-end sm:justify-start">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(review._id || review.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip-wrapper relative group"
                        title="Approve"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(review._id || review.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Reject"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <button
                      onClick={() => handleStatusUpdate(review._id || review.id, 'rejected')}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                      title="Reject (Hide)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  )}
                  {review.status === 'rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(review._id || review.id, 'approved')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Approve (Restore)"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}

                  {!review.adminReply && (
                    <button
                      onClick={() => setReplyingTo(review._id || review.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Reply"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review._id || review.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
