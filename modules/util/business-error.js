class BusinessError extends Error {
  constructor(errorCode, errorMsg) {
    super(errorMsg)
    this.code = errorCode

    Error.captureStackTrace(this, BusinessError)
  }
}

module.exports = BusinessError
