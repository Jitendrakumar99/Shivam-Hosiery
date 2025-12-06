// Pagination middleware
exports.paginate = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    try {
      // Add pagination to request
      req.pagination = {
        startIndex,
        limit,
        page
      };

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error paginating results'
      });
    }
  };
};

