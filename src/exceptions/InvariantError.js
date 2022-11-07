const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.message = `InvariantError: ${message}`;
  }
}

module.exports = InvariantError;
