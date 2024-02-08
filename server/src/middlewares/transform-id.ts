import { NextFunction, Request, Response } from 'express';
import HTTPStatus from '../common/enums/http-status';
import { number } from 'joi';

function validateParamsNumberMiddleware(attributes: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      for (const attribute of attributes) {
        if (isNaN(Number(req.params[attribute]))) {
          throw new Error();
        }
      }

      next();
    } catch (e) {
      res.status(HTTPStatus.BadRequest.status).send(HTTPStatus.BadRequest.message);
    }
  };
}

export default validateParamsNumberMiddleware;
