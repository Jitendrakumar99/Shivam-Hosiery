const NodeCache = require('node-cache');

// Create cache instance (TTL: 5 minutes)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Cache middleware
exports.cache = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Include user ID in cache key to prevent cache sharing between users
    const userKey = req.user ? `user_${req.user.id}_` : '';
    const key = `${userKey}${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original json function
    res.originalJson = res.json;

    // Override json function to cache response
    res.json = function(body) {
      // Convert Mongoose documents to plain objects if needed
      let cacheableBody = body;
      if (body && typeof body === 'object') {
        try {
          // If body has a data property that might be a Mongoose document, convert it
          if (body.data && body.data.toObject) {
            cacheableBody = {
              ...body,
              data: body.data.toObject()
            };
          } else {
            // Use JSON.parse/stringify to ensure it's a plain object
            cacheableBody = JSON.parse(JSON.stringify(body));
          }
        } catch (error) {
          // If conversion fails, don't cache
          console.error('Error converting response for cache:', error);
          return res.originalJson.call(this, body);
        }
      }
      cache.set(key, cacheableBody, duration);
      res.originalJson.call(this, body);
    };

    next();
  };
};

// Clear cache
exports.clearCache = (pattern) => {
  if (pattern) {
    const keys = cache.keys();
    keys.forEach(key => {
      if (key.includes(pattern)) {
        cache.del(key);
      }
    });
  } else {
    cache.flushAll();
  }
};

module.exports.cacheInstance = cache;

