import HTTPStatus from '../enums/http-status';
import HTTPError from './http-error';

class ConflictError extends HTTPError {
  constructor(message = HTTPStatus.Conflict.message) {
    super(message, HTTPStatus.Conflict.status);
  }
}

export default ConflictError;
