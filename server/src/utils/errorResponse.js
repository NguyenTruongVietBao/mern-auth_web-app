class ErrorResponse extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.success = false;
    }
}

module.exports = ErrorResponse;
