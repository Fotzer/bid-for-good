const HTTPStatus = {
  Created: { status: 201, message: 'Created' },
  Unauthorized: { status: 401, message: 'Not Authorized' },
  InternalServerError: { status: 500, message: 'Internal Server Error' },
  NotFound: { status: 404, message: 'Not Found' },
  BadRequest: { status: 400, message: 'Bad Request' },
  Conflict: { status: 409, message: 'Conflict' }
};

export default HTTPStatus;
