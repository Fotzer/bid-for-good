import HTTPStatus from "../enums/http-status";
import HTTPError from "./http-error";

class InternalServerError extends HTTPError {
  constructor(message = HTTPStatus.InternalServerError.message) {
    super(message, HTTPStatus.InternalServerError.status);
  }
}

export default InternalServerError;
