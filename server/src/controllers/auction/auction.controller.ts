import express from 'express';
import controllerHandleErrors from '../../helpers/controller-handle-errors';
import AuctionService from '../../services/auction/auction.service';
import multer from 'multer';
import transformAuctionMiddleware from '../../middlewares/auction/transform.auction';
import betController from './bet/bet.controller';
import auctionPhotoController from './photo/auction-photo.controller';
import validateParamsNumberMiddleware from '../../middlewares/transform-id';
import HTTPStatus from '../../common/enums/http-status';
import AuctionPhotoService from '../../services/auction/auction-photo/auction-photo.service';
import MulterFile from '../../common/types/multer-file';
const upload = multer();

const auctionController = express.Router();

const auctionService = new AuctionService();
const auctionPhotoService = new AuctionPhotoService();

auctionController.use('/', betController);

auctionController.use('/', auctionPhotoController);

auctionController.get(
  '/:auctionId/',
  validateParamsNumberMiddleware(['auctionId']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () => auctionService.get(Number(req.params.auctionId)))
    );
  }
);

auctionController.delete(
  '/:auctionId/',
  validateParamsNumberMiddleware(['auctionId']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () =>
        auctionService.delete(req.headers['authorization'], Number(req.params.auctionId))
      )
    );
  }
);

auctionController.post('/', upload.any(), transformAuctionMiddleware, async (req, res) => {
  console.log(req.files);

  res.statusCode = HTTPStatus.Created.status;
  res.send(
    await controllerHandleErrors(res, async () => {
      const auction = await auctionService.create(
        req.headers['authorization'],
        req.body,
        (req.files as MulterFile[])[0].buffer
      );

      const auctionPhotos = await Promise.all(
        (req.files as MulterFile[])
          .slice(1)
          .map(
            async (auctionPhoto) =>
              await auctionPhotoService.create(
                req.headers['authorization'],
                auctionPhoto.buffer,
                auction!.id
              )
          )
      );

      return {
        auction: auction,
        auctionPhotos: auctionPhotos
      };
    })
  );
});

auctionController.put(
  '/:id',
  upload.any(),
  transformAuctionMiddleware,
  validateParamsNumberMiddleware(['id']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, async () => {
        await auctionPhotoService.deleteAll(req.headers['authorization']!, +req.params.id);
        await Promise.all(
          (req.files as MulterFile[])
            .slice(1)
            .map(
              async (auctionPhoto) =>
                await auctionPhotoService.create(
                  req.headers['authorization'],
                  auctionPhoto.buffer,
                  +req.params.id!
                )
            )
        );
        return auctionService.update(
          req.headers['authorization'],
          Number(req.params.id),
          req.body,
          (req.files as MulterFile[])[0].buffer
        );
      })
    );
  }
);

auctionController.get(
  '/:id/users',
  upload.single('photo'),
  transformAuctionMiddleware,
  validateParamsNumberMiddleware(['id']),
  async (req, res) => {
    res.send(
      await controllerHandleErrors(res, () => auctionService.getUsers(Number(req.params.id)))
    );
  }
);

auctionController.get('/', upload.single('photo'), transformAuctionMiddleware, async (req, res) => {
  res.send(await controllerHandleErrors(res, () => auctionService.getAll()));
});

export default auctionController;
