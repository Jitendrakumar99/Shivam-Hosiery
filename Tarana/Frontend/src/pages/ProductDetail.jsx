import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProduct } from '../store/slices/productSlice';
import { addToWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Check if product is in cart
  const isInCart = (product) => {
    if (!product) return false;
    const productId = String(product._id || product.id);
    return cartItems.some(item => {
      const itemProductId = String(item.product._id || item.product.id);
      return itemProductId === productId;
    });
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!wishlist || !wishlist.items || !productId) return false;
    const id = String(productId._id || productId.id || productId);
    return wishlist.items.some(item => {
      const itemProductId = String(item.product?._id || item.product?.id);
      return itemProductId === id;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (isInCart(product)) {
      dispatch(removeFromCart(product._id || product.id));
      toast.success(`${product.name} removed from cart!`);
    } else {
      dispatch(addToCart({ product, quantity }));
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    if (isInWishlist(product._id || product.id)) {
      toast.info('Product is already in your wishlist');
      return;
    }

    const result = await dispatch(addToWishlist(product._id || product.id));
    if (addToWishlist.fulfilled.match(result)) {
      toast.success(`${product.name} added to wishlist!`);
      dispatch(fetchWishlist());
    } else {
      const errorMsg = result.payload || 'Failed to add to wishlist';
      if (errorMsg.includes('already in wishlist')) {
        toast.info('Product is already in your wishlist');
        dispatch(fetchWishlist());
      } else {
        toast.error(errorMsg);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link
              to="/products"
              className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const inCart = isInCart(product);
  const inWishlist = isInWishlist(product._id || product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f54a00;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d43d00;
        }
        #main-product-image {
          transition: transform 0.3s ease;
          cursor: zoom-in;
        }
        #main-product-image:hover {
          transform: scale(1.1);
        }
        @media (max-width: 1024px) {
          .custom-scrollbar {
            display: none;
          }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-trana-orange">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-trana-orange">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images - Flipkart Style */}
            <div>
              <div className="flex gap-4">
                {/* Thumbnail Images - Left Side */}
                {images.length > 1 && (
                  <div className="flex-shrink-0">
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === idx
                              ? 'border-trana-orange scale-105'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Image Display */}
                <div className="flex-1">
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[selectedImage]}
                          alt={product.name}
                          className="w-full h-full object-contain p-4"
                          id="main-product-image"
                        />
                        {/* Zoom effect on hover */}
                        <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Image Navigation for Mobile */}
                  {images.length > 1 && (
                    <div className="flex items-center justify-center gap-2 lg:hidden">
                      <button
                        onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                        disabled={selectedImage === 0}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="flex gap-1">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`w-2 h-2 rounded-full transition ${
                              selectedImage === idx ? 'bg-trana-orange w-6' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                        disabled={selectedImage === images.length - 1}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="text-center text-sm text-gray-600 mt-2">
                      Image {selectedImage + 1} of {images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-trana-orange">₹{product.price}</span>
                  {product.stock > 0 ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">Key Features:</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-trana-orange mr-2">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), product.stock));
                    }}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600">Max: {product.stock}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {inCart ? (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <span>🗑️</span>
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-trana-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>🛒</span>
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={handleAddToWishlist}
                  className={`px-6 py-3 border-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    inWishlist
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-trana-orange text-trana-orange hover:bg-orange-50'
                  }`}
                >
                  <span>{inWishlist ? '✓' : '❤️'}</span>
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">SKU:</span>
                    <span className="ml-2 text-gray-600">{product._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">{product.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Stock:</span>
                    <span className="ml-2 text-gray-600">{product.stock} units</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Price:</span>
                    <span className="ml-2 text-gray-600">₹{product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">Browse more products in this category</p>
            <Link
              to="/products"
              className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

