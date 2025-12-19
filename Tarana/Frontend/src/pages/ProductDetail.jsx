import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProduct, fetchProducts } from '../store/slices/productSlice';
import { addToWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductReviews } from '../store/slices/reviewSlice';
import ReviewForm from '../components/ReviewForm';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.products);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { reviews, loading: reviewsLoading } = useAppSelector((state) => state.reviews);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(fetchProductReviews({ productId: id, params: { status: 'approved' } }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Set default variant when product loads
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedSize(firstVariant.size);
      setSelectedColor(firstVariant.color || '');
    }
  }, [product]);

  // Fetch related products
  useEffect(() => {
    if (product && product.category) {
      const categoryName = product.category?.name || product.category;
      dispatch(fetchProducts({ category: categoryName, limit: 4 }))
        .then((result) => {
          if (fetchProducts.fulfilled.match(result)) {
            const related = result.payload.data.filter(
              (p) => (p._id || p.id) !== (product._id || product.id)
            );
            setRelatedProducts(related.slice(0, 4));
          }
        });
    }
  }, [dispatch, product]);

  // Handle variant selection
  const handleVariantChange = (size, color) => {
    // Try to find exact match
    let variant = product.variants.find(
      v => v.size === size && (color ? v.color === color : true)
    );

    // If no exact match (e.g. size changed but old color not available for new size),
    // pick the first variant with the new size
    if (!variant) {
      variant = product.variants.find(v => v.size === size);
    }

    if (variant) {
      setSelectedVariant(variant);
      setSelectedSize(size);
      // Update color to match the found variant (it might be different if fallback was used)
      setSelectedColor(variant.color || '');
    }
  };

  const isInCart = (product) => {
    if (!product) return false;
    const productId = String(product._id || product.id);
    return cartItems.some(item => {
      const itemProductId = String(item.product._id || item.product.id);
      return itemProductId === productId;
    });
  };

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

    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error('Please select a size and color');
      return;
    }

    dispatch(addToCart({
      product,
      quantity,
      variant: selectedVariant
    }));
    toast.success(`${quantity} x ${product.title || product.name} added to cart!`);
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
      toast.success(`${product.title || product.name} added to wishlist!`);
      dispatch(fetchWishlist());
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
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/products" className="inline-block bg-trana-orange text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
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
  const productTitle = product.title || product.name;
  const productPrice = selectedVariant?.price || product.pricing?.price || product.price;
  const compareAtPrice = product.pricing?.compareAtPrice;
  const inStock = selectedVariant ? selectedVariant.inventory.quantity > 0 : (product.availability?.inStock !== false);
  const availableStock = selectedVariant?.inventory.quantity || product.stock || 0;

  // Get unique sizes and colors
  const uniqueSizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : [];
  const uniqueColors = product.variants ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-trana-orange">Home</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-trana-orange">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-semibold">{productTitle}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images */}
            <div>
              <div className="flex gap-4">
                {images.length > 1 && (
                  <div className="flex-shrink-0">
                    <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-trana-orange scale-105' : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                          <img src={img} alt={`${productTitle} ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-1">
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                    {images.length > 0 ? (
                      <img src={images[selectedImage]} alt={productTitle} className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                {product.category?.name || product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{productTitle}</h1>

              {/* Rating */}
              {product.rating && product.rating.count > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(product.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-trana-orange">₹{productPrice}</span>
                {compareAtPrice > productPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{compareAtPrice}</span>
                )}
                {inStock ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ In Stock ({availableStock} available)
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-700 mb-4">{product.shortDescription}</p>
              )}

              {/* Variants - Size Selection */}
              {uniqueSizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleVariantChange(size, selectedColor)}
                        className={`px-4 py-2 border-2 rounded-lg font-semibold transition ${selectedSize === size
                          ? 'border-trana-orange bg-trana-orange text-white'
                          : 'border-gray-300 hover:border-trana-orange'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants - Color Selection */}
              {uniqueColors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Color: <span className="text-gray-600 font-normal">{selectedColor}</span></label>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleVariantChange(selectedSize, color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color
                          ? 'border-trana-orange ring-2 ring-trana-orange ring-offset-2 scale-110'
                          : 'border-gray-300 hover:border-trana-orange hover:scale-105'
                          }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

             

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={availableStock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), availableStock))}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 bg-trana-orange text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`px-6 py-3 border-2 rounded-lg font-semibold transition ${inWishlist ? 'border-green-500 text-green-600 bg-green-50' : 'border-trana-orange text-trana-orange hover:bg-orange-50'
                    }`}
                >
                  {inWishlist ? '✓ In Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="border-t border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Product Description</h2>
            <p className="text-gray-700 mb-6">{product.description}</p>

             {/* Attributes */}
             <h3 className="font-semibold text-lg mb-2 border-t border-gray-200">Product Details</h3>
              {product.attributes && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-md">
                    {product.attributes.gender && (
                      <div><span className="text-gray-600">Gender:</span> <span className="font-medium">{product.attributes.gender}</span></div>
                    )}
                    {product.attributes.fabric && (
                      <div><span className="text-gray-600">Fabric:</span> <span className="font-medium">{product.attributes.fabric}</span></div>
                    )}
                    {product.attributes.length && (
                      <div><span className="text-gray-600">Length:</span> <span className="font-medium">{product.attributes.length}</span></div>
                    )}
                    {product.attributes.sleeve && (
                      <div><span className="text-gray-600">Sleeve:</span> <span className="font-medium">{product.attributes.sleeve}</span></div>
                    )}
                  </div>
                </div>
              )}
          </div>
          
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Rating Summary */}
          {product.rating && product.rating.count > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              <div className="text-center">
                <div className="text-5xl font-bold text-trana-orange mb-2">{product.rating.average.toFixed(1)}</div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-6 h-6 ${i < Math.round(product.rating.average) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">{product.rating.count} reviews</p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm w-8">{star} ★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(product.ratingDistribution[star] / product.rating.count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{product.ratingDistribution[star]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Write Review Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-trana-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                productId={id}
                onSuccess={() => {
                  setShowReviewForm(false);
                  dispatch(fetchProductReviews({ productId: id, params: { status: 'approved' } }));
                }}
              />
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-orange mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.user.name}</span>
                        {review.verifiedPurchase && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified Purchase</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {review.adminReply && review.adminReply.message && (
                    <div className="bg-gray-50 border-l-4 border-trana-orange p-4 mt-4">
                      <p className="text-sm font-semibold mb-1">Response from Trana Safety:</p>
                      <p className="text-sm text-gray-700">{review.adminReply.message}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id || relatedProduct.id}
                  to={`/products/${relatedProduct._id || relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="h-48 bg-gray-200">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img src={relatedProduct.images[0]} alt={relatedProduct.title || relatedProduct.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{relatedProduct.category?.name || relatedProduct.category}</p>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relatedProduct.title || relatedProduct.name}</h3>
                    <p className="text-trana-orange font-bold">₹{relatedProduct.pricing?.price || relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
