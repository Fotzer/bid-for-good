import { NextFunction, Request, Response } from 'express';

function transformAuctionMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.body) {
    if (req.body.startPrice) {
      req.body.startPrice = Number(req.body.startPrice);
    }
  }

  next();
}

export default transformAuctionMiddleware;
