import HTTPError from '../../../common/errors/http-error';
import InternalServerError from '../../../common/errors/internal-server-error';
import prisma from '../../../client';
import FreeimageEndpoints from '../../../apis/freeimage/freeimage.endpoints';
import ImageCreateResponseDto from '../../../common/types/apis/freeimage/image.create.dto';
import verifyToken from '../../../helpers/verify-token';
import BadRequestError from '../../../common/errors/bad-request-error';
import NotFoundError from '../../../common/errors/not-found-error';
import AuctionService from '../auction.service';

class AuctionPhotoService {
  auctionService = new AuctionService();

  async create(token: string | undefined, photo: Buffer | undefined, auctionId: number) {
    try {
      verifyToken(token);

      if (!photo) {
        throw new BadRequestError();
      }

      await this.auctionService.get(auctionId);

      const formData = new FormData();
      formData.set('source', photo.toString('base64'));
      formData.set('key', process.env.FREEIMAGE_API_KEY!);

      const response = await fetch(FreeimageEndpoints.imageUpload, {
        method: 'POST',
        body: formData
      });

      const data: ImageCreateResponseDto = await response.json();

      const createdAuctionPhoto = await prisma.auctionPhoto.create({
        data: {
          auctionId: auctionId,
          photoLink: data.image.url
        }
      });

      return createdAuctionPhoto;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async update(token: string, photo: Buffer | undefined, id: number) {
    try {
      verifyToken(token);

      if (!photo) {
        throw new BadRequestError();
      }

      await this.auctionService.get(id);

      const formData = new FormData();
      formData.set('source', photo.toString('base64'));
      formData.set('key', process.env.FREEIMAGE_API_KEY!);

      const response = await fetch(FreeimageEndpoints.imageUpload, {
        method: 'POST',
        body: formData
      });

      const data: ImageCreateResponseDto = await response.json();

      const updatedAuction = await prisma.auctionPhoto.update({
        where: {
          id: id
        },
        data: {
          photoLink: data.image.url
        }
      });

      return updatedAuction;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async delete(token: string, id: number) {
    try {
      verifyToken(token);

      try {
        const deletedAuction = await prisma.auctionPhoto.delete({
          where: {
            id: id
          }
        });

        return deletedAuction;
      } catch (e) {
        throw new NotFoundError();
      }
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async deleteAll(token: string, auctionId: number) {
    try {
      verifyToken(token);

      await prisma.auctionPhoto.deleteMany({
        where: {
          auctionId
        }
      });
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async getAuctionPhotos(auctionId: number) {
    try {
      await this.auctionService.get(auctionId);

      const photos = await prisma.auctionPhoto.findMany({
        where: {
          auctionId: auctionId
        }
      });

      return photos;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }
}

export default AuctionPhotoService;
