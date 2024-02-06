import HTTPStatus from "../enums/http-status";
import HTTPError from "./http-error";

class NotFoundError extends HTTPError {
  constructor(message = HTTPStatus.NotFound.message) {
    super(message, HTTPStatus.NotFound.status);
  }
}

export default NotFoundError;
