import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemoveFromWishlist = async (productId) => {
    const result = await dispatch(removeFromWishlist(productId));
    if (removeFromWishlist.fulfilled.match(result)) {
      toast.success('Removed from wishlist');
      // Refresh wishlist to show remaining items
      dispatch(fetchWishlist());
    } else {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    if (product.variants && product.variants.length > 0) {
      navigate(`/products/${product._id || product.id}`);
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title || product.name} added to cart!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-center text-gray-600">Please login to view your wishlist.</p>
        </div>
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <p className="text-gray-600 text-lg mb-4">Your wishlist is empty</p>
            <Link
              to="/products"
              className="inline-block bg-trana-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const product = item.product;

              // If product is null, it means it's been deleted or is unavailable
              if (!product) {
                return (
                  <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">Product no longer available</p>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="text-red-600 hover:text-red-800 font-medium underline"
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                );
              }

              const inStock = product.availability?.inStock !== false;
              const hasVariants = product.variants && product.variants.length > 0;

              return (
                <div key={item._id || product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-500 flex flex-col items-center">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{product.name || product.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-trana-primary">₹{product.pricing?.price || product.price || 0}</span>
                      {inStock ? (
                        <span className="text-sm text-green-600 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!inStock}
                        className={`flex-1 ${hasVariants ? 'bg-[#1a1a2e] hover:bg-[#16213e]' : 'bg-trana-primary hover:bg-green-700'} text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {hasVariants ? 'View Options' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                        title="Remove from wishlist"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
