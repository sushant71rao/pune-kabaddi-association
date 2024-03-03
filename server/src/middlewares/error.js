let errorfn = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal error";

  if (err.name == "CastError") {
    const message = "Resource not found .invalid :" + `${err.stack}`;
  }
  res.status(404).json({
    success: false,
    message: err.message,
  });
};

export default errorfn;
