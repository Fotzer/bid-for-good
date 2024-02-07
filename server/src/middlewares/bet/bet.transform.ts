import { NextFunction, Request, Response } from 'express';

<<<<<<< HEAD
function transformBetMiddleware(req: Request, _: Response, next: NextFunction): void {
=======
function transformBetMiddleware(req: Request, res: Response, next: NextFunction): void {
>>>>>>> feature/backend
  if (req.body) {
    if (req.body.betValue) {
      req.body.betValue = Number(req.body.betValue);
    }
  }

  next();
}

export default transformBetMiddleware;
