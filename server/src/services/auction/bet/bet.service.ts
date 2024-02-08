import { Bet } from '@prisma/client';
import HTTPError from '../../../common/errors/http-error';
import InternalServerError from '../../../common/errors/internal-server-error';
import verifyToken from '../../../helpers/verify-token';
import NotFoundError from '../../../common/errors/not-found-error';
import UserErrorMessage from '../../../common/errors/messages/user.error.message';
import prisma from '../../../client';
import BadRequestError from '../../../common/errors/bad-request-error';
import { betJoiSchema } from '../../../common/joi schemas/bet/bet';
import validateSchema from '../../../validators/validate-schema';
import BetErrorMessage from '../../../common/errors/messages/bet.error.message';

class BetService {
  async create(token: string | undefined, auctionId: string, bet: Bet) {
    try {
      const betSchema = betJoiSchema();

      validateSchema(betSchema, bet);

      const userId = verifyToken(token)!.userId;

      if (!userId) {
        throw new NotFoundError(UserErrorMessage.notFound);
      }

      let createdBet;
      try {
        createdBet = await prisma.bet.create({
          data: {
            betValue: bet.betValue,
            userId: userId,
            auctionId: Number(auctionId)
          }
        });
      } catch (e) {
        throw new BadRequestError(BetErrorMessage.betValueError);
      }

      return createdBet;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }

  async getHistory(auctionId: string) {
    try {
      const auction = await prisma.auction.findUnique({
        where: {
          id: Number(auctionId)
        }
      });

      if (!auction) {
        throw new NotFoundError();
      }

      const bets = await prisma.bet.findMany({
        where: {
          auctionId: Number(auctionId)
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return bets;
    } catch (e) {
      if (e instanceof HTTPError) {
        throw e;
      } else if (e instanceof Error) {
        throw new InternalServerError(e.message);
      }
    }
  }
}

export default BetService;
