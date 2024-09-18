import { Auction, Bet, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../../client';
import BadRequestError from '../../common/errors/bad-request-error';
import NotFoundError from '../../common/errors/not-found-error';
import UserService from '../user/user.service';
import AuctionService from './auction.service';
import BetService from './bet/bet.service';

describe('AuctionService', () => {
  let auctionService: AuctionService;
  let userService: UserService;
  let betService: BetService;
  let owner: {
    id: number;
    name: string | null;
    email: string;
  };

  beforeAll(async () => {
    auctionService = new AuctionService();
    userService = new UserService();
    betService = new BetService();
    const result = await userService.create({
      name: 'John Doe',
      email: 'johnowner@gmail.com',
      password: 'pa1X!ssword123'
    } as User);
    owner = result!.user;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.auction.deleteMany();
    await prisma.bet.deleteMany();
  });

  describe('get', () => {
    it('should return auction with currentBet', async () => {
      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          mainPhoto: 'https://picsum.photos/800',
          userId: owner.id
        }
      });

      const result = await auctionService.get(auction.id);

      expect(result!.currentBet).toEqual(null);

      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);
      betService.create(token, auction.id, { betValue: 100 } as Bet);

      const resultAfterBet = await auctionService.get(auction.id);
      expect(resultAfterBet!.currentBet).toEqual(100);
    });

    it('should throw NotFoundError if auction does not exist', async () => {
      await expect(auctionService.get(9999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete auction if user owns it', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          mainPhoto: 'https://picsum.photos/800',
          userId: user.userId
        }
      });

      await auctionService.delete(token, auction.id);

      const deletedAuction = await prisma.auction.findUnique({ where: { id: auction.id } });
      expect(deletedAuction).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new auction with a photo', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);
      const auctionData = {
        name: 'New Auction',
        description: 'New description',
        startPrice: 100
      };
      const photo = Buffer.from('image-data');

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ image: { image: { url: 'http://image.url' } } })
      } as any);

      const result = await auctionService.create(token, auctionData as Auction, photo);

      expect(result!.mainPhoto).toBe('http://image.url');
    });

    it('should throw BadRequestError if no photo is provided', async () => {
      const user = { userId: owner.id };
      const token = jwt.sign(user, process.env.JWT_SECRET!);
      const auctionData = { name: 'New Auction', description: 'New description', startPrice: 100 };

      await expect(auctionService.create(token, auctionData as Auction, undefined)).rejects.toThrow(
        BadRequestError
      );
    });
  });
});
