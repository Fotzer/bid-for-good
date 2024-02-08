import HTTPStatus from '../enums/http-status';
import HTTPError from './http-error';

class ForbiddenError extends HTTPError {
  constructor(message = HTTPStatus.Forbidden.message) {
    super(message, HTTPStatus.Forbidden.status);
  }
}

export default ForbiddenError;
