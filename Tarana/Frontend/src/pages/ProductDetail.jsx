import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProduct, fetchProducts } from '../store/slices/productSlice';
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

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

  // Fetch related products when product is loaded
  useEffect(() => {
    if (product && product.category) {
      setLoadingRelated(true);
      dispatch(fetchProducts({ category: product.category, limit: 4 }))
        .then((result) => {
          if (fetchProducts.fulfilled.match(result)) {
            // Filter out the current product from related products
            const related = result.payload.data.filter(
              (p) => (p._id || p.id) !== (product._id || product.id)
            );
            setRelatedProducts(related.slice(0, 4));
          }
        })
        .finally(() => {
          setLoadingRelated(false);
        });
    }
  }, [dispatch, product]);

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
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
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
                          <svg className="w-5 h-5 text-trana-orange mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-trana-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
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
                  {inWishlist ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
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
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            {loadingRelated ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
                <p className="text-gray-600">Loading related products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct._id || relatedProduct.id}
                    to={`/products/${relatedProduct._id || relatedProduct.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No Image</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{relatedProduct.category}</p>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-trana-orange font-bold">₹{relatedProduct.price}</p>
                        {relatedProduct.stock > 0 ? (
                          <span className="text-xs text-green-600">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-6">
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
              >
                View All Products in {product.category}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

