const axios = require('axios');
const FormData = require('form-data');

function buildCustomizationPrompt(customizationData, baseImageDescription) {
  const parts = [];
  
  // Start with base description
  if (baseImageDescription && typeof baseImageDescription === 'string' && baseImageDescription.trim()) {
    parts.push(baseImageDescription.trim());
  } else {
    parts.push('A safety garment');
  }
  
  // Add customization details
  if (customizationData && typeof customizationData === 'object') {
    const { productType, primaryColor, size, reflectiveTape, companyLogo, logoPlacement, customizationPrompt } = customizationData;
    
    if (productType) {
      parts.push(`type: ${productType}`);
    }
    if (primaryColor) {
      parts.push(`in ${primaryColor} color`);
    }
    if (reflectiveTape) {
      parts.push('with 360° reflective tape');
    }
    if (companyLogo) {
      parts.push(`with "${companyLogo}" logo on ${logoPlacement || 'front'}`);
    }
    if (customizationPrompt) {
      parts.push(customizationPrompt);
    }
  }
  
  return parts.join(', ');
}

async function generateImageFromPrompt(prompt, productImage) {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    
    if (!apiKey) {
      throw new Error('STABILITY_API_KEY is not configured in environment variables');
    }

    const payload = {
      prompt: prompt,
      output_format: 'webp',
      aspect_ratio: '1:1'
    };

    const response = await axios.postForm(
      'https://api.stability.ai/v2beta/stable-image/generate/ultra',
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: 'arraybuffer',
        headers: { 
          Authorization: `Bearer ${apiKey}`, 
          Accept: 'image/*' 
        },
      }
    );

    if (response.status === 200) {
      const imageBase64 = Buffer.from(response.data).toString('base64');
      return { 
        imageBase64, 
        mimeType: 'image/webp' 
      };
    } else {
      const errorText = Buffer.from(response.data).toString('utf-8');
      throw new Error(`Stability AI API error (${response.status}): ${errorText}`);
    }
  } catch (error) {
    console.error('Stability AI generation error:', error.message);
    throw error;
  }
}

module.exports = { buildCustomizationPrompt, generateImageFromPrompt };
