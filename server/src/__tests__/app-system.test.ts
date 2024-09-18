import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app';
import prisma from '../client';

describe('System Testing for App', () => {
  let token: string;
  let auctionId: number;
  let userId: number;

  beforeAll(async () => {
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'passworA!d123'
      }
    });

    userId = testUser.id;

    token = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET!);

    const auction = await prisma.auction.create({
      data: {
        name: 'Test Auction',
        description: 'Test Auction Description',
        startPrice: 1000,
        userId: testUser.id,
        mainPhoto: 'test-photo-url'
      }
    });

    auctionId = auction.id;
  });

  afterAll(async () => {
    await prisma.auctionPhoto.deleteMany({ where: { auctionId } });
    await prisma.bet.deleteMany({ where: { auctionId } });
    try {
      await prisma.auction.delete({ where: { id: auctionId } });
    } catch {}
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('should create a bet for the auction', async () => {
    const betData = { betValue: 1200 };

    const response = await request(app)
      .post(`/auctions/${auctionId}/bets/`)
      .set('Authorization', `Bearer ${token}`)
      .send(betData);

    expect(response.status).toBe(201);
    expect(response.body.betValue).toBe(betData.betValue);

    const bets = await prisma.bet.findMany({
      where: { auctionId }
    });
    expect(bets.length).toBe(1);
    expect(bets[0].betValue).toBe(betData.betValue);
  });

  it('should fetch auction details with highest bet', async () => {
    const response = await request(app)
      .get(`/auctions/${auctionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.currentBet).toBe(1200);
  });

  it('should delete an auction', async () => {
    const response = await request(app)
      .delete(`/auctions/${auctionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);

    const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
    expect(auction).toBeNull();
  });
});
