import express from 'express';
import controllerHandleErrors from '../../../helpers/controller-handle-errors';
import BetService from '../../../services/auction/bet/bet.service';
import transformBetMiddleware from '../../../middlewares/bet/bet.transform';
import validateParamsNumberMiddleware from '../../../middlewares/transform-id';
import HTTPStatus from '../../../common/enums/http-status';

const betController = express.Router();

const betService = new BetService();

betController.post(
  '/:auctionId/bets',
  validateParamsNumberMiddleware(['auctionId']),
  transformBetMiddleware,
  async (req, res) => {
    res.statusCode = HTTPStatus.Created.status;
    res.send(
      await controllerHandleErrors(res, () =>
        betService.create(req.headers['authorization'], req.params.auctionId, req.body)
      )
    );
  }
);

betController.get(
  '/:auctionId/bets/history',
  validateParamsNumberMiddleware(['auctionId']),
  transformBetMiddleware,
  async (req, res) => {
    res.send(await controllerHandleErrors(res, () => betService.getHistory(req.params.auctionId)));
  }
);

export default betController;
