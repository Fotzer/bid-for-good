import { NextFunction, Request, Response } from 'express';

function transformBetMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.body) {
    if (req.body.betValue) {
      req.body.betValue = Number(req.body.betValue);
    }
  }

  next();
}

export default transformBetMiddleware;
