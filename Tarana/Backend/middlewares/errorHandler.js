// Error handler middleware
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Multer upload errors
  if (err.name === 'MulterError' || err.code === 'LIMIT_FILE_SIZE') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 15MB.'
        : err.message || 'File upload error';
    error = { message, statusCode: 400 };
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    if (err.path === '_id') {
      const message = 'Resource not found';
      error = { message, statusCode: 404 };
    } else {
      const message = `Invalid value for field: ${err.path}`;
      error = { message, statusCode: 400 };
    }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Non-image upload rejection from fileFilter
  if (err.message && err.message.includes('Not an image')) {
    error = { message: err.message, statusCode: 400 };
  }

  const statusCode = error.statusCode || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

