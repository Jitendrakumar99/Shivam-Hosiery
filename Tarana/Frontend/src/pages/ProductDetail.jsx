import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProduct, fetchProducts } from '../store/slices/productSlice';
import { addToWishlist, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductReviews } from '../store/slices/reviewSlice';
import ReviewForm from '../components/ReviewForm';
import { createFlyingAnimation, triggerCartBounce, triggerWishlistAnimation } from '../utils/animations';
import {
  findVariantMatch,
  getUniqueSizes,
  getUniqueColors,
  getColorsForSize,
  getSizesForColor,
  getColorStyle,
  formatColorLabel,
  normalizeColor,
} from '../utils/variantUtils';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.products);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
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
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const productImageRef = useRef(null);
  const wishlistButtonRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
      dispatch(fetchProductReviews({ productId: id, params: {} }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Set default variant when product loads
  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        setSelectedVariant(firstVariant);
        setSelectedSize(firstVariant.size);
        setSelectedColor(firstVariant.color || '');
      }
      setQuantity(product.minOrderQuantity || 1);
    }
  }, [product]);

  // Fetch related products - random 3-4 products
  useEffect(() => {
    if (product) {
      // Fetch all products and pick random ones
      dispatch(fetchProducts({ limit: 50 }))
        .then((result) => {
          if (fetchProducts.fulfilled.match(result)) {
            const allProducts = result.payload.data.filter(
              (p) => (p._id || p.id) !== (product._id || product.id)
            );
            // Shuffle and pick 3-4 random products
            const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
            setRelatedProducts(shuffled.slice(0, Math.min(4, shuffled.length)));
          }
        });
    }
  }, [dispatch, product]);

  const handleVariantChange = (size, color) => {
    if (!product?.variants?.length) return;
    const variant = findVariantMatch(product.variants, size, color);
    if (!variant) return;
    setSelectedVariant(variant);
    setSelectedSize(variant.size);
    setSelectedColor(variant.color || '');
  };

  const handleSizeSelect = (size) => {
    if (!product?.variants?.length) return;
    const colorsForSize = getColorsForSize(product.variants, size);
    const nextColor =
      colorsForSize.find((c) => normalizeColor(c) === normalizeColor(selectedColor)) ||
      colorsForSize[0] ||
      '';
    handleVariantChange(size, nextColor);
  };

  const handleColorSelect = (color) => {
    if (!product?.variants?.length) return;
    const sizesForColor = getSizesForColor(product.variants, color);
    const nextSize = sizesForColor.includes(selectedSize) ? selectedSize : sizesForColor[0] || '';
    handleVariantChange(nextSize, color);
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
    if (!product || isAdding) return;

    if (product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        toast.error('Please select a size and color');
        return;
      }
    } else if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const finalVariant = selectedVariant
      ? selectedVariant
      : { size: selectedSize, color: selectedColor, price: product.pricing?.price || product.price };

    setIsAdding(true);

    // Get product image for animation
    const productImage = productImageRef.current;

    // Trigger flying animation - will automatically target cart icon in header (right side)
    if (productImage && product.images && product.images.length > 0) {
      createFlyingAnimation(product.images[0] || product.images[selectedImage], productImage);
      // Trigger cart bounce after a short delay
      setTimeout(() => {
        triggerCartBounce();
      }, 300);
    }

    dispatch(addToCart({
      product,
      quantity,
      variant: finalVariant
    }));

    toast.success(`${quantity} x ${product.title || product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-right',
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
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

    // Trigger wishlist animation
    if (wishlistButtonRef.current) {
      triggerWishlistAnimation(wishlistButtonRef.current);
    }

    const result = await dispatch(addToWishlist(product._id || product.id));
    if (addToWishlist.fulfilled.match(result)) {
      toast.success(`${product.title || product.name} added to wishlist!`, {
        duration: 2000,
        position: 'bottom-right',
      });
      dispatch(fetchWishlist());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-page-bg py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-card-bg rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/products" className="inline-block bg-trana-primary text-white px-6 py-3 rounded-lg hover:bg-trana-dark transition">
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
  const minOrderQuantity = product.minOrderQuantity || 1;

  const productVariants = product.variants || [];
  const allSizes = getUniqueSizes(productVariants);
  const allColors = getUniqueColors(productVariants);
  const visibleColors = selectedSize
    ? getColorsForSize(productVariants, selectedSize)
    : allColors;
  const visibleSizes = selectedColor
    ? getSizesForColor(productVariants, selectedColor)
    : allSizes;

  // Check if current user has already reviewed this product
  const hasUserReviewed = isAuthenticated && user && reviews && reviews.some(review =>
    String(review.user?.id || review.user?._id || review.user) === String(user._id || user.id)
  );

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Page Header / Breadcrumbs Section */}
      <section className="bg-page-header-bg text-black pt-32 pb-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <nav>
            <ol className="flex items-center space-x-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li>/</li>
              <li><Link to="/products" className="hover:text-white transition">Products</Link></li>
              <li>/</li>
              <li className="text-white font-semibold truncate">{productTitle}</li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <div className="bg-card-bg rounded-lg shadow-lg overflow-hidden mb-8">
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
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-trana-primary scale-105' : 'border-gray-200 hover:border-gray-400'
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
                      <img
                        ref={productImageRef}
                        src={images[selectedImage]}
                        alt={productTitle}
                        className="w-full h-full object-contain p-4"
                      />
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
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-trana-primary">₹{productPrice}</span>
                  {compareAtPrice > productPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">₹{compareAtPrice}</span>
                      <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                        {Math.round(((compareAtPrice - productPrice) / compareAtPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                {minOrderQuantity > 1 && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Min Order: {minOrderQuantity}
                  </span>
                )}
              </div>

              {/* GST Information */}
              {(product.gst_percentage || 0) > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">GST {product.gst_percentage}% applicable:</span> ₹{(((productPrice * (product.gst_percentage || 0)) / 100).toFixed(2))} will be added to this product
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Final price:</span> ₹{((productPrice + (productPrice * (product.gst_percentage || 0)) / 100).toFixed(2))} per unit
                  </p>
                </div>
              )}

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-700 mb-4">{product.shortDescription}</p>
              )}

              {/* Variants - Size Selection */}
              {allSizes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold">Size</label>
                    <button
                      onClick={() => setShowSizeChart(true)}
                      className="text-trana-primary text-sm font-semibold hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Size Chart
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {visibleSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-semibold transition ${selectedSize === size
                          ? 'border-trana-primary bg-trana-primary text-white'
                          : 'border-gray-300 hover:border-trana-primary'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {visibleColors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">
                    Color: <span className="text-gray-600 font-normal">{formatColorLabel(selectedColor)}</span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  {visibleColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color
                        ? 'border-trana-primary ring-2 ring-trana-primary ring-offset-2 scale-110'
                        : 'border-gray-300 hover:border-trana-primary hover:scale-105'
                        }`}
                      style={{ backgroundColor: getColorStyle(color) }}
                      title={formatColorLabel(color)}
                      aria-label={formatColorLabel(color)}
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
                    onClick={() => setQuantity(Math.max(minOrderQuantity, quantity - 1))}
                    disabled={quantity <= minOrderQuantity}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={minOrderQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(minOrderQuantity, parseInt(e.target.value) || minOrderQuantity))}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-trana-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-trana-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  ref={wishlistButtonRef}
                  onClick={handleAddToWishlist}
                  className={`px-6 py-3 border-2 rounded-lg font-semibold transition ${inWishlist ? 'border-trana-primary text-trana-dark bg-trana-light' : 'border-trana-primary text-trana-primary hover:bg-trana-light'
                    }`}
                >
                  {inWishlist ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      In Wishlist
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Add to Wishlist
                    </span>
                  )}
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
        <div className="bg-card-bg rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Rating Summary */}
          {product.rating && product.rating.count > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              <div className="text-center">
                <div className="text-5xl font-bold text-trana-primary mb-2">{product.rating.average.toFixed(1)}</div>
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

          {/* Write Review Button - Only show if user hasn't reviewed yet */}
          <div className="mb-6">
            {!hasUserReviewed ? (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-trana-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-trana-dark transition"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            ) : (
              <div className="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">You have already reviewed this product. You can find and edit your review below.</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                productId={id}
                onSuccess={() => {
                  setShowReviewForm(false);
                  dispatch(fetchProductReviews({ productId: id, params: {} }));
                }}
              />
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trana-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0 relative">
                  {editingReviewId === review._id ? (
                    <div className="mt-4">
                      <ReviewForm
                        productId={id}
                        initialData={review}
                        onSuccess={() => {
                          setEditingReviewId(null);
                          dispatch(fetchProductReviews({ productId: id, params: {} }));
                        }}
                      />
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancel Edit
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{review.user.name}</span>
                            {review.verifiedPurchase && (
                              <span className="bg-trana-light text-trana-dark text-xs px-2 py-1 rounded">Verified Purchase</span>
                            )}
                            {review.status !== 'approved' && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200">Awaiting Approval</span>
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

                        {/* Edit Button - Only show if it's user's own review */}
                        {isAuthenticated && user && String(review.user?.id || review.user?._id || review.user) === String(user._id || user.id) && (
                          <button
                            onClick={() => setEditingReviewId(review._id)}
                            className="text-trana-primary hover:text-green-700 text-sm font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        )}
                      </div>
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                      <p className="text-gray-700 mb-3">{review.comment}</p>

                      {review.adminReply && review.adminReply.message && (
                        <div className="bg-gray-50 border-l-4 border-trana-primary p-4 mt-4">
                          <p className="text-sm font-semibold mb-1">Response from Trana Safety:</p>
                          <p className="text-sm text-gray-700">{review.adminReply.message}</p>
                        </div>
                      )}
                    </>
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
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="h-48 bg-gray-50 flex items-center justify-center p-3">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title || relatedProduct.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image Available</div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">{relatedProduct.category?.name || relatedProduct.category}</p>
                    <h3 className="font-bold text-sm mb-1 text-slate-800 line-clamp-1 group-hover:text-trana-primary transition-colors">{relatedProduct.title || relatedProduct.name}</h3>
                    <p className="text-trana-primary font-extrabold text-base">₹{relatedProduct.pricing?.price || relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Size Chart Modal */}
        {showSizeChart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-card-bg rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="text-2xl font-bold text-gray-900">Size Guide</h3>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 border-b font-bold text-gray-700">Size</th>
                        <th className="p-4 border-b font-bold text-gray-700">Chest (Inches)</th>
                        <th className="p-4 border-b font-bold text-gray-700">Waist (Inches)</th>
                        <th className="p-4 border-b font-bold text-gray-700">Length (Inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { s: 'S', c: '36-38', w: '30-32', l: '26' },
                        { s: 'M', c: '38-40', w: '32-34', l: '27' },
                        { s: 'L', c: '40-42', w: '34-36', l: '28' },
                        { s: 'XL', c: '42-44', w: '36-38', l: '29' },
                        { s: 'XXL', c: '44-46', w: '38-40', l: '30' },
                        { s: 'XXXL', c: '46-48', w: '40-42', l: '31' },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="p-4 border-b font-semibold text-trana-primary">{item.s}</td>
                          <td className="p-4 border-b text-gray-600">{item.c}</td>
                          <td className="p-4 border-b text-gray-600">{item.w}</td>
                          <td className="p-4 border-b text-gray-600">{item.l}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-orange-50 rounded-lg text-sm text-orange-800">
                  <p className="font-semibold mb-1">How to measure?</p>
                  <p>For the best fit, measure your body dimensions and compare them with the chart above. If you're between sizes, we recommend going one size up for comfort.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
