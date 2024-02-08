import express from 'express';
import controllerHandleErrors from '../../helpers/controller-handle-errors';
import AuctionService from '../../services/auction/auction.service';
import multer from 'multer';
import transformAuctionMiddleware from '../../middlewares/auction/transform.auction';
import betController from './bet/bet.controller';
import auctionPhotoController from './photo/auction-photo.controller';
import validateParamsNumberMiddleware from '../../middlewares/transform-id';
import HTTPStatus from '../../common/enums/http-status';
const upload = multer();

const auctionController = express.Router();

const auctionService = new AuctionService();

auctionController.use('/', betController);

auctionController.use('/', auctionPhotoController);

auctionController.post('/', upload.any(), transformAuctionMiddleware, async (req, res) => {
  res.statusCode = HTTPStatus.Created.status;
  res.send(
    await controllerHandleErrors(res, () =>
      auctionService.create(
        req.headers['authorization'],
        req.body,
        (req.files as unknown as Buffer[])[0].buffer as Buffer,
        (req.files as unknown as Buffer[]).slice(1) as Buffer[]
      )
    )
  );
});

auctionController.put(
  '/:id',
  upload.single('photo'),
  transformAuctionMiddleware,
  validateParamsNumberMiddleware(['id']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () =>
        auctionService.update(
          req.headers['authorization'],
          Number(req.params.id),
          req.body,
          req.file?.buffer
        )
      )
    );
  }
);

auctionController.get(
  '/:id/users',
  upload.single('photo'),
  transformAuctionMiddleware,
  validateParamsNumberMiddleware(['id']),
  async (req, res) => {
    res.send(await controllerHandleErrors(res, () => auctionService.getUsers(Number(req.params.id))));
  }
);

auctionController.get('/', upload.single('photo'), transformAuctionMiddleware, async (req, res) => {
  res.send(await controllerHandleErrors(res, () => auctionService.getAll()));
});

export default auctionController;
