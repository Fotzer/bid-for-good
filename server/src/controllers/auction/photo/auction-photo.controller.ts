import express from 'express';
import controllerHandleErrors from '../../../helpers/controller-handle-errors';
import AuctionPhotoService from '../../../services/auction/auction-photo/auction-photo.service';
import multer from 'multer';
import validateParamsNumberMiddleware from '../../../middlewares/transform-id';
import HTTPStatus from '../../../common/enums/http-status';

const upload = multer();
const auctionPhotoController = express.Router();

const auctionPhotoService = new AuctionPhotoService();

auctionPhotoController.get(
  '/:auctionId/auction-photos',
  validateParamsNumberMiddleware(['auctionId']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () =>
        auctionPhotoService.getAuctionPhotos(Number(req.params.auctionId))
      )
    );
  }
);

auctionPhotoController.post(
  '/:auctionId/auction-photos',
  validateParamsNumberMiddleware(['auctionId']),
  upload.single('photo'),
  async (req, res) => {
    res.statusCode = HTTPStatus.Created.status;
    res.send(
      await controllerHandleErrors(res, () =>
        auctionPhotoService.create(
          req.headers['authorization']!,
          req.file?.buffer,
          Number(req.params.auctionId)
        )
      )
    );
  }
);

auctionPhotoController.put(
  '/auction-photos/:id',
  upload.single('photo'),
  validateParamsNumberMiddleware(['id']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () =>
        auctionPhotoService.update(req.headers['authorization']!, req.file?.buffer, Number(req.params.id))
      )
    );
  }
);

auctionPhotoController.delete(
  '/auction-photos/:id',
  validateParamsNumberMiddleware(['id']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () =>
        auctionPhotoService.delete(req.headers['authorization']!, Number(req.params.id))
      )
    );
  }
);

export default auctionPhotoController;
