import { Auction } from "@prisma/client";
import HTTPError from "../../common/errors/http-error";
import InternalServerError from "../../common/errors/internal-server-error";
import verifyToken from "../../helpers/verify-token";
import prisma from "../../client";
import BadRequestError from "../../common/errors/bad-request-error";
import NotFoundError from "../../common/errors/not-found-error";
import UserErrorMessage from "../../common/errors/messages/user-error-message";

class AuctionService {
    async create(token: string | undefined, auction: Auction) {
        try {
            const payload = verifyToken(token);
            
            const user = await prisma.user.findUnique({
                where: {
                    email: payload!.email
                }
            });

            if(!user) {
                throw new NotFoundError(UserErrorMessage.notFound);
            }
            
            try {
                const createdAuction = await prisma.auction.create({
                    data: {
                        ...auction,
                        userId: user.id
                    }
                });

                return createdAuction;
            }
            catch(e) {
                throw new BadRequestError();
            }
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

export default AuctionService;
