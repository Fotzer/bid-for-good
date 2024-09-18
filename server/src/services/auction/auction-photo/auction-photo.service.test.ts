import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../../../client';
import BadRequestError from '../../../common/errors/bad-request-error';
import NotFoundError from '../../../common/errors/not-found-error';
import UserService from '../../user/user.service';
import AuctionPhotoService from './auction-photo.service';

describe('AuctionPhotoService', () => {
  let auctionPhotoService: AuctionPhotoService;
  let userService: UserService;

  let owner: {
    id: number;
    name: string | null;
    email: string;
  };

  beforeAll(async () => {
    auctionPhotoService = new AuctionPhotoService();

    userService = new UserService();

    const result = await userService.create({
      name: 'John Doe',
      email: 'johnowneraucphoto@gmail.com',
      password: 'pa1X!ssword123'
    } as User);
    owner = result!.user;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.auctionPhoto.deleteMany();
    await prisma.auction.deleteMany();
  });

  describe('create', () => {
    it('should create a new auction photo', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: user.userId,
          mainPhoto: 'http://image.url'
        }
      });

      const photoBuffer = Buffer.from('fake-photo-data');
      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ image: { image: { url: 'http://image.url' } } })
      } as any);
      const createdPhoto = await auctionPhotoService.create(token, photoBuffer, auction.id);

      expect(createdPhoto!.auctionId).toEqual(auction.id);
      expect(createdPhoto!.photoLink).toBeDefined();
    });

    it('should throw BadRequestError if photo is not provided', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: user.userId,
          mainPhoto: 'http://image.url'
        }
      });

      await expect(auctionPhotoService.create(token, undefined, auction.id)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('update', () => {
    it('should update an auction photo', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: user.userId,
          mainPhoto: 'http://image.url'
        }
      });

      const photo = await prisma.auctionPhoto.create({
        data: {
          auctionId: auction.id,
          photoLink: 'http://image-old.url'
        }
      });

      const newPhotoBuffer = Buffer.from('http://image.url');

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ image: { image: { url: 'http://image.url' } } })
      } as any);
      const updatedPhoto = await auctionPhotoService.update(token, newPhotoBuffer, photo.id);

      expect(updatedPhoto!.photoLink).not.toEqual('http://image-old.url');
      expect(updatedPhoto!.photoLink).toBeDefined();
    });

    it('should throw BadRequestError if photo is not provided for update', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: user.userId,
          mainPhoto: 'http://image.url'
        }
      });

      const photo = await prisma.auctionPhoto.create({
        data: {
          auctionId: auction.id,
          photoLink: 'http://old-photo.url'
        }
      });

      await expect(auctionPhotoService.update(token, undefined, photo.id)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('delete', () => {
    it('should delete an auction photo', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: user.userId,
          mainPhoto: 'http://image.url'
        }
      });

      const photo = await prisma.auctionPhoto.create({
        data: {
          auctionId: auction.id,
          photoLink: 'http://photo-to-delete.url'
        }
      });

      const deletedPhoto = await auctionPhotoService.delete(token, photo.id);

      expect(deletedPhoto!.id).toEqual(photo.id);
    });

    it('should throw NotFoundError if photo does not exist', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      await expect(auctionPhotoService.delete(token, 9999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAuctionPhotos', () => {
    it('should return all auction photos for a given auction', async () => {
      const user = { userId: owner.id };

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: user.userId,
          mainPhoto: 'http://image.url'
        }
      });

      await prisma.auctionPhoto.createMany({
        data: [
          { auctionId: auction.id, photoLink: 'http://photo1.url' },
          { auctionId: auction.id, photoLink: 'http://photo2.url' }
        ]
      });

      const photos = await auctionPhotoService.getAuctionPhotos(auction.id);

      expect(photos!.length).toBe(2);
      expect(photos![0].photoLink).toEqual('http://photo1.url');
      expect(photos![1].photoLink).toEqual('http://photo2.url');
    });

    it('should throw NotFoundError if auction does not exist', async () => {
      await expect(auctionPhotoService.getAuctionPhotos(9999)).rejects.toThrow(NotFoundError);
    });
  });
});
