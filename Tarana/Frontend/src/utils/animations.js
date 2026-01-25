// Animation utilities for cart and wishlist

// Create flying product image animation
export const createFlyingAnimation = (imageSrc, startElement, endElement = null) => {
  if (!imageSrc || !startElement) return;

  // If endElement not provided, find cart icon in header (right side)
  let targetElement = endElement;
  if (!targetElement) {
    targetElement = document.getElementById('cart-icon-header');
    if (!targetElement) {
      // Fallback: try to find any cart icon link
      targetElement = document.querySelector('a[href="/cart"]');
    }
  }

  if (!targetElement) return;

  // Get positions
  const startRect = startElement.getBoundingClientRect();
  const endRect = targetElement.getBoundingClientRect();

  // Create flying image element
  const flyingImg = document.createElement('img');
  flyingImg.src = imageSrc;
  flyingImg.style.position = 'fixed';
  flyingImg.style.width = '60px';
  flyingImg.style.height = '60px';
  flyingImg.style.objectFit = 'cover';
  flyingImg.style.borderRadius = '8px';
  flyingImg.style.zIndex = '9999';
  flyingImg.style.pointerEvents = 'none';
  flyingImg.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  flyingImg.style.left = `${startRect.left + startRect.width / 2 - 30}px`;
  flyingImg.style.top = `${startRect.top + startRect.height / 2 - 30}px`;
  flyingImg.style.opacity = '1';
  flyingImg.style.transform = 'scale(1)';

  document.body.appendChild(flyingImg);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyingImg.style.left = `${endRect.left + endRect.width / 2 - 30}px`;
      flyingImg.style.top = `${endRect.top + endRect.height / 2 - 30}px`;
      flyingImg.style.transform = 'scale(0.3)';
      flyingImg.style.opacity = '0.8';
    });
  });

  // Remove element after animation
  setTimeout(() => {
    if (flyingImg.parentNode) {
      flyingImg.parentNode.removeChild(flyingImg);
    }
  }, 600);
};

// Trigger cart icon bounce animation
export const triggerCartBounce = (cartIconElement = null) => {
  let targetElement = cartIconElement;
  if (!targetElement) {
    targetElement = document.getElementById('cart-icon-header');
    if (!targetElement) {
      targetElement = document.querySelector('a[href="/cart"]');
    }
  }
  
  if (!targetElement) return;
  
  targetElement.classList.add('animate-bounce');
  setTimeout(() => {
    targetElement.classList.remove('animate-bounce');
  }, 600);
};

// Trigger wishlist heart animation
export const triggerWishlistAnimation = (heartElement) => {
  if (!heartElement) return;
  
  heartElement.classList.add('animate-pulse', 'scale-125');
  setTimeout(() => {
    heartElement.classList.remove('animate-pulse', 'scale-125');
  }, 500);
};

