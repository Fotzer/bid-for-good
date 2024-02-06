import { User } from "@prisma/client";
import HTTPError from "../../common/errors/http-error";
import InternalServerError from "../../common/errors/internal-server-error";
import prisma from "../../client";
import ConflictError from "../../common/errors/conflict-error";
import UserErrorMessage from "../../common/errors/messages/user-error-message";

class UserService {
    async create({email, password}: User): Promise<User | undefined> {
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

            return user;
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