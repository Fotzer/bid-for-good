import HTTPError from '../../../common/errors/http-error';
import InternalServerError from '../../../common/errors/internal-server-error';
import prisma from '../../../client';
import FreeimageEndpoints from '../../../apis/freeimage/freeimage.endpoints';
import ImageCreateResponseDto from '../../../common/types/apis/freeimage/image.create.dto';
import verifyToken from '../../../helpers/verify-token';
import BadRequestError from '../../../common/errors/bad-request-error';
import NotFoundError from '../../../common/errors/not-found-error';

class AuctionPhotoService {
  async create(token: string | undefined, photo: Buffer | undefined, auctionId: number) {
    try {
      verifyToken(token);

      if (!photo) {
        throw new BadRequestError();
      }

      const auction = await prisma.auction.findUnique({
        where: {
          id: Number(auctionId)
        }
      });
      
      if (!auction) {
        throw new NotFoundError();
      }

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
          auctionId: Number(auctionId),
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

  async update(token: string, photo: Buffer | undefined, id: string) {
    try {
      verifyToken(token);

      if (!photo) {
        throw new BadRequestError();
      }

      const existingAuction = await prisma.auctionPhoto.findUnique({
        where: {
          id: Number(id)
        },
      });

      if (!existingAuction) {
        throw new NotFoundError();
      }

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
          id: Number(id)
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

  async delete(token: string, id: string) {
    try {
      verifyToken(token);

      try {
        const deletedAuction = await prisma.auctionPhoto.delete({
          where: {
            id: Number(id)
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

  async getAuctionPhotos(auctionId: string) {
    try {
      const auction = await prisma.auction.findUnique({
        where: {
          id: Number(auctionId)
        }
      });
      
      if (!auction) {
        throw new NotFoundError();
      }
      
      const photos = await prisma.auctionPhoto.findMany({
        where: {
          auctionId: Number(auctionId)
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
