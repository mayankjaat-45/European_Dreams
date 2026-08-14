const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let errors = error.errors || [];

  if (error.name === "MulterError") {
    statusCode = 400;

    if (error.code === "LIMIT_FILE_SIZE") {
      message = "File size cannot exceed 10 MB";
    } else if (error.code === "LIMIT_FILE_COUNT") {
      message = "You can upload a maximum of 10 files";
    } else {
      message = error.message;
    }
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if (error.code === 11000) {
    statusCode = 409;

    const duplicateFields = Object.keys(error.keyValue || {});

    message = duplicateFields.length
      ? `${duplicateFields.join(", ")} already exists`
      : "Duplicate value already exists";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;

    errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    message = "Validation failed";
  }

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  const response = {
    success: false,
    message,
    errors,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;
