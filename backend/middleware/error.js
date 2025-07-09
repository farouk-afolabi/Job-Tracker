const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error for debugging
  
    // Default to 500 (server error) if no status code set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
  
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = errorHandler;