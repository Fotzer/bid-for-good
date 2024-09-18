import { Bet, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import prisma from '../../../client';
import BadRequestError from '../../../common/errors/bad-request-error';
import NotFoundError from '../../../common/errors/not-found-error';
import UserService from '../../user/user.service';
import BetService from './bet.service';

describe('BetService', () => {
  let betService: BetService;
  let userService: UserService;

  let owner: {
    id: number;
    name: string | null;
    email: string;
  };

  beforeAll(async () => {
    betService = new BetService();
    userService = new UserService();

    const result = await userService.create({
      name: 'John Doe',
      email: 'johnownerbet@gmail.com',
      password: 'pa1X!ssword123'
    } as User);
    owner = result!.user;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.bet.deleteMany();
    await prisma.auction.deleteMany();
  });

  describe('create', () => {
    it('should create a new bet for a valid auction', async () => {
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

      const betData = { betValue: 150 };

      const result = await betService.create(token, auction.id, betData as Bet);

      expect(result!.betValue).toEqual(betData.betValue);
      expect(result!.auctionId).toEqual(auction.id);
      expect(result!.userId).toEqual(user.userId);
    });

    it('should throw NotFoundError if userId is missing in token', async () => {
      const token = jwt.sign({}, process.env.JWT_SECRET!);

      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: owner.id,
          mainPhoto: 'http://image.url'
        }
      });

      const betData = { betValue: 150 };

      await expect(betService.create(token, auction.id, betData as Bet)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should throw BadRequestError if bet creation fails', async () => {
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

      const betData = { betValue: null };

      await expect(betService.create(token, auction.id, betData as unknown as Bet)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('getHistory', () => {
    it('should return bet history for a valid auction', async () => {
      const auction = await prisma.auction.create({
        data: {
          name: 'Test Auction',
          description: 'Test Description',
          startPrice: 100,
          userId: owner.id,
          mainPhoto: 'http://image.url'
        }
      });

      const user = await prisma.user.create({
        data: {
          email: 'user@example.com',
          name: 'John Doe',
          password: 'password123'
        }
      });

      await prisma.bet.create({
        data: {
          betValue: 150,
          userId: user.id,
          auctionId: auction.id
        }
      });

      const result = await betService.getHistory(auction.id);

      expect(result!.length).toBeGreaterThan(0);
      expect(result![0].betValue).toBe(150);
      expect(result![0].user.name).toBe('John Doe');
    });

    it('should throw NotFoundError if auction does not exist', async () => {
      await expect(betService.getHistory(9999)).rejects.toThrow(NotFoundError);
    });
  });
});
