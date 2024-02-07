import { Bet } from "@prisma/client";
import HTTPError from "../../../common/errors/http-error";
import InternalServerError from "../../../common/errors/internal-server-error";
import verifyToken from "../../../helpers/verify-token";
import NotFoundError from "../../../common/errors/not-found-error";
import UserErrorMessage from "../../../common/errors/messages/user-error-message";
import prisma from "../../../client";

class BetService {
    async create(token: string | undefined, auctionId: string, bet: Bet) {
        try {
            const userId = verifyToken(token)!.userId;
            
            if(!userId) {
                throw new NotFoundError(UserErrorMessage.notFound);
            }
            
            const createdBet = await prisma.bet.create({
                data: {
                    ...bet,
                    userId: userId,
                    auctionId: Number(auctionId)
                }
            });

            return createdBet;
        } 
        catch(e) {
            if(e instanceof HTTPError) {
                throw e;
            }
            else if(e instanceof Error) {
                throw new InternalServerError(e.message);
            }
        }
    }
}

export default BetService;
