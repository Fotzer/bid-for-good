import { Auction } from "@prisma/client";
import HTTPError from "../../common/errors/http-error";
import InternalServerError from "../../common/errors/internal-server-error";
import verifyToken from "../../helpers/verify-token";
import prisma from "../../client";
import BadRequestError from "../../common/errors/bad-request-error";
import NotFoundError from "../../common/errors/not-found-error";
import UserErrorMessage from "../../common/errors/messages/user-error-message";
import FreeimageEndpoints from "../../apis/freeimage/freeimage.endpoints";
import ImageCreateResponseDto from "../../common/types/apis/freeimage/image.create.dto";

class AuctionService {
    async create(token: string | undefined, auction: Auction, photo: Buffer | undefined) {
        try {
            const payload = verifyToken(token);
            

            const userId = payload!.userId;

            if(!userId) {
                throw new NotFoundError(UserErrorMessage.notFound);
            }
            
            try {

                if(!photo) {
                    throw new BadRequestError();
                }

                const formData = new FormData();
                formData.set('source', photo.toString('base64'));
                formData.set('key', process.env.FREEIMAGE_API_KEY!);
                

                const response = await fetch(FreeimageEndpoints.imageUpload, {
                    method: 'POST',
                    body: formData
                });

                const data: ImageCreateResponseDto = await response.json();

                const createdAuction = await prisma.auction.create({
                    data: {
                        ...auction,
                        userId: userId,
                        mainPhoto: data.image.url
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

    async update(token: string | undefined, id: string, auction: Auction, photo: Buffer | undefined) {
        try {
            const payload = verifyToken(token);

            const userId = payload!.userId;

            if(!userId) {
                throw new NotFoundError(UserErrorMessage.notFound);
            }

            let createdAuction;

            try {

                if(photo) {
                    const formData = new FormData();
                    formData.set('source', photo.toString('base64'));
                    formData.set('key', process.env.FREEIMAGE_API_KEY!);
                    

                    const response = await fetch(FreeimageEndpoints.imageUpload, {
                        method: 'POST',
                        body: formData
                    });

                    const data: ImageCreateResponseDto = await response.json();

                    createdAuction = await prisma.auction.update({
                        where: {
                            userId: userId,
                            id: Number(id)
                        },
                        data: {
                            ...auction,
                            mainPhoto: data.image.url
                        }
                    });
                }
                else {
                    createdAuction = await prisma.auction.update({
                        where: {
                            userId: userId,
                            id: Number(id)
                        },
                        data: {
                            ...auction
                        }
                    });
                }
                

                return createdAuction;
            }
            catch(e) {
                console.log(e);
                
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

    async getUsers(id: string) {
        try {
            const users = await prisma.bet.findMany({
                where: {
                    auctionId: Number(id)
                },
                select: {
                    user: {
                        select: {
                            email: true,
                            name: true
                        }
                    },
                }
            });


            return [...new Map(users.map(item => [item.user['email'], item])).values()];
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
