import prisma from "../../client";
import { expireTimeInMilliseconds } from "../../common/constants/token.constants";
import BadRequestError from "../../common/errors/bad-request-error";
import HTTPError from "../../common/errors/http-error";
import InternalServerError from "../../common/errors/internal-server-error";
import UserErrorMessage from "../../common/errors/messages/user-error-message";
import NotFoundError from "../../common/errors/not-found-error";
import AuthLoginDto from "../../common/types/auth/auth.login.dto";
import jwt from "jsonwebtoken";

class AuthService {
    async login({email, password}: AuthLoginDto): Promise<string | undefined> {
        try {
            if(!email || !password) {
                throw new BadRequestError();
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                    password: password
                }
            });

            console.log(email, password);
            
            if(!user) {
                throw new NotFoundError(UserErrorMessage.notFound);
            }

            let token = await prisma.token.findUnique({
                where: {
                    userId: user.id
                }
            });

            if(!token) {
                const tokenString = jwt.sign({ email: email }, process.env.JWT_SECRET!);

                token = await prisma.token.create({
                    data: {
                        token: tokenString,
                        userId: user.id,
                        expires: new Date(new Date().getTime() + expireTimeInMilliseconds) 
                }});
            }

            return token.token;
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

export default AuthService;