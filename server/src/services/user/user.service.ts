import { User } from "@prisma/client";
import HTTPError from "../../common/errors/http-error";
import InternalServerError from "../../common/errors/internal-server-error";
import prisma from "../../client";
import ConflictError from "../../common/errors/conflict-error";
import UserErrorMessage from "../../common/errors/messages/user-error-message";
import jwt from 'jsonwebtoken';
import UserCreateResponseDto from "../../common/types/user/user.create.response.dto";
import { expireTimeInMilliseconds } from "../../common/constants/token.constants";

class UserService {
    async create({email, password}: User): Promise<UserCreateResponseDto | undefined> {
        try {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email: email
                }
            });

            if(existingUser) {
                throw new ConflictError(UserErrorMessage.alreadyExists);
            }
            const user = await prisma.user.create({
                data: {
                    email: email,
                    password: password,
                }
            });

            const token = jwt.sign({ email: email }, process.env.JWT_SECRET!);

            await prisma.token.create({
                data: {
                    token: token,
                    userId: user.id,
                    expires: new Date(new Date().getTime() + expireTimeInMilliseconds) 
            }});

            return {
                user:user,
                token: token
            };
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

export default UserService;