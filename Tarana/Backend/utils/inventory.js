const LOW_STOCK_THRESHOLD = 10;

const getVariantQuantity = (variant) =>
  variant?.inventory?.quantity ?? variant?.quantity ?? 0;

const getTotalStock = (product) => {
  if (!product?.variants?.length) return 0;
  return product.variants.reduce((sum, v) => sum + getVariantQuantity(v), 0);
};

const findVariant = (product, size, color) => {
  if (!product?.variants?.length) return null;
  const normalizedColor = color || '';
  return product.variants.find(
    (v) => v.size === size && (v.color || '') === normalizedColor
  );
};

const sanitizeVariantForPublic = (variant) => {
  const doc = variant.toObject?.() ?? variant;
  const { inventory, quantity, ...rest } = doc;
  return {
    ...rest,
    inStock: (inventory?.quantity ?? quantity ?? 0) > 0
  };
};

const sanitizeProductForPublic = (product) => {
  if (!product) return product;

  const doc = product.toObject ? product.toObject() : { ...product };

  if (doc.variants?.length) {
    doc.variants = doc.variants.map(sanitizeVariantForPublic);
  }

  // Keep availability but sanitize it to only show inStock boolean
  if (doc.availability) {
    doc.availability = {
      inStock: doc.availability.inStock
    };
  }

  return doc;
};

const refreshAvailability = (product) => {
  const totalStock = getTotalStock(product);
  if (!product.availability) {
    product.availability = {};
  }
  product.availability.inStock = totalStock > 0;
  return product;
};

const isLowStock = (product) => getTotalStock(product) < LOW_STOCK_THRESHOLD;

module.exports = {
  LOW_STOCK_THRESHOLD,
  getVariantQuantity,
  getTotalStock,
  findVariant,
  sanitizeVariantForPublic,
  sanitizeProductForPublic,
  refreshAvailability,
  isLowStock,
};
