# Stability AI Integration Setup

## Overview
The customize page now uses Stability AI's Ultra model to generate realistic previews of customized safety garments.

## API Key Configuration

### Required Environment Variable
Add the following to your `.env` file in the Backend directory:

```
STABILITY_API_KEY=sk-YOUR_API_KEY_HERE
```

### Getting Your API Key
1. Visit [Stability AI Platform](https://platform.stability.ai/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key (starts with `sk-`)

## API Details
- **Endpoint**: `https://api.stability.ai/v2beta/stable-image/generate/ultra`
- **Model**: Stable Image Ultra
- **Output Format**: WebP
- **Aspect Ratio**: 1:1 (square images)

## Usage
The API is automatically called when users click "Generate AI Preview" on the customize page. The system:
1. Builds a prompt from user customization options
2. Sends request to Stability AI
3. Returns generated image as base64-encoded WebP
4. Displays the preview to the user

## Cost Considerations
- Each image generation consumes API credits
- Monitor your usage on the Stability AI dashboard
- Consider implementing rate limiting for production use

## Error Handling
The system handles:
- Missing API key errors
- API rate limits
- Network failures
- Invalid responses

Errors are logged and user-friendly messages are displayed.
