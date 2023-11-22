class ApiError extends Error {
  constructor(statusCode, message, headers = {}) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.headers = headers;
  }
}

module.exports = ApiError;
