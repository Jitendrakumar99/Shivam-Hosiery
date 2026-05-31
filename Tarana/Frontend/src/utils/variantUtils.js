export const normalizeColor = (color) => String(color ?? '').trim().toLowerCase();

export const findVariantMatch = (variants, size, color) => {
  if (!variants?.length || !size) return null;
  return variants.find(
    (v) =>
      v.size === size &&
      normalizeColor(v.color) === normalizeColor(color)
  );
};

export const getUniqueSizes = (variants) => {
  if (!variants?.length) return [];
  return [...new Set(variants.map((v) => v.size).filter(Boolean))];
};

export const getUniqueColors = (variants) => {
  if (!variants?.length) return [];
  return [
    ...new Set(
      variants
        .map((v) => v.color)
        .filter((color) => color !== undefined && color !== null && String(color).trim() !== '')
    ),
  ];
};

export const getColorsForSize = (variants, size) => {
  if (!variants?.length || !size) return [];
  return getUniqueColors(variants.filter((v) => v.size === size));
};

export const getSizesForColor = (variants, color) => {
  if (!variants?.length) return [];
  return [
    ...new Set(
      variants
        .filter((v) => normalizeColor(v.color) === normalizeColor(color))
        .map((v) => v.size)
        .filter(Boolean)
    ),
  ];
};

export const getColorStyle = (color) => {
  const value = String(color || '').trim();
  if (!value) return '#d1d5db';
  if (value.startsWith('#')) return value;
  return value.toLowerCase();
};

export const formatColorLabel = (color) => {
  const value = String(color || '').trim();
  if (!value) return '';
  if (value.startsWith('#')) return value.toUpperCase();
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};
