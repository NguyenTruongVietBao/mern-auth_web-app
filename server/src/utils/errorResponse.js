class ErrorResponse extends Error {
  constructor(success, statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
  }
}

module.exports = ErrorResponse;
