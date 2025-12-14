function buildCustomizationPrompt(customizationData, baseImageDescription) {
  const base = typeof baseImageDescription === 'string' && baseImageDescription.trim().length > 0
    ? baseImageDescription.trim()
    : '';
  const parts = [];
  if (base) parts.push(base);
  if (customizationData && typeof customizationData === 'object') {
    try {
      parts.push(JSON.stringify(customizationData));
    } catch (_) {
      parts.push(String(customizationData));
    }
  } else if (customizationData) {
    parts.push(String(customizationData));
  }
  return parts.filter(Boolean).join(' | ');
}

function parseDataUrl(input) {
  if (typeof input !== 'string') return null;
  const m = input.match(/^data:([^;]+);base64,(.*)$/i);
  if (!m) return null;
  return { mimeType: m[1], base64: m[2] };
}

function isLikelyBase64(input) {
  if (typeof input !== 'string') return false;
  if (/[^A-Za-z0-9+/=]/.test(input)) return false;
  return input.length % 4 === 0;
}

const PLACEHOLDER_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAGVwJm1qjIpgAAAABJRU5ErkJggg==';

async function generateImageFromPrompt(prompt, productImage) {
  const dataUrl = parseDataUrl(productImage);
  if (dataUrl) {
    return { imageBase64: dataUrl.base64, mimeType: dataUrl.mimeType };
  }
  if (isLikelyBase64(productImage)) {
    return { imageBase64: productImage, mimeType: 'image/png' };
  }
  return { imageBase64: PLACEHOLDER_PNG_BASE64, mimeType: 'image/png' };
}

module.exports = { buildCustomizationPrompt, generateImageFromPrompt };
