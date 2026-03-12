export function errorHandler(err, req, res, next) {
  console.error(err.message, err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).send({ status: "error", error: message });
}
