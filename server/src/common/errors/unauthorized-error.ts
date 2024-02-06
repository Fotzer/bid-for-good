import HTTPStatus from "../enums/http-status";
import HTTPError from "./http-error";

class UnauthorizedError extends HTTPError {
  constructor(message = HTTPStatus.Unauthorized.message) {
    super(message, HTTPStatus.Unauthorized.status);
  }
}

export default UnauthorizedError;
