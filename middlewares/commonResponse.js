function successResponse(req, res, next) {
  res.successResponse = function (data, message = "Success", statusCode) {
    res.json({
      statusCode: statusCode,
      response: {
        status: true,
        message: message,
        data: data,
        error: null,
      },
    });
  };
  next();
}

// Define a function to handle error responses
function errorResponse(req, res, next) {
  res.errorResponse = function (
    error,
    message = "Internal Server Error",
    statusCode = 500
  ) {
    res.status(statusCode).json({
      statusCode: statusCode,
      response: {
        status: false,
        message: message,
        data: null,
        error: error,
      },
    });
  };
  next();
}
module.exports = { successResponse, errorResponse };
