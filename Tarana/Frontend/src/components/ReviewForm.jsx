import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createReview, updateReview } from '../store/slices/reviewSlice';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, onSuccess, initialData = null }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 5,
    title: initialData?.title || '',
    comment: initialData?.comment || '',
    images: initialData?.images || []
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a review title');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Please enter your review');
      return;
    }

    setSubmitting(true);

    try {
      let result;
      if (initialData?._id) {
        // Update existing review
        result = await dispatch(updateReview({
          id: initialData._id,
          reviewData: formData
        }));
      } else {
        // Create new review
        result = await dispatch(createReview({
          productId,
          ...formData
        }));
      }

      if (createReview.fulfilled.match(result) || (initialData && updateReview.fulfilled.match(result))) {
        toast.success(initialData ? 'Review updated successfully!' : 'Review submitted successfully! It will be visible after approval.');
        if (!initialData) {
          setFormData({
            rating: 5,
            title: '',
            comment: '',
            images: []
          });
        }
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.payload || `Failed to ${initialData ? 'update' : 'submit'} review`);
      }
    } catch (error) {
      toast.error(`Failed to ${initialData ? 'update' : 'submit'} review`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Your Rating *</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className={`w-8 h-8 ${star <= (hoveredRating || formData.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Review Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Sum up your experience"
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary"
            required
          />
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-semibold mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Share your experience with this product"
            rows={5}
            maxLength={1000}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trana-primary resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !isAuthenticated}
          className="w-full bg-trana-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>

        {!isAuthenticated && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            Please login to submit a review
          </p>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
