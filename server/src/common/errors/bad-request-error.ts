import HTTPStatus from '../enums/http-status';
import HTTPError from './http-error';

class BadRequestError extends HTTPError {
  constructor(message = HTTPStatus.BadRequest.message) {
    super(message, HTTPStatus.BadRequest.status);
  }
}

export default BadRequestError;
